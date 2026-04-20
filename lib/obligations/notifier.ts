import { createAdminClient } from '@/lib/supabase/admin'

interface DeadlineDigest {
  userId: string
  email: string
  name: string
  obligations: Array<{
    id: string
    description: string
    clause_reference: string | null
    due_date: string
    consequence: string | null
    contract_name: string
    contract_id: string
    days_remaining: number
  }>
}

/**
 * Gather upcoming deadline digests for all users with obligations due within `daysAhead` days.
 */
export async function gatherDeadlineDigests(daysAhead = 7): Promise<DeadlineDigest[]> {
  const admin = createAdminClient()

  const now = new Date()
  const cutoff = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)

  const { data: obligations } = await admin
    .from('obligations')
    .select('*, contracts(name)')
    .in('obligation_class', ['pending'])
    .eq('completed', false)
    .gte('due_date', now.toISOString())
    .lte('due_date', cutoff.toISOString())
    .order('due_date', { ascending: true })

  if (!obligations || obligations.length === 0) return []

  // Group by user
  const byUser = new Map<string, typeof obligations>()
  for (const ob of obligations) {
    const list = byUser.get(ob.user_id) || []
    list.push(ob)
    byUser.set(ob.user_id, list)
  }

  // Fetch user profiles
  const userIds = Array.from(byUser.keys())
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, email, name')
    .in('id', userIds)

  const profileMap = new Map((profiles || []).map(p => [p.id, p]))

  const digests: DeadlineDigest[] = []
  for (const [userId, obs] of byUser) {
    const profile = profileMap.get(userId)
    if (!profile?.email) continue

    digests.push({
      userId,
      email: profile.email,
      name: profile.name || 'there',
      obligations: obs.map(ob => {
        const dueDate = new Date(ob.due_date)
        const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        return {
          id: ob.id,
          description: ob.description,
          clause_reference: ob.clause_reference,
          due_date: ob.due_date,
          consequence: ob.consequence,
          contract_name: ob.contracts?.name || 'Unknown contract',
          contract_id: ob.contract_id,
          days_remaining: daysRemaining,
        }
      }),
    })
  }

  return digests
}

/**
 * Build HTML email content for a deadline digest.
 */
export function buildDigestEmail(digest: DeadlineDigest): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.astruct.io'

  const rows = digest.obligations.map(ob => {
    const dueDate = new Date(ob.due_date).toLocaleDateString('en-AU', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    })
    const urgency = ob.days_remaining <= 3 ? '#ef4444' : ob.days_remaining <= 7 ? '#f59e0b' : '#22c55e'
    const daysLabel = ob.days_remaining === 0 ? 'Today'
      : ob.days_remaining === 1 ? 'Tomorrow'
      : `${ob.days_remaining} days`

    return `
      <tr style="border-bottom: 1px solid #e5e5e3;">
        <td style="padding: 12px 16px;">
          <strong style="color: #0f0e0d;">${ob.description}</strong>
          ${ob.clause_reference ? `<br><span style="color: #8f8b85; font-size: 13px;">${ob.clause_reference}</span>` : ''}
          ${ob.consequence ? `<br><span style="color: #ef4444; font-size: 13px;">${ob.consequence}</span>` : ''}
        </td>
        <td style="padding: 12px 16px; white-space: nowrap;">
          <span style="color: ${urgency}; font-weight: 600;">${daysLabel}</span>
          <br><span style="color: #8f8b85; font-size: 13px;">${dueDate}</span>
        </td>
        <td style="padding: 12px 16px;">
          <a href="${baseUrl}/contracts/${ob.contract_id}/calendar" style="color: #0f0e0d; text-decoration: underline;">View</a>
        </td>
      </tr>`
  }).join('')

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 16px;">
      <h2 style="color: #0f0e0d; font-size: 20px; margin-bottom: 8px;">Upcoming contract deadlines</h2>
      <p style="color: #706d66; font-size: 14px; margin-bottom: 24px;">
        Hi ${digest.name}, you have ${digest.obligations.length} deadline${digest.obligations.length !== 1 ? 's' : ''} due in the next 7 days.
      </p>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e5e3; border-radius: 8px;">
        <thead>
          <tr style="background: #fafaf9; border-bottom: 1px solid #e5e5e3;">
            <th style="padding: 10px 16px; text-align: left; font-size: 12px; color: #8f8b85; text-transform: uppercase; letter-spacing: 0.05em;">Deadline</th>
            <th style="padding: 10px 16px; text-align: left; font-size: 12px; color: #8f8b85; text-transform: uppercase; letter-spacing: 0.05em;">Due</th>
            <th style="padding: 10px 16px; text-align: left; font-size: 12px; color: #8f8b85; text-transform: uppercase; letter-spacing: 0.05em;"></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="color: #adaba5; font-size: 12px; margin-top: 24px;">
        Sent by <a href="${baseUrl}" style="color: #0f0e0d;">Astruct</a>
      </p>
    </div>`
}
