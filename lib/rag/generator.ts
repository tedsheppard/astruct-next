import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import type { ClassifiedQuery, ConversationMessage, StreamCallbacks } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function isClaudeModel(model: string): boolean {
  return model.startsWith('claude-')
}

const WEAK_CLAUDE = ['claude-haiku-4-5-20251001']
const WEAK_GPT = ['gpt-5-nano', 'gpt-5.4-nano']

function selectModel(query: ClassifiedQuery, requestedModel: string): { model: string; wasUpgraded: boolean } {
  const isClaude = isClaudeModel(requestedModel)
  const isWeak = [...WEAK_CLAUDE, ...WEAK_GPT].includes(requestedModel)

  // For complex tasks, upgrade within the same provider (never cross providers)
  if ((query.queryType === 'drafting' || query.queryType === 'analysis' || query.complexity === 'complex') && isWeak) {
    const upgraded = isClaude ? 'claude-sonnet-4-6' : 'gpt-5.4'
    console.log(`[RAG:Generator] Upgraded model from ${requestedModel} to ${upgraded}`)
    return { model: upgraded, wasUpgraded: true }
  }

  // Respect user's explicit model choice
  if (requestedModel) {
    return { model: requestedModel, wasUpgraded: false }
  }

  // Default
  switch (query.queryType) {
    case 'casual': return { model: 'claude-haiku-4-5-20251001', wasUpgraded: false }
    default: return { model: requestedModel || 'claude-sonnet-4-6', wasUpgraded: false }
  }
}

function shouldUseExtendedThinking(query: ClassifiedQuery): boolean {
  return query.queryType === 'analysis' || query.queryType === 'drafting' || query.complexity === 'complex'
}

export async function generate(
  systemPrompt: string,
  conversationHistory: ConversationMessage[],
  query: ClassifiedQuery,
  requestedModel: string,
  callbacks: StreamCallbacks
): Promise<string> {
  const { model, wasUpgraded } = selectModel(query, requestedModel)
  const useThinking = shouldUseExtendedThinking(query) && isClaudeModel(model) && model !== 'claude-haiku-4-5-20251001'

  // Emit model info
  const modelLabel = model.replace('claude-', '').replace('gpt-', 'GPT-').replace('opus-4-6', 'Opus 4.6').replace('sonnet-4-6', 'Sonnet 4.6').replace('haiku-4-5-20251001', 'Haiku 4.5')
  if (wasUpgraded) {
    callbacks.onThinkingState(`Upgraded to ${modelLabel} for better quality`)
  }

  // Trim conversation history: last 10 turns, strip document JSON from older messages
  const trimmedHistory = conversationHistory.slice(-20).map((m, i, arr) => {
    // Keep last 2 messages intact, strip document JSON from older ones
    if (i >= arr.length - 4) return m
    return {
      ...m,
      content: m.content.replace(/---DOCUMENT_START---[\s\S]*?---DOCUMENT_END---/g, '[previously generated document]'),
    }
  })

  let fullResponse = ''

  if (isClaudeModel(model)) {
    if (useThinking) {
      // Extended thinking mode
      const stream = await anthropic.messages.create({
        model,
        max_tokens: 30000,
        temperature: 1, // Required for extended thinking
        thinking: { type: 'enabled', budget_tokens: query.queryType === 'drafting' ? 12000 : 8000 },
        system: systemPrompt,
        stream: true,
        messages: trimmedHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      })

      let inThinking = false
      for await (const event of stream) {
        if (event.type === 'content_block_start') {
          if ('type' in event.content_block && event.content_block.type === 'thinking') {
            inThinking = true
            callbacks.onThinkingState('Reasoning through the problem...')
          } else {
            inThinking = false
          }
        } else if (event.type === 'content_block_delta') {
          if (!inThinking && event.delta.type === 'text_delta') {
            fullResponse += event.delta.text
            callbacks.onContent(event.delta.text)
          }
          // Skip thinking deltas — don't stream internal reasoning
        }
      }
    } else {
      // Standard streaming
      const stream = await anthropic.messages.create({
        model,
        max_tokens: 30000,
        temperature: 0.4,
        system: systemPrompt,
        stream: true,
        messages: trimmedHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullResponse += event.delta.text
          callbacks.onContent(event.delta.text)
        }
      }
    }
  } else {
    // OpenAI
    const openaiStream = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...trimmedHistory,
      ],
      stream: true,
      max_completion_tokens: 16384,
      temperature: 0.4,
    })
    for await (const chunk of openaiStream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        fullResponse += content
        callbacks.onContent(content)
      }
    }
  }

  return fullResponse
}
