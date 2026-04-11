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

  return Response.json({ status: 'ok', timestamp: new Date().toISOString(), checks })
}
