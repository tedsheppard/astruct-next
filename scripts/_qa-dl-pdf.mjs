import { createClient } from '@supabase/supabase-js'
import { writeFile } from 'fs/promises'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const path = 'e4cbf605-51d2-4d8a-bbf8-8434eb856132/1775951876980_7216-SUB-090-WP8-Pensar-FINAL-signed.pdf'
const { data, error } = await sb.storage.from('documents').download(path)
if (error) { console.error(error); process.exit(1) }
const buf = Buffer.from(await data.arrayBuffer())
await writeFile('test-results/full-coverage/uploads/sample-contract.pdf', buf)
console.log(`Wrote ${buf.length} bytes`)
