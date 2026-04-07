/**
 * Seed test data for RAG pipeline testing.
 * Creates a test contract with realistic AS4000-style clauses.
 * Run with: npx tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const TEST_CONTRACT_TEXT = `
GENERAL CONDITIONS OF CONTRACT AS4000-2024

CLAUSE 5 — SUPERINTENDENT

5.1 The Superintendent shall administer the Contract and may give directions to the Contractor. The Superintendent shall act honestly and fairly and in a timely manner.

5.2 The Superintendent may appoint a Superintendent's Representative to exercise any of the Superintendent's functions under the Contract. Such appointment shall be in writing and notified to the Contractor.

5.3 Where the Superintendent is required to form an opinion, make an assessment, or determine a matter under the Contract, the Superintendent shall do so as an independent certifier and not as an agent of the Principal.

CLAUSE 8 — SECURITY AND RETENTION

8.1 If the Contract requires security, the Contractor shall provide security to the Principal in the form and amount stated in the Annexure within 14 days of the date of the Contract.

8.2 The Principal may have recourse to the security where the Contractor fails to comply with an obligation under the Contract. Prior to having recourse, the Principal shall give the Contractor at least 5 business days' written notice.

8.3 Retention shall be deducted from each progress payment at the rate stated in the Annexure until the total retained reaches the percentage of the Contract Sum stated in the Annexure. Retention money shall be held on trust.

CLAUSE 33 — DELAY AND EXTENSION OF TIME

33.1 If the Contractor is or will be delayed in reaching Practical Completion by a Qualifying Cause of Delay, the Contractor shall, within 28 days of becoming aware of the delay, give the Superintendent a written claim for an extension of time, including:
(a) the Qualifying Cause of Delay relied upon;
(b) the estimated delay to Practical Completion; and
(c) the basis upon which the extension of time is claimed.

33.2 Qualifying Causes of Delay include:
(a) an act, default, or omission of the Principal, the Superintendent, or their employees or agents;
(b) variations directed under Clause 34;
(c) latent conditions;
(d) inclement weather which, having regard to the climatic conditions of the site, could not reasonably have been anticipated;
(e) industrial action affecting the whole or a significant part of the building and construction industry;
(f) delays caused by civil authorities or utility providers;
(g) any other cause stated in the Annexure as a Qualifying Cause of Delay.

33.3 The Superintendent shall assess the claim and grant such extension of time as the Superintendent considers the Contractor is fairly entitled to within 28 days of receiving the claim.

33.4 If the Contractor fails to give notice within the time required by Clause 33.1, the Contractor's entitlement to an extension of time shall be limited to such extension of time as the Superintendent considers the Contractor is fairly entitled to, having regard to the extent to which the late giving of notice has prejudiced the Principal.

CLAUSE 34 — VARIATIONS

34.1 The Superintendent may direct the Contractor in writing to vary the work under the Contract. A variation may involve any one or more of the following:
(a) an increase or decrease in the quantity of any item of work under the Contract;
(b) a change to the character or quality of any material or work;
(c) a change in the levels, lines, positions, or dimensions of any part of the Works;
(d) the execution of additional work;
(e) the demolition or removal of work or materials.

34.2 The Contractor shall not vary the work under the Contract unless directed by the Superintendent.

34.3 The Contractor shall, within 14 days of receiving a direction to vary the work, submit to the Superintendent a detailed quotation for the variation, including:
(a) a description of the work;
(b) a breakdown of costs;
(c) the time required to carry out the variation;
(d) the effect, if any, on the Contract Sum and the Date for Practical Completion.

34.4 If the parties cannot agree on the valuation of a variation, the variation shall be valued by the Superintendent in accordance with the following:
(a) where the variation is of a similar character and executed under similar conditions to work priced in the Contract, at the rates and prices in the Contract;
(b) where the variation is not of a similar character, at rates and prices that are reasonable having regard to the nature and extent of the variation.

34.5 A direction to vary the work shall not invalidate the Contract, and the Contractor shall carry out the variation notwithstanding that the valuation has not been agreed or determined.

CLAUSE 35 — DEFECTS LIABILITY

35.1 The Defects Liability Period shall commence on the Date of Practical Completion and shall expire at the time stated in the Annexure. If no time is stated, the Defects Liability Period shall be 12 months.

35.2 During the Defects Liability Period, the Contractor shall rectify all defects that appear and which are due to defective materials, workmanship, or the Contractor's failure to comply with the Contract, at no cost to the Principal.

35.3 The Superintendent shall give the Contractor a written direction to rectify a defect, specifying a reasonable time for rectification.

35.4 If the Contractor fails to rectify a defect within the time specified, the Principal may have the defect rectified by others and recover the cost from the Contractor.

CLAUSE 36 — LIQUIDATED DAMAGES

36.1 If the Contractor fails to reach Practical Completion by the Date for Practical Completion (as extended under Clause 33), the Contractor shall pay the Principal liquidated damages at the rate stated in the Annexure for every day after the Date for Practical Completion to and including the Date of Practical Completion.

36.2 Liquidated damages shall be a genuine pre-estimate of the loss and damage likely to be suffered by the Principal as a result of late completion.

36.3 The Principal may deduct liquidated damages from any amount due to the Contractor. The deduction of liquidated damages shall not relieve the Contractor of the obligation to complete the work under the Contract.

36.4 If the Superintendent grants an extension of time after the Principal has deducted liquidated damages, the Principal shall repay to the Contractor any liquidated damages which were not due having regard to the extension.

CLAUSE 37 — PAYMENT

37.1 The Contractor shall submit progress claims to the Superintendent at the times stated in the Annexure or, if no times are stated, at the end of each calendar month. Each progress claim shall include:
(a) the value of work carried out since the last progress claim;
(b) the value of unfixed materials on site;
(c) any amounts claimed under the Contract, including for variations and claims for additional costs.

37.2 Within 15 business days of receiving a progress claim, the Superintendent shall issue a progress certificate stating the amount assessed as due to the Contractor.

37.3 The Principal shall pay the Contractor the amount certified within the time stated in the Annexure from the date of the progress certificate.

37.4 Payment shall not constitute approval of the work or evidence that the work has been carried out in accordance with the Contract.

37.5 The Contractor's entitlement to payment under the Building Industry Fairness (Security of Payment) Act 2017 (Qld) (SOPA) is not affected by this Clause. Payment claims under SOPA must comply with the requirements of that Act.

CLAUSE 41 — SUSPENSION

41.1 The Superintendent may at any time direct the Contractor in writing to suspend the whole or any part of the work under the Contract.

41.2 If the Contractor is directed to suspend the work for reasons other than the Contractor's default, the Contractor shall be entitled to:
(a) an extension of time for the period of the suspension; and
(b) payment of the Contractor's reasonable costs arising from the suspension.

41.3 If the suspension continues for more than 90 days, either party may terminate the Contract by giving 14 days' written notice.

CLAUSE 42 — PRACTICAL COMPLETION

42.1 The Contractor shall give the Superintendent written notice when the Contractor is of the opinion that Practical Completion has been reached.

42.2 Within 14 days of receiving the Contractor's notice, the Superintendent shall either:
(a) issue a Certificate of Practical Completion; or
(b) give the Contractor written notice stating the reasons why the Superintendent considers that Practical Completion has not been reached.

42.3 Practical Completion is reached when:
(a) the work under the Contract is complete except for minor defects that do not prevent the Works from being reasonably capable of being used for their intended purpose; and
(b) the documents required to be provided by the Contractor have been provided.

42.4 Upon the issue of the Certificate of Practical Completion:
(a) the risk of loss or damage to the Works passes to the Principal;
(b) the Defects Liability Period commences; and
(c) the Contractor shall be entitled to the release of one-half of the retention held by the Principal.

CLAUSE 44 — DISPUTE RESOLUTION

44.1 If a dispute arises under the Contract, a party may give the other party and the Superintendent a written notice of dispute (Notice of Dispute).

44.2 Within 28 days of the Notice of Dispute, the parties shall confer and use reasonable endeavours to resolve the dispute by negotiation.

44.3 If the dispute is not resolved within 28 days, either party may refer the dispute to:
(a) mediation in accordance with the mediation rules of the Resolution Institute; or
(b) if mediation fails or is not agreed, arbitration in accordance with the arbitration rules of the Resolution Institute.

44.4 Despite the existence of a dispute, each party shall continue to perform its obligations under the Contract.

44.5 Nothing in this Clause prevents a party from seeking urgent interlocutory relief from a court of competent jurisdiction.
`

async function main() {
  console.log('=== Seeding test data ===')

  // Check if test user exists (use the demo user)
  const { data: users } = await supabase.auth.admin.listUsers()
  const testUser = users?.users?.find(u => u.email === 'demo@astruct.io')

  if (!testUser) {
    console.error('No demo@astruct.io user found. Please create one first.')
    process.exit(1)
  }

  const userId = testUser.id
  console.log('Using user:', testUser.email, userId)

  // Check for existing test contract
  const { data: existing } = await supabase
    .from('contracts')
    .select('id')
    .eq('user_id', userId)
    .eq('name', 'RAG Test Contract - Riverstone Infrastructure')
    .limit(1)

  if (existing && existing.length > 0) {
    console.log('Test contract already exists:', existing[0].id)
    console.log('Deleting and recreating...')
    await supabase.from('contracts').delete().eq('id', existing[0].id)
  }

  // Create test contract
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      user_id: userId,
      name: 'RAG Test Contract - Riverstone Infrastructure',
      reference_number: 'RI-2024-001',
      contract_form: 'AS4000-2024',
      party1_role: 'Principal',
      party1_name: 'Riverstone Council',
      party1_address: '42 Riverstone Road, Riverstone NSW 2765',
      party2_role: 'Contractor',
      party2_name: 'BuildRight Construction Pty Ltd',
      party2_address: '15 Industrial Drive, Parramatta NSW 2150',
      administrator_role: 'Superintendent',
      administrator_name: 'Mitchell & Associates',
      administrator_address: '100 George Street, Sydney NSW 2000',
      user_is_party: 'party2',
      date_of_contract: '2024-03-15',
      date_practical_completion: '2025-09-30',
      defects_liability_period: '12 months',
      contract_sum: 8500000,
      status: 'active',
    })
    .select('id')
    .single()

  if (contractError || !contract) {
    console.error('Failed to create contract:', contractError)
    process.exit(1)
  }

  console.log('Created contract:', contract.id)

  // Create test document
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert({
      contract_id: contract.id,
      user_id: userId,
      filename: 'AS4000-2024-General-Conditions.pdf',
      file_type: 'application/pdf',
      file_size: TEST_CONTRACT_TEXT.length,
      category: '01_contract',
      ai_summary: 'General Conditions of Contract AS4000-2024 covering variations, delay, payment, completion, defects, liquidated damages, dispute resolution',
      extracted_text: TEST_CONTRACT_TEXT,
      processed: true,
    })
    .select('id')
    .single()

  if (docError || !doc) {
    console.error('Failed to create document:', docError)
    process.exit(1)
  }

  console.log('Created document:', doc.id)

  // Chunk and embed
  const { chunkText, extractClauseNumbers, detectSectionHeading } = await import('../lib/chunking')

  const chunks = chunkText(TEST_CONTRACT_TEXT)
  console.log(`Chunked into ${chunks.length} chunks`)

  // Embed all chunks
  console.log('Embedding chunks with text-embedding-3-large...')
  const batchSize = 20
  const allEmbeddings: number[][] = []
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: batch,
      dimensions: 1536,
    })
    allEmbeddings.push(...response.data.map(d => d.embedding))
    console.log(`  Embedded ${Math.min(i + batchSize, chunks.length)}/${chunks.length}`)
  }

  // Insert chunks
  const chunkRows = chunks.map((content, index) => ({
    document_id: doc.id,
    contract_id: contract.id,
    chunk_index: index,
    content,
    embedding: JSON.stringify(allEmbeddings[index]),
    section_heading: detectSectionHeading(content),
    clause_numbers: extractClauseNumbers(content),
    metadata: {
      filename: 'AS4000-2024-General-Conditions.pdf',
      chunk_of: chunks.length,
    },
  }))

  const { error: chunkError } = await supabase
    .from('document_chunks')
    .insert(chunkRows)

  if (chunkError) {
    console.error('Chunk insert error:', chunkError)
    process.exit(1)
  }

  console.log(`Inserted ${chunks.length} chunks`)

  // Verify search works
  console.log('\n=== Verifying hybrid search ===')
  const testEmb = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: 'What are the variation provisions?',
    dimensions: 1536,
  })

  const { data: searchResults, error: searchError } = await supabase.rpc('hybrid_search_chunks', {
    query_embedding: testEmb.data[0].embedding,
    query_text: 'variation provisions clause 34',
    match_threshold: 0.3,
    match_count: 5,
    filter_contract_id: contract.id,
    filter_document_ids: null,
  })

  if (searchError) {
    console.error('Search error:', searchError)
  } else {
    console.log(`Search returned ${searchResults?.length || 0} results`)
    for (const r of (searchResults || []).slice(0, 3)) {
      console.log(`  Score: ${r.combined_score?.toFixed(3)} | Heading: ${r.section_heading || 'none'} | Preview: ${r.content?.slice(0, 80)}...`)
    }
  }

  console.log('\n=== DONE ===')
  console.log(`Contract ID: ${contract.id}`)
  console.log('Use this ID in test-rag.ts')
}

main().catch(console.error)
