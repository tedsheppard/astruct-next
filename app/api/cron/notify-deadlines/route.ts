import { type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Query all pending obligations due within 7 days
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const { data: obligations, error } = await admin
      .from('obligations')
      .select('id, contract_id, user_id, description, clause_reference, due_date, notice_type, status, consequence, party_responsible')
      .in('status', ['pending', 'urgent'])
      .eq('completed', false)
      .gte('due_date', now.toISOString())
      .lte('due_date', sevenDaysFromNow.toISOString())
      .order('due_date', { ascending: true })

    if (error) {
      console.error('[Cron] Failed to query obligations:', error)
      return Response.json({ error: 'Database query failed' }, { status: 500 })
    }

    if (!obligations || obligations.length === 0) {
      return Response.json({ notified: 0, emails_sent: 0, message: 'No upcoming deadlines' })
    }

    // Group obligations by user_id
    const byUser = new Map<string, typeof obligations>()
    for (const ob of obligations) {
      const existing = byUser.get(ob.user_id) || []
      existing.push(ob)
      byUser.set(ob.user_id, existing)
    }

    // Look up user emails
    const userIds = Array.from(byUser.keys())
    const userEmails = new Map<string, string>()

    for (const userId of userIds) {
      const { data } = await admin.auth.admin.getUserById(userId)
      if (data?.user?.email) {
        userEmails.set(userId, data.user.email)
      }
    }

    // Look up contract names for context
    const contractIds = Array.from(new Set(obligations.map(o => o.contract_id)))
    const { data: contracts } = await admin
      .from('contracts')
      .select('id, name')
      .in('id', contractIds)

    const contractNames = new Map<string, string>()
    for (const c of contracts || []) {
      contractNames.set(c.id, c.name)
    }

    // Send emails
    const resendApiKey = process.env.RESEND_API_KEY
    const resend = resendApiKey ? new Resend(resendApiKey) : null
    let emailsSent = 0
    let notified = 0

    for (const [userId, userObligations] of Array.from(byUser.entries())) {
      const userEmail = userEmails.get(userId)
      if (!userEmail) {
        console.warn(`[Cron] No email found for user ${userId}, skipping`)
        continue
      }

      notified += userObligations.length

      // Build email HTML
      const deadlineRows = userObligations.map(ob => {
        const dueDate = new Date(ob.due_date)
        const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        const contractName = contractNames.get(ob.contract_id) || 'Unknown Contract'
        const urgencyColor = daysRemaining <= 2 ? '#dc2626' : daysRemaining <= 4 ? '#f59e0b' : '#16a34a'
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.astruct.io'
        const link = `${appUrl}/dashboard/contracts/${ob.contract_id}/obligations`

        return `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 8px;">
              <strong>${ob.description}</strong>
              ${ob.clause_reference ? `<br><span style="color: #6b7280; font-size: 13px;">${ob.clause_reference}</span>` : ''}
              ${ob.consequence ? `<br><span style="color: #dc2626; font-size: 12px;">${ob.consequence}</span>` : ''}
            </td>
            <td style="padding: 12px 8px; font-size: 13px; color: #6b7280;">${contractName}</td>
            <td style="padding: 12px 8px; white-space: nowrap;">
              <span style="color: ${urgencyColor}; font-weight: 600;">${dueDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <br><span style="font-size: 12px; color: ${urgencyColor};">${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining</span>
            </td>
            <td style="padding: 12px 8px;">
              <a href="${link}" style="color: #2563eb; text-decoration: none; font-size: 13px;">View &rarr;</a>
            </td>
          </tr>`
      }).join('')

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 680px; margin: 0 auto;">
          <div style="background: #1e293b; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 20px;">Upcoming Contract Deadlines</h1>
            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">You have ${userObligations.length} deadline${userObligations.length !== 1 ? 's' : ''} due in the next 7 days</p>
          </div>
          <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Obligation</th>
                  <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Contract</th>
                  <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Due Date</th>
                  <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;"></th>
                </tr>
              </thead>
              <tbody>
                ${deadlineRows}
              </tbody>
            </table>
          </div>
          <p style="margin: 16px 0; font-size: 12px; color: #9ca3af; text-align: center;">
            Sent by Astruct &middot; <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.astruct.io'}/dashboard" style="color: #6b7280;">Open Dashboard</a>
          </p>
        </div>`

      if (resend) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Astruct <notifications@astruct.io>',
            to: userEmail,
            subject: `${userObligations.length} upcoming contract deadline${userObligations.length !== 1 ? 's' : ''}`,
            html: emailHtml,
          })
          emailsSent++
        } catch (emailErr) {
          console.error(`[Cron] Failed to send email to ${userEmail}:`, emailErr)
        }
      } else {
        console.log(`[Cron] Resend not configured. Would notify ${userEmail} about ${userObligations.length} deadlines:`)
        for (const ob of userObligations) {
          const dueDate = new Date(ob.due_date)
          const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
          console.log(`  - ${ob.description} (${ob.clause_reference || 'no clause'}) — due ${dueDate.toISOString().split('T')[0]} (${daysRemaining}d)`)
        }
      }
    }

    console.log(`[Cron] Deadline notifications: ${notified} deadlines, ${emailsSent} emails sent`)

    return Response.json({
      notified,
      emails_sent: emailsSent,
    })
  } catch (err) {
    console.error('[Cron] notify-deadlines error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
