export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, string> = {}

  // Check env vars
  checks.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING'
  checks.SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
  checks.SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING'
  checks.OPENAI = process.env.OPENAI_API_KEY ? 'SET' : 'MISSING'
  checks.ANTHROPIC = process.env.ANTHROPIC_API_KEY ? 'SET' : 'MISSING'

  // Test Anthropic API connectivity
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say "ok"' }],
      }),
    })
    const data = await res.json()
    checks.ANTHROPIC_TEST = res.ok ? 'OK' : `FAIL: ${data.error?.message || res.status}`
  } catch (e) {
    checks.ANTHROPIC_TEST = `ERROR: ${e instanceof Error ? e.message : 'unknown'}`
  }

  // Test OpenAI API connectivity
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Say ok' }],
      }),
    })
    const data = await res.json()
    checks.OPENAI_TEST = res.ok ? 'OK' : `FAIL: ${data.error?.message || res.status}`
  } catch (e) {
    checks.OPENAI_TEST = `ERROR: ${e instanceof Error ? e.message : 'unknown'}`
  }

  // Test Supabase connectivity
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/contracts?select=count&limit=1`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
      },
    })
    checks.SUPABASE_TEST = res.ok ? 'OK' : `FAIL: ${res.status}`
  } catch (e) {
    checks.SUPABASE_TEST = `ERROR: ${e instanceof Error ? e.message : 'unknown'}`
  }

  // Test PDF extraction
  try {
    const { createClient: createSB } = await import('@supabase/supabase-js')
    const sb = createSB(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: files } = await sb.storage.from('documents').list('e4cbf605-51d2-4d8a-bbf8-8434eb856132', { limit: 1 })
    if (files && files.length > 0) {
      const path = 'e4cbf605-51d2-4d8a-bbf8-8434eb856132/' + files[0].name
      const { data } = await sb.storage.from('documents').download(path)
      if (data) {
        const buffer = Buffer.from(await data.arrayBuffer())
        checks.PDF_FILE = `${files[0].name} (${buffer.length} bytes)`
        try {
          const { extractText } = await import('unpdf')
          const result = await extractText(new Uint8Array(buffer))
          const text = Array.isArray(result.text) ? result.text.join('\n') : result.text
          checks.PDF_EXTRACT = `OK: ${text.length} chars`
        } catch (e) {
          checks.PDF_EXTRACT = `FAIL: ${e instanceof Error ? e.message : e}`
        }
      }
    } else {
      checks.PDF_EXTRACT = 'NO_FILES'
    }
  } catch (e) {
    checks.PDF_EXTRACT = `ERROR: ${e instanceof Error ? e.message : e}`
  }

  return Response.json({ status: 'ok', timestamp: new Date().toISOString(), checks })
}
