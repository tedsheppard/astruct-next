-- Migration 017: Obligations v2 — trigger events, clause priors, enriched obligation columns
-- Adds structured obligation tracking with Australian Standard contract form priors

--------------------------------------------------------------------------------
-- 1. ALTER TABLE obligations — add new columns safely
--------------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'obligation_class') THEN
    ALTER TABLE public.obligations ADD COLUMN obligation_class text DEFAULT 'pending' CHECK (obligation_class IN ('standing','pending','completed','expired','voided'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'trigger_event_id') THEN
    ALTER TABLE public.obligations ADD COLUMN trigger_event_id uuid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'time_period_text') THEN
    ALTER TABLE public.obligations ADD COLUMN time_period_text text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'time_period_days') THEN
    ALTER TABLE public.obligations ADD COLUMN time_period_days integer;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'consequence') THEN
    ALTER TABLE public.obligations ADD COLUMN consequence text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'party_responsible') THEN
    ALTER TABLE public.obligations ADD COLUMN party_responsible text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'clause_text_snippet') THEN
    ALTER TABLE public.obligations ADD COLUMN clause_text_snippet text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'document_id') THEN
    ALTER TABLE public.obligations ADD COLUMN document_id uuid REFERENCES public.documents(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'explanation') THEN
    ALTER TABLE public.obligations ADD COLUMN explanation text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'obligations' AND column_name = 'confidence') THEN
    ALTER TABLE public.obligations ADD COLUMN confidence numeric(3,2) DEFAULT 0.90;
  END IF;
END $$;

--------------------------------------------------------------------------------
-- 2. CREATE TABLE trigger_events
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trigger_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('document','correspondence','integration_sync','manual')),
  source_id uuid,
  source_name text,
  event_type text,
  event_date timestamptz NOT NULL,
  description text,
  raw_context text,
  clause_refs text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.trigger_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trigger_events' AND policyname = 'Users manage own trigger events') THEN
    CREATE POLICY "Users manage own trigger events" ON public.trigger_events FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add FK from obligations to trigger_events now that the table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'obligations_trigger_event_id_fkey'
      AND table_name = 'obligations'
  ) THEN
    ALTER TABLE public.obligations
      ADD CONSTRAINT obligations_trigger_event_id_fkey
      FOREIGN KEY (trigger_event_id) REFERENCES public.trigger_events(id);
  END IF;
END $$;

--------------------------------------------------------------------------------
-- 3. CREATE TABLE obligation_clause_priors
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.obligation_clause_priors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_form text NOT NULL,
  clause_number text NOT NULL,
  clause_title text,
  obligation_type text,
  time_period_days integer,
  time_period_text text,
  trigger_description text,
  party_responsible text,
  consequence text,
  is_time_bar boolean DEFAULT false,
  UNIQUE(contract_form, clause_number, obligation_type)
);

--------------------------------------------------------------------------------
-- 4. CREATE INDEXES
--------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_obligations_class_due
  ON public.obligations (contract_id, obligation_class, due_date);

CREATE INDEX IF NOT EXISTS idx_trigger_events_contract_date
  ON public.trigger_events (contract_id, event_date);

--------------------------------------------------------------------------------
-- 5. SEED obligation_clause_priors
--------------------------------------------------------------------------------

-- Clear existing priors to allow re-running
DELETE FROM public.obligation_clause_priors;

-- =============================================================================
-- AS 4000-1997 — General Conditions of Contract
-- =============================================================================
INSERT INTO public.obligation_clause_priors
  (contract_form, clause_number, clause_title, obligation_type, time_period_days, time_period_text, trigger_description, party_responsible, consequence, is_time_bar)
VALUES
-- Clause 3: Superintendent
('AS4000-1997', '3.1', 'Superintendent — general obligations', 'standing', NULL, 'ongoing', 'Superintendent must act honestly and fairly and within the time prescribed', 'superintendent', 'Breach of contractual duty; principal liable for superintendent failures', false),

-- Clause 5: Security
('AS4000-1997', '5.1', 'Security — provision', 'submission', 14, 'within 14 days of acceptance of tender', 'Contract is executed or letter of acceptance issued', 'contractor', 'Principal may withhold payment or treat as substantial breach', true),

-- Clause 7: Service of notices
('AS4000-1997', '7', 'Service of notices', 'standing', NULL, 'ongoing', 'Any notice required under the contract', 'contractor', 'Notice may be ineffective if not served in accordance with clause', false),
('AS4000-1997', '7', 'Service of notices', 'standing', NULL, 'ongoing', 'Any notice required under the contract', 'principal', 'Notice may be ineffective if not served in accordance with clause', false),

-- Clause 8: Contract documents
('AS4000-1997', '8.1', 'Discrepancies in documents', 'notice', 7, 'within 7 days of discovery', 'Contractor discovers discrepancy or ambiguity in contract documents', 'contractor', 'Superintendent may direct and contractor bears cost of non-compliance', false),

-- Clause 10: Site access
('AS4000-1997', '10', 'Site access', 'standing', NULL, 'by the date for site possession stated in Annexure', 'Date for possession of site', 'principal', 'Contractor entitled to EOT and delay costs', false),

-- Clause 12: Superintendent directions
('AS4000-1997', '12.1', 'Compliance with directions', 'response', 7, 'within 7 days of receiving direction', 'Superintendent issues a written direction', 'contractor', 'Must comply; may object in writing within 7 days if considers direction is a variation', false),
('AS4000-1997', '12.2', 'Objection to direction as variation', 'notice', 7, 'within 7 days of receiving direction', 'Contractor receives a direction it considers is a variation', 'contractor', 'Failure to object within 7 days — deemed acceptance that direction is not a variation', true),

-- Clause 14: Program
('AS4000-1997', '14.1', 'Submission of program', 'submission', 14, 'within 14 days of acceptance of tender', 'Contract is formed', 'contractor', 'Superintendent may withhold certification of payment claims', false),
('AS4000-1997', '14.2', 'Revised program', 'submission', 14, 'within 14 days of a direction to revise', 'Superintendent directs revision of program or circumstances change materially', 'contractor', 'Superintendent may withhold certification', false),

-- Clause 16: Statutory requirements
('AS4000-1997', '16.1', 'Compliance with statutory requirements', 'notice', 7, 'within 7 days of becoming aware', 'Contractor becomes aware of any inconsistency between contract and statutory requirements', 'contractor', 'Contractor liable for consequences of non-compliance', false),

-- Clause 17: Protection of people and property
('AS4000-1997', '17.3', 'Notice of damage or injury', 'notice', 3, 'within 3 days of occurrence', 'Damage or injury occurs on or near the site', 'contractor', 'May prejudice insurance claim or contractual position', false),

-- Clause 18: Insurance
('AS4000-1997', '18.1', 'Evidence of insurance', 'submission', 7, 'within 7 days of request', 'Principal or superintendent requests evidence of insurance', 'contractor', 'Principal may effect insurance at contractor cost or terminate', true),

-- Clause 20: Latent conditions
('AS4000-1997', '20.1', 'Notice of latent condition', 'notice', 28, 'within 28 days of becoming aware', 'Contractor encounters a latent condition on site differing materially from what was foreseeable', 'contractor', 'Contractor loses entitlement to claim for latent condition — strict time bar', true),
('AS4000-1997', '20.2', 'Superintendent assessment of latent condition', 'assessment', 28, 'within 28 days of receiving notice', 'Contractor gives notice of latent condition under 20.1', 'superintendent', 'Principal may be liable for delay; deemed acceptance possible', false),

-- Clause 21: Subcontractors
('AS4000-1997', '21.1', 'Approval of subcontractors', 'submission', 7, 'before engaging subcontractor', 'Contractor proposes to subcontract part of the work', 'contractor', 'Superintendent may direct removal of unapproved subcontractor', false),

-- Clause 23: Provisional sums
('AS4000-1997', '23.1', 'Direction regarding provisional sums', 'direction', NULL, 'as directed by superintendent', 'Contract includes provisional sums', 'superintendent', 'Amount adjusted in final certificate if not directed', false),

-- Clause 25: Dispute resolution — notice
('AS4000-1997', '25.1', 'Notice of dispute', 'notice', 28, 'within 28 days of the event or direction giving rise to the dispute', 'A party considers a dispute exists', 'contractor', 'May lose right to pursue the dispute', true),
('AS4000-1997', '25.1', 'Notice of dispute', 'notice', 28, 'within 28 days of the event or direction giving rise to the dispute', 'A party considers a dispute exists', 'principal', 'May lose right to pursue the dispute', true),
('AS4000-1997', '25.2', 'Conference', 'response', 14, 'within 14 days of notice of dispute', 'Notice of dispute is served under 25.1', 'contractor', 'May proceed to next tier of dispute resolution', false),
('AS4000-1997', '25.2', 'Conference', 'response', 14, 'within 14 days of notice of dispute', 'Notice of dispute is served under 25.1', 'principal', 'May proceed to next tier of dispute resolution', false),

-- Clause 27: Assignment
('AS4000-1997', '27', 'Consent to assignment', 'submission', NULL, 'prior written consent required', 'A party proposes to assign rights or obligations', 'contractor', 'Assignment without consent is void', false),

-- Clause 29: Intellectual property
('AS4000-1997', '29.1', 'IP indemnity', 'standing', NULL, 'ongoing', 'Use of design, materials or methods infringes IP rights', 'contractor', 'Contractor indemnifies principal for IP infringement', false),

-- Clause 33: Delay or disruption
('AS4000-1997', '33.1', 'Written notice of delay', 'notice', 28, 'within 28 days of the cause of delay first arising', 'Contractor is or will be delayed in reaching practical completion', 'contractor', 'Contractor not entitled to EOT for that cause of delay — strict time bar', true),
('AS4000-1997', '33.2', 'Delay claim details', 'claim', 28, 'within 28 days of the notice under 33.1 (or as extended)', 'Contractor has given notice of delay under 33.1', 'contractor', 'Superintendent may assess EOT without full particulars; claim may be reduced', true),

-- Clause 34: EOT assessment
('AS4000-1997', '34.1', 'Superintendent EOT assessment', 'assessment', 28, 'within 28 days of receiving the claim', 'Contractor submits EOT claim with details under 33.2', 'superintendent', 'Deemed refusal; contractor may invoke dispute resolution', false),
('AS4000-1997', '34.2', 'Superintendent EOT re-assessment', 'assessment', 28, 'within 28 days of becoming aware of further information', 'New information relevant to EOT becomes available', 'superintendent', 'Must reassess; failure may entitle contractor to dispute', false),

-- Clause 35: Suspension
('AS4000-1997', '35.1', 'Suspension by superintendent', 'direction', NULL, 'as directed', 'Superintendent directs suspension of the whole or part of the work', 'superintendent', 'Contractor entitled to EOT and costs if suspension not caused by contractor', false),
('AS4000-1997', '35.2', 'Resumption after suspension', 'notice', NULL, 'as directed by superintendent', 'Superintendent directs resumption of suspended work', 'contractor', 'Must resume within reasonable time', false),
('AS4000-1997', '35.3', 'Suspension exceeding 60 days', 'notice', NULL, 'if suspension continues for more than 60 days', 'Suspension directed by superintendent exceeds 60 days', 'contractor', 'Contractor may treat prolonged suspension as omission of that work (variation)', false),

-- Clause 36: Variations
('AS4000-1997', '36.1', 'Variation direction', 'direction', NULL, 'as directed by superintendent', 'Superintendent issues a variation direction', 'superintendent', 'Contractor must comply unless objects under 36.2', false),
('AS4000-1997', '36.2', 'Objection to variation', 'notice', 14, 'within 14 days of receiving variation direction', 'Contractor receives variation direction under 36.1', 'contractor', 'Deemed acceptance of variation direction if no objection within 14 days', true),
('AS4000-1997', '36.3', 'Variation proposal / quotation', 'submission', 14, 'within 14 days of direction or as agreed', 'Superintendent directs contractor to provide a variation quotation', 'contractor', 'Superintendent may direct variation and value it in absence of quotation', false),
('AS4000-1997', '36.4', 'Superintendent valuation of variation', 'assessment', 28, 'within 28 days of receiving quotation or performing work', 'Variation is performed or quotation submitted', 'superintendent', 'Contractor may dispute valuation', false),

-- Clause 37: Payment claims and certificates
('AS4000-1997', '37.1', 'Payment claim submission', 'claim', NULL, 'on or before the day of each month stated in Annexure Part A', 'The relevant day of each month (default: 25th)', 'contractor', 'Delay in receiving payment; no payment until valid claim submitted', false),
('AS4000-1997', '37.1', 'Final payment claim', 'claim', 28, 'within 28 days after practical completion (or as stated in Annexure)', 'Practical completion is certified', 'contractor', 'Contractor may forfeit right to unmade claims — time bar on final claim', true),
('AS4000-1997', '37.2', 'Payment certificate', 'assessment', 14, 'within 14 days of receiving payment claim', 'Contractor submits a payment claim', 'superintendent', 'Principal must still pay; superintendent in breach of duty', false),
('AS4000-1997', '37.3', 'Time for payment', 'response', 28, 'within 28 days of receiving payment claim (or as stated in Annexure)', 'Superintendent issues payment certificate', 'principal', 'Interest accrues under clause 37.5', false),
('AS4000-1997', '37.5', 'Interest on late payment', 'standing', NULL, 'ongoing from due date', 'Payment not made by due date under 37.3', 'principal', 'Interest accrues at rate stated in Annexure Part A', false),

-- Clause 38: Certificates generally
('AS4000-1997', '38', 'Certificates — general', 'assessment', 14, 'within 14 days of obligation to certify arising', 'Any event requiring superintendent certification', 'superintendent', 'Principal liable for superintendent failure to certify on time', false),

-- Clause 39: Default and termination
('AS4000-1997', '39.1', 'Show cause notice (contractor default)', 'notice', NULL, 'issued when substantial breach occurs', 'Contractor commits a substantial breach of contract', 'principal', 'Must follow process before termination', false),
('AS4000-1997', '39.2', 'Contractor response to show cause', 'response', 14, 'within 14 days of receiving show cause notice', 'Principal issues show cause notice under 39.1', 'contractor', 'Principal may exercise rights under 39.4 (take-out or terminate)', true),
('AS4000-1997', '39.3', 'Show cause notice (principal default)', 'notice', NULL, 'issued when substantial breach occurs', 'Principal commits a substantial breach of contract', 'contractor', 'Must follow process before termination', false),
('AS4000-1997', '39.4', 'Take-out / termination', 'direction', NULL, 'after show cause period expires without remedy', 'Show cause notice period expires and breach not remedied', 'principal', 'Principal may take work out of contractor hands or terminate', false),

-- Clause 40: Practical completion
('AS4000-1997', '40.1', 'Practical completion notice', 'notice', NULL, 'when contractor considers work reached practical completion', 'Contractor considers the works are practically complete', 'contractor', 'Practical completion not certified until notice given and superintendent satisfied', false),
('AS4000-1997', '40.2', 'Superintendent PC assessment', 'assessment', 14, 'within 14 days of receiving notice', 'Contractor gives notice of practical completion under 40.1', 'superintendent', 'Delay in certifying PC; liquidated damages implications', false),
('AS4000-1997', '40.3', 'Liquidated damages', 'standing', NULL, 'ongoing from date for PC until certified PC', 'Practical completion not achieved by date for PC (as extended)', 'contractor', 'Liquidated damages accrue at rate in Annexure Part A', false),

-- Clause 41: Defects liability
('AS4000-1997', '41.1', 'Defects liability period', 'standing', NULL, 'defects liability period stated in Annexure Part A', 'Practical completion is certified', 'contractor', 'Contractor must rectify defects notified during DLP', false),
('AS4000-1997', '41.2', 'Direction to rectify defects', 'direction', NULL, 'within DLP', 'Superintendent identifies a defect', 'superintendent', 'Contractor must rectify within time directed', false),
('AS4000-1997', '41.3', 'Contractor failure to rectify', 'notice', 14, 'reasonable time as directed (minimum 14 days)', 'Contractor fails to rectify defects as directed', 'principal', 'Principal may have defects rectified by others and recover cost', false),
('AS4000-1997', '41.5', 'Final certificate', 'assessment', 28, 'within 28 days of end of DLP and satisfaction of all obligations', 'Defects liability period expires and all defects rectified', 'superintendent', 'Final certificate must issue; contractor entitled to final payment', false),

-- Clause 42: Dispute resolution
('AS4000-1997', '42.1', 'Negotiation period', 'response', 28, 'within 28 days of notice of dispute', 'Notice of dispute served under clause 25', 'contractor', 'If not resolved, party may refer to expert determination or arbitration', false),
('AS4000-1997', '42.1', 'Negotiation period', 'response', 28, 'within 28 days of notice of dispute', 'Notice of dispute served under clause 25', 'principal', 'If not resolved, party may refer to expert determination or arbitration', false),
('AS4000-1997', '42.2', 'Referral to expert / arbitration', 'submission', 42, 'within 42 days of notice of dispute (if not resolved)', 'Negotiation under 42.1 fails to resolve dispute', 'contractor', 'Dispute may be deemed abandoned if not referred', true),

-- Clause 44: Acceleration
('AS4000-1997', '44.1', 'Superintendent direction to accelerate', 'direction', NULL, 'as directed', 'Superintendent considers acceleration necessary', 'superintendent', 'Contractor may provide proposal under 44.2', false),
('AS4000-1997', '44.2', 'Acceleration proposal', 'submission', 14, 'within 14 days of direction to accelerate', 'Superintendent directs acceleration under 44.1', 'contractor', 'Superintendent may direct acceleration without agreed price', false),


-- =============================================================================
-- AS 4000-2025 — General Conditions of Contract (new edition)
-- Updated clause numbering; many substantive obligations carried forward
-- =============================================================================

-- Clause 3: Superintendent
('AS4000-2025', '3.1', 'Superintendent — general obligations', 'standing', NULL, 'ongoing', 'Superintendent must act honestly and fairly', 'superintendent', 'Principal liable for superintendent failures', false),

-- Clause 5: Security
('AS4000-2025', '5.1', 'Security — provision', 'submission', 14, 'within 14 days of contract formation', 'Contract is formed', 'contractor', 'Principal may withhold payment or treat as breach', true),

-- Clause 8: Contract documents
('AS4000-2025', '8.1', 'Discrepancies in documents', 'notice', 7, 'within 7 days of discovery', 'Contractor discovers discrepancy or ambiguity', 'contractor', 'Superintendent may direct at contractor cost', false),

-- Clause 12: Directions
('AS4000-2025', '12.1', 'Compliance with directions', 'response', 7, 'within 7 days of receiving direction', 'Superintendent issues a written direction', 'contractor', 'Must comply; may object in writing within 7 days', false),
('AS4000-2025', '12.2', 'Objection to direction as variation', 'notice', 7, 'within 7 days of receiving direction', 'Contractor considers direction is a variation', 'contractor', 'Failure to object — deemed not a variation', true),

-- Clause 14: Program
('AS4000-2025', '14.1', 'Submission of program', 'submission', 14, 'within 14 days of contract formation', 'Contract is formed', 'contractor', 'Superintendent may withhold certification', false),
('AS4000-2025', '14.2', 'Revised program', 'submission', 14, 'within 14 days of direction to revise', 'Superintendent directs revision or material change occurs', 'contractor', 'Superintendent may withhold certification', false),

-- Clause 16: Statutory requirements
('AS4000-2025', '16.1', 'Compliance with statutory requirements', 'notice', 7, 'within 7 days of becoming aware', 'Inconsistency between contract and statutory requirements discovered', 'contractor', 'Contractor liable for consequences of non-compliance', false),

-- Clause 18: Insurance
('AS4000-2025', '18.1', 'Evidence of insurance', 'submission', 7, 'within 7 days of request', 'Principal or superintendent requests evidence', 'contractor', 'Principal may effect insurance at contractor cost', true),

-- Clause 20: Latent conditions
('AS4000-2025', '20.1', 'Notice of latent condition', 'notice', 28, 'within 28 days of becoming aware', 'Contractor encounters latent condition differing materially from foreseeable', 'contractor', 'Contractor loses entitlement to claim — strict time bar', true),
('AS4000-2025', '20.2', 'Superintendent assessment of latent condition', 'assessment', 28, 'within 28 days of receiving notice', 'Contractor gives notice under 20.1', 'superintendent', 'Principal may be liable for delay', false),

-- Clause 25: Disputes
('AS4000-2025', '25.1', 'Notice of dispute', 'notice', 28, 'within 28 days of event giving rise to dispute', 'A party considers a dispute exists', 'contractor', 'May lose right to pursue dispute', true),
('AS4000-2025', '25.1', 'Notice of dispute', 'notice', 28, 'within 28 days of event giving rise to dispute', 'A party considers a dispute exists', 'principal', 'May lose right to pursue dispute', true),
('AS4000-2025', '25.2', 'Conference', 'response', 14, 'within 14 days of notice of dispute', 'Notice of dispute served', 'contractor', 'May proceed to next tier', false),

-- Clause 33: Delay
('AS4000-2025', '33.1', 'Written notice of delay', 'notice', 28, 'within 28 days of delay cause first arising', 'Contractor is or will be delayed in reaching PC', 'contractor', 'Contractor not entitled to EOT — strict time bar', true),
('AS4000-2025', '33.2', 'Delay claim details', 'claim', 28, 'within 28 days of notice under 33.1', 'Notice of delay given under 33.1', 'contractor', 'Claim may be reduced or refused', true),

-- Clause 34: EOT
('AS4000-2025', '34.1', 'Superintendent EOT assessment', 'assessment', 28, 'within 28 days of receiving claim', 'Contractor submits EOT claim', 'superintendent', 'Deemed refusal; contractor may dispute', false),
('AS4000-2025', '34.2', 'Superintendent EOT re-assessment', 'assessment', 28, 'within 28 days of new information', 'New information relevant to EOT', 'superintendent', 'Must reassess', false),

-- Clause 35: Suspension
('AS4000-2025', '35.1', 'Suspension by superintendent', 'direction', NULL, 'as directed', 'Superintendent directs suspension', 'superintendent', 'Contractor entitled to EOT and costs', false),
('AS4000-2025', '35.3', 'Prolonged suspension (60+ days)', 'notice', NULL, 'after 60 days continuous suspension', 'Suspension exceeds 60 days', 'contractor', 'Contractor may treat as omission', false),

-- Clause 36: Variations
('AS4000-2025', '36.1', 'Variation direction', 'direction', NULL, 'as directed', 'Superintendent issues variation direction', 'superintendent', 'Contractor must comply unless objects', false),
('AS4000-2025', '36.2', 'Objection to variation', 'notice', 14, 'within 14 days of direction', 'Contractor receives variation direction', 'contractor', 'Deemed acceptance if no objection — time bar', true),
('AS4000-2025', '36.3', 'Variation quotation', 'submission', 14, 'within 14 days of direction', 'Superintendent directs quotation', 'contractor', 'Superintendent may value without quotation', false),
('AS4000-2025', '36.4', 'Superintendent valuation', 'assessment', 28, 'within 28 days of work or quotation', 'Variation performed or quotation submitted', 'superintendent', 'Contractor may dispute valuation', false),

-- Clause 37: Payment
('AS4000-2025', '37.1', 'Payment claim submission', 'claim', NULL, 'on or before day stated in Annexure', 'Relevant day of each month', 'contractor', 'No payment until valid claim submitted', false),
('AS4000-2025', '37.1', 'Final payment claim', 'claim', 28, 'within 28 days after PC', 'Practical completion certified', 'contractor', 'May forfeit right to unmade claims — time bar', true),
('AS4000-2025', '37.2', 'Payment certificate', 'assessment', 14, 'within 14 days of receiving claim', 'Contractor submits payment claim', 'superintendent', 'Principal must pay; superintendent in breach', false),
('AS4000-2025', '37.3', 'Time for payment', 'response', 28, 'within 28 days of receiving claim', 'Payment certificate issued', 'principal', 'Interest accrues', false),
('AS4000-2025', '37.5', 'Interest on late payment', 'standing', NULL, 'ongoing from due date', 'Payment not made by due date', 'principal', 'Interest at Annexure rate', false),

-- Clause 39: Default
('AS4000-2025', '39.1', 'Show cause notice (contractor default)', 'notice', NULL, 'when substantial breach occurs', 'Contractor commits substantial breach', 'principal', 'Must follow process before termination', false),
('AS4000-2025', '39.2', 'Contractor response to show cause', 'response', 14, 'within 14 days of show cause', 'Show cause notice issued', 'contractor', 'Principal may terminate or take out', true),

-- Clause 40: PC
('AS4000-2025', '40.1', 'Notice of practical completion', 'notice', NULL, 'when contractor considers PC achieved', 'Works practically complete', 'contractor', 'PC not certified until notice given', false),
('AS4000-2025', '40.2', 'Superintendent PC assessment', 'assessment', 14, 'within 14 days of notice', 'Contractor gives PC notice', 'superintendent', 'Delay in certifying; LD implications', false),

-- Clause 41: DLP
('AS4000-2025', '41.1', 'Defects liability period', 'standing', NULL, 'per Annexure', 'Practical completion certified', 'contractor', 'Must rectify defects during DLP', false),
('AS4000-2025', '41.5', 'Final certificate', 'assessment', 28, 'within 28 days of DLP end', 'DLP expires and defects rectified', 'superintendent', 'Must issue final certificate', false),

-- Clause 42: Dispute resolution
('AS4000-2025', '42.1', 'Negotiation period', 'response', 28, 'within 28 days of notice of dispute', 'Notice of dispute served', 'contractor', 'May refer to expert/arbitration if unresolved', false),

-- Clause 44: Acceleration
('AS4000-2025', '44.1', 'Direction to accelerate', 'direction', NULL, 'as directed', 'Superintendent considers acceleration necessary', 'superintendent', 'Contractor may provide proposal', false),
('AS4000-2025', '44.2', 'Acceleration proposal', 'submission', 14, 'within 14 days of direction', 'Superintendent directs acceleration', 'contractor', 'Superintendent may direct without agreed price', false),


-- =============================================================================
-- AS 4902-2000 — General Conditions of Contract for Design and Construct
-- =============================================================================

-- Clause 3: Superintendent
('AS4902-2000', '3.1', 'Superintendent — general obligations', 'standing', NULL, 'ongoing', 'Superintendent must act honestly and fairly', 'superintendent', 'Principal liable for superintendent failures', false),

-- Clause 5: Security
('AS4902-2000', '5.1', 'Security — provision', 'submission', 14, 'within 14 days of contract formation', 'Contract is formed', 'contractor', 'Principal may withhold payment or treat as breach', true),

-- Clause 8: Design obligations
('AS4902-2000', '8.1', 'Contractor design obligation', 'standing', NULL, 'ongoing', 'Contractor must carry out design in accordance with contract and brief', 'contractor', 'Contractor liable for design deficiencies', false),
('AS4902-2000', '8.2', 'Design documents — submission for review', 'submission', NULL, 'as programmed or directed', 'Design reaches stage requiring superintendent review', 'contractor', 'Work may not proceed if design not reviewed', false),
('AS4902-2000', '8.3', 'Superintendent review of design', 'assessment', 14, 'within 14 days of receiving design documents', 'Contractor submits design documents under 8.2', 'superintendent', 'Deemed no comment; contractor may proceed', false),

-- Clause 9: Design verification
('AS4902-2000', '9.1', 'Design verification', 'submission', NULL, 'prior to construction of relevant element', 'Design for element to be constructed is complete', 'contractor', 'Contractor bears risk of proceeding without verification', false),

-- Clause 12: Directions
('AS4902-2000', '12.1', 'Compliance with directions', 'response', 7, 'within 7 days of receiving direction', 'Superintendent issues direction', 'contractor', 'Must comply; may object within 7 days', false),
('AS4902-2000', '12.2', 'Objection to direction as variation', 'notice', 7, 'within 7 days of receiving direction', 'Contractor considers direction is a variation', 'contractor', 'Failure to object — deemed not a variation', true),

-- Clause 14: Program
('AS4902-2000', '14.1', 'Submission of program', 'submission', 14, 'within 14 days of acceptance', 'Contract is formed', 'contractor', 'Superintendent may withhold certification', false),

-- Clause 20: Latent conditions
('AS4902-2000', '20.1', 'Notice of latent condition', 'notice', 28, 'within 28 days of becoming aware', 'Contractor encounters latent condition', 'contractor', 'Loses entitlement to claim — time bar', true),
('AS4902-2000', '20.2', 'Assessment of latent condition', 'assessment', 28, 'within 28 days of notice', 'Contractor gives latent condition notice', 'superintendent', 'Principal may be liable for delay', false),

-- Clause 25: Disputes
('AS4902-2000', '25.1', 'Notice of dispute', 'notice', 28, 'within 28 days of event', 'Party considers dispute exists', 'contractor', 'May lose right to pursue dispute', true),

-- Clause 33: Delay
('AS4902-2000', '33.1', 'Written notice of delay', 'notice', 28, 'within 28 days of delay cause arising', 'Contractor is or will be delayed', 'contractor', 'Not entitled to EOT — time bar', true),
('AS4902-2000', '33.2', 'Delay claim details', 'claim', 28, 'within 28 days of 33.1 notice', 'Notice of delay given', 'contractor', 'Claim may be reduced or refused', true),

-- Clause 34: EOT
('AS4902-2000', '34.1', 'Superintendent EOT assessment', 'assessment', 28, 'within 28 days of receiving claim', 'EOT claim submitted', 'superintendent', 'Deemed refusal; contractor may dispute', false),

-- Clause 36: Variations
('AS4902-2000', '36.1', 'Variation direction', 'direction', NULL, 'as directed', 'Superintendent directs variation', 'superintendent', 'Contractor must comply unless objects', false),
('AS4902-2000', '36.2', 'Objection to variation', 'notice', 14, 'within 14 days of direction', 'Variation direction received', 'contractor', 'Deemed acceptance — time bar', true),
('AS4902-2000', '36.3', 'Variation quotation', 'submission', 14, 'within 14 days of direction', 'Superintendent directs quotation', 'contractor', 'Superintendent may value without quotation', false),

-- Clause 37: Payment
('AS4902-2000', '37.1', 'Payment claim', 'claim', NULL, 'on day stated in Annexure', 'Monthly claim date', 'contractor', 'No payment until valid claim', false),
('AS4902-2000', '37.1', 'Final payment claim', 'claim', 28, 'within 28 days of PC', 'Practical completion certified', 'contractor', 'May forfeit right to unmade claims', true),
('AS4902-2000', '37.2', 'Payment certificate', 'assessment', 14, 'within 14 days of claim', 'Payment claim submitted', 'superintendent', 'Superintendent in breach of duty', false),
('AS4902-2000', '37.3', 'Time for payment', 'response', 28, 'within 28 days of claim', 'Certificate issued', 'principal', 'Interest accrues', false),

-- Clause 39: Default
('AS4902-2000', '39.1', 'Show cause notice', 'notice', NULL, 'on substantial breach', 'Contractor in substantial breach', 'principal', 'Must follow process', false),
('AS4902-2000', '39.2', 'Contractor response to show cause', 'response', 14, 'within 14 days of show cause', 'Show cause notice issued', 'contractor', 'Principal may terminate or take out', true),

-- Clause 40/41: PC and DLP
('AS4902-2000', '40.2', 'Superintendent PC assessment', 'assessment', 14, 'within 14 days of notice', 'Contractor gives PC notice', 'superintendent', 'Delay in certifying; LD implications', false),
('AS4902-2000', '41.1', 'Defects liability period', 'standing', NULL, 'per Annexure', 'PC certified', 'contractor', 'Must rectify defects during DLP', false),


-- =============================================================================
-- AS 2124-1992 — General Conditions of Contract
-- =============================================================================

-- Clause 8: Superintendent
('AS2124-1992', '8.1', 'Superintendent — general duties', 'standing', NULL, 'ongoing', 'Superintendent must act fairly and impartially', 'superintendent', 'Principal liable for superintendent failures', false),

-- Clause 9: Contractor obligations
('AS2124-1992', '9.1', 'Execution of work', 'standing', NULL, 'ongoing', 'Contractor must execute work in accordance with contract', 'contractor', 'Liable for non-conforming work', false),

-- Clause 12: Discrepancies
('AS2124-1992', '12.1', 'Discrepancies in documents', 'notice', 7, 'within 7 days of discovery', 'Contractor discovers discrepancy', 'contractor', 'Superintendent may direct; contractor bears cost', false),

-- Clause 17: Insurance
('AS2124-1992', '17.1', 'Evidence of insurance', 'submission', 7, 'within 7 days of request', 'Superintendent requests evidence', 'contractor', 'Principal may effect insurance at contractor cost', true),

-- Clause 23: Subcontractors
('AS2124-1992', '23.1', 'Approval of subcontractors', 'submission', NULL, 'before engagement', 'Contractor proposes subcontractor', 'contractor', 'Must not subcontract without approval', false),

-- Clause 29: Latent conditions
('AS2124-1992', '29.1', 'Notice of latent condition', 'notice', 28, 'within 28 days of becoming aware', 'Contractor encounters latent condition', 'contractor', 'Loses entitlement to claim — time bar', true),
('AS2124-1992', '29.2', 'Assessment of latent condition', 'assessment', 28, 'within 28 days of notice', 'Latent condition notice received', 'superintendent', 'Must assess and notify contractor', false),

-- Clause 33: Superintendents directions
('AS2124-1992', '33.1', 'Compliance with superintendent directions', 'response', 7, 'within 7 days', 'Superintendent issues direction', 'contractor', 'Must comply', false),

-- Clause 35: Extensions of time
('AS2124-1992', '35.1', 'Notice of delay', 'notice', 28, 'within 28 days of delay cause arising', 'Contractor is or will be delayed', 'contractor', 'Not entitled to EOT for that cause — time bar', true),
('AS2124-1992', '35.2', 'EOT claim details', 'claim', 28, 'within 28 days of notice under 35.1', 'Notice of delay given', 'contractor', 'Superintendent may assess without particulars', true),
('AS2124-1992', '35.3', 'Superintendent EOT assessment', 'assessment', 28, 'within 28 days of claim', 'EOT claim submitted', 'superintendent', 'Deemed refusal; contractor may dispute', false),

-- Clause 36: Delay costs
('AS2124-1992', '36.1', 'Delay costs claim', 'claim', 28, 'within 28 days of delay cause arising', 'Contractor delayed by qualifying cause', 'contractor', 'May lose entitlement to delay costs if not claimed in time', true),

-- Clause 40: Variations
('AS2124-1992', '40.1', 'Variation direction', 'direction', NULL, 'as directed', 'Superintendent directs variation', 'superintendent', 'Contractor must comply', false),
('AS2124-1992', '40.2', 'Objection to variation', 'notice', 14, 'within 14 days of direction', 'Variation direction received', 'contractor', 'Deemed acceptance if no objection', true),
('AS2124-1992', '40.3', 'Variation valuation', 'assessment', 28, 'within 28 days', 'Variation work performed', 'superintendent', 'Contractor may dispute valuation', false),
('AS2124-1992', '40.5', 'Variation quotation', 'submission', 14, 'within 14 days of request', 'Superintendent requests quotation', 'contractor', 'Superintendent may value without quotation', false),

-- Clause 42: Payments
('AS2124-1992', '42.1', 'Payment claim', 'claim', NULL, 'on day stated in Annexure', 'Monthly claim date', 'contractor', 'No payment until valid claim', false),
('AS2124-1992', '42.1', 'Final payment claim', 'claim', 28, 'within 28 days of PC', 'Practical completion certified', 'contractor', 'May forfeit right to unmade claims', true),
('AS2124-1992', '42.2', 'Payment certificate', 'assessment', 14, 'within 14 days of claim', 'Payment claim submitted', 'superintendent', 'Superintendent in breach', false),
('AS2124-1992', '42.3', 'Time for payment', 'response', 28, 'within 28 days of claim', 'Certificate issued', 'principal', 'Interest accrues', false),
('AS2124-1992', '42.9', 'Interest on late payment', 'standing', NULL, 'ongoing from due date', 'Payment not made by due date', 'principal', 'Interest at prescribed rate', false),

-- Clause 44: Disputes
('AS2124-1992', '44.1', 'Notice of dispute', 'notice', 28, 'within 28 days of event', 'Party considers dispute exists', 'contractor', 'May lose right to dispute', true),
('AS2124-1992', '44.2', 'Conference on dispute', 'response', 14, 'within 14 days of notice', 'Notice of dispute served', 'contractor', 'May proceed to arbitration', false),
('AS2124-1992', '44.3', 'Arbitration referral', 'submission', 42, 'within 42 days of notice', 'Conference fails to resolve dispute', 'contractor', 'Dispute may be deemed abandoned', true),

-- Clause 44.6: Default and termination
('AS2124-1992', '44.6', 'Show cause notice', 'notice', NULL, 'on substantial breach', 'Contractor in substantial breach', 'principal', 'Must follow process before termination', false),
('AS2124-1992', '44.7', 'Response to show cause', 'response', 14, 'within 14 days of show cause', 'Show cause notice issued', 'contractor', 'Principal may terminate', true),

-- Clause 45: PC and DLP
('AS2124-1992', '45.1', 'Practical completion notice', 'notice', NULL, 'when PC considered achieved', 'Works practically complete', 'contractor', 'PC not certified until notice given', false),
('AS2124-1992', '45.2', 'Superintendent PC assessment', 'assessment', 14, 'within 14 days of notice', 'PC notice received', 'superintendent', 'Delay in certifying; LD implications', false),


-- =============================================================================
-- AS 4901-1998 — Subcontract for AS4000
-- (mirrors AS4000 with adjustments for subcontractor relationship)
-- =============================================================================

-- Clause 5: Security
('AS4901-1998', '5.1', 'Security — provision', 'submission', 14, 'within 14 days of contract formation', 'Subcontract formed', 'subcontractor', 'Contractor may withhold payment', true),

-- Clause 8: Discrepancies
('AS4901-1998', '8.1', 'Discrepancies in documents', 'notice', 5, 'within 5 days of discovery', 'Subcontractor discovers discrepancy', 'subcontractor', 'Contractor may direct at subcontractor cost', false),

-- Clause 12: Directions
('AS4901-1998', '12.1', 'Compliance with directions', 'response', 5, 'within 5 days of direction', 'Contractor issues direction to subcontractor', 'subcontractor', 'Must comply; may object within 5 days', false),
('AS4901-1998', '12.2', 'Objection to direction as variation', 'notice', 5, 'within 5 days of direction', 'Subcontractor considers direction is a variation', 'subcontractor', 'Failure to object — deemed not a variation', true),

-- Clause 14: Program
('AS4901-1998', '14.1', 'Submission of program', 'submission', 14, 'within 14 days of subcontract formation', 'Subcontract formed', 'subcontractor', 'Contractor may withhold certification', false),

-- Clause 20: Latent conditions
('AS4901-1998', '20.1', 'Notice of latent condition', 'notice', 14, 'within 14 days of becoming aware', 'Subcontractor encounters latent condition', 'subcontractor', 'Loses entitlement to claim — time bar', true),

-- Clause 25: Disputes
('AS4901-1998', '25.1', 'Notice of dispute', 'notice', 28, 'within 28 days of event', 'Party considers dispute exists', 'subcontractor', 'May lose right to dispute', true),

-- Clause 33: Delay
('AS4901-1998', '33.1', 'Notice of delay', 'notice', 14, 'within 14 days of delay cause arising', 'Subcontractor is or will be delayed', 'subcontractor', 'Not entitled to EOT — time bar', true),
('AS4901-1998', '33.2', 'Delay claim details', 'claim', 14, 'within 14 days of notice under 33.1', 'Notice of delay given', 'subcontractor', 'Claim may be reduced', true),

-- Clause 34: EOT
('AS4901-1998', '34.1', 'Contractor EOT assessment', 'assessment', 14, 'within 14 days of claim', 'EOT claim submitted by subcontractor', 'contractor', 'Deemed refusal; subcontractor may dispute', false),

-- Clause 36: Variations
('AS4901-1998', '36.1', 'Variation direction', 'direction', NULL, 'as directed', 'Contractor directs variation', 'contractor', 'Subcontractor must comply unless objects', false),
('AS4901-1998', '36.2', 'Objection to variation', 'notice', 10, 'within 10 days of direction', 'Variation direction received', 'subcontractor', 'Deemed acceptance — time bar', true),

-- Clause 37: Payment
('AS4901-1998', '37.1', 'Payment claim', 'claim', NULL, 'on day stated in Annexure', 'Monthly claim date', 'subcontractor', 'No payment until valid claim', false),
('AS4901-1998', '37.1', 'Final payment claim', 'claim', 28, 'within 28 days of subcontract PC', 'Subcontract PC certified', 'subcontractor', 'May forfeit unmade claims — time bar', true),
('AS4901-1998', '37.2', 'Payment assessment', 'assessment', 10, 'within 10 business days of claim', 'Payment claim submitted', 'contractor', 'Contractor in breach', false),
('AS4901-1998', '37.3', 'Time for payment', 'response', 28, 'within 28 days of claim', 'Payment assessed', 'contractor', 'Interest accrues', false),

-- Clause 39: Default
('AS4901-1998', '39.1', 'Show cause notice', 'notice', NULL, 'on substantial breach', 'Subcontractor in substantial breach', 'contractor', 'Must follow process', false),
('AS4901-1998', '39.2', 'Response to show cause', 'response', 14, 'within 14 days of show cause', 'Show cause notice issued', 'subcontractor', 'Contractor may terminate', true),

-- Clause 40: PC
('AS4901-1998', '40.1', 'Notice of practical completion', 'notice', NULL, 'when subcontractor considers PC', 'Subcontract works practically complete', 'subcontractor', 'PC not certified until notice', false),
('AS4901-1998', '41.1', 'Defects liability period', 'standing', NULL, 'per Annexure', 'Subcontract PC certified', 'subcontractor', 'Must rectify defects during DLP', false),


-- =============================================================================
-- AS 4903-2000 — Subcontract for Design and Construct (AS4902)
-- =============================================================================

-- Clause 5: Security
('AS4903-2000', '5.1', 'Security — provision', 'submission', 14, 'within 14 days of subcontract formation', 'Subcontract formed', 'subcontractor', 'Contractor may withhold payment', true),

-- Clause 8: Design obligations
('AS4903-2000', '8.1', 'Subcontractor design obligation', 'standing', NULL, 'ongoing', 'Subcontractor must carry out design per subcontract', 'subcontractor', 'Liable for design deficiencies', false),
('AS4903-2000', '8.2', 'Design documents — submission', 'submission', NULL, 'as programmed or directed', 'Design requires review', 'subcontractor', 'Work may not proceed without review', false),
('AS4903-2000', '8.3', 'Contractor review of design', 'assessment', 14, 'within 14 days of submission', 'Design documents submitted', 'contractor', 'Deemed no comment; subcontractor may proceed', false),

-- Clause 12: Directions
('AS4903-2000', '12.1', 'Compliance with directions', 'response', 5, 'within 5 days of direction', 'Contractor issues direction', 'subcontractor', 'Must comply; may object within 5 days', false),
('AS4903-2000', '12.2', 'Objection to direction as variation', 'notice', 5, 'within 5 days of direction', 'Subcontractor considers direction is a variation', 'subcontractor', 'Failure to object — deemed not a variation', true),

-- Clause 20: Latent conditions
('AS4903-2000', '20.1', 'Notice of latent condition', 'notice', 14, 'within 14 days of becoming aware', 'Subcontractor encounters latent condition', 'subcontractor', 'Loses entitlement — time bar', true),

-- Clause 33: Delay
('AS4903-2000', '33.1', 'Notice of delay', 'notice', 14, 'within 14 days of delay cause arising', 'Subcontractor is or will be delayed', 'subcontractor', 'Not entitled to EOT — time bar', true),
('AS4903-2000', '33.2', 'Delay claim details', 'claim', 14, 'within 14 days of notice under 33.1', 'Notice of delay given', 'subcontractor', 'Claim may be reduced', true),

-- Clause 36: Variations
('AS4903-2000', '36.1', 'Variation direction', 'direction', NULL, 'as directed', 'Contractor directs variation', 'contractor', 'Subcontractor must comply unless objects', false),
('AS4903-2000', '36.2', 'Objection to variation', 'notice', 10, 'within 10 days of direction', 'Variation direction received', 'subcontractor', 'Deemed acceptance — time bar', true),

-- Clause 37: Payment
('AS4903-2000', '37.1', 'Payment claim', 'claim', NULL, 'on day stated in Annexure', 'Monthly claim date', 'subcontractor', 'No payment until valid claim', false),
('AS4903-2000', '37.1', 'Final payment claim', 'claim', 28, 'within 28 days of subcontract PC', 'Subcontract PC certified', 'subcontractor', 'May forfeit unmade claims — time bar', true),
('AS4903-2000', '37.2', 'Payment assessment', 'assessment', 10, 'within 10 business days of claim', 'Payment claim submitted', 'contractor', 'Contractor in breach', false),

-- Clause 39: Default
('AS4903-2000', '39.1', 'Show cause notice', 'notice', NULL, 'on substantial breach', 'Subcontractor in substantial breach', 'contractor', 'Must follow process', false),
('AS4903-2000', '39.2', 'Response to show cause', 'response', 14, 'within 14 days of show cause', 'Show cause notice issued', 'subcontractor', 'Contractor may terminate', true);


-- =============================================================================
-- Verify counts
-- =============================================================================
DO $$
DECLARE
  total_count integer;
BEGIN
  SELECT count(*) INTO total_count FROM public.obligation_clause_priors;
  RAISE NOTICE 'Total obligation_clause_priors seeded: %', total_count;
END $$;
