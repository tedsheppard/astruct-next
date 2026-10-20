---
title: Connecting Outlook and Microsoft 365
summary: Your Microsoft 365 mailbox, shared mailboxes and the one-time approval some organisations ask their IT admin for.
category: connecting
order: 1
keywords: outlook and microsoft 365 connect guide mail calendar
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

Connect it yourself with your Microsoft 365 work account. Some organisations let only their Microsoft 365 administrator approve new apps; then the administrator approves Astruct once, for everyone.

- **Who does it:** You. For a shared mailbox, your Microsoft 365 administrator gives you Full Access to it if you do not have it already. For an organisation that blocks new apps, your Microsoft 365 administrator approves Astruct once.
- **How long:** About two minutes. The administrator's approval takes a few minutes, once.

## What Astruct reads

- The mail in the mailboxes you connect, including the attachments. Each email is filed to its project and notices, claims and directions in it open issues.
- Your calendar events, set beside the contract's dates.
- Astruct puts a draft reply in your Drafts folder when you ask for one. Nothing is sent from your mailbox without your approval, and Astruct never deletes or moves your mail.

## Connect your mailbox

1. Open Apps in the sidebar. On the Outlook and Microsoft 365 row, select Connect. (Or open Settings > Connections and select Connect Outlook.)
2. Sign in with your Microsoft 365 work account.
3. Microsoft lists what Astruct asks for: reading mail, including shared mailboxes you can already open, drafts, calendars and your basic profile. Select Accept.
4. You come back to Astruct. The row says Connected and the first read of recent mail starts. After that, new mail is picked up within about five minutes.

## File its mail to a project

1. Choose the project in the Project list at the top of Apps.
2. On the mail row, select Mail for this project.
3. Enter the sender domains (for example superintendent.com.au) and the keywords (the project number, site name or contract number) that mark this project's mail. Select Save rules.
4. To file mail you already have, select File past mail by these rules. Astruct searches the last 12 months of the mailbox.

## Add a shared mailbox, such as a project inbox

Astruct reads a shared mailbox through your own Outlook connection, so there is nothing new to sign in to. Your account needs Full Access to it in Microsoft 365.

1. Connect your own Outlook first (above).
2. Open Settings > Connections. Under Add another mailbox, select Shared mailbox.
3. Enter the shared mailbox's address, for example projects@yourcompany.com.au, and select Add. Astruct checks with Microsoft that your account can open it, then starts reading it.
4. If you cannot open it yet, your Microsoft 365 administrator gives you Full Access to it in the Exchange admin centre. [Manage permissions for recipients, Full Access (Microsoft)](https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-permissions-for-recipients)

## Add another mailbox

1. Open Settings > Connections. Under Add another mailbox, select Connect Outlook and sign in with the other account. Up to ten mailboxes, Outlook and Gmail in any mix.
2. Each mailbox is read on its own. An email that arrives in two of them is filed once.

## If your organisation asks for IT approval

Some Microsoft 365 organisations stop people approving apps themselves. Microsoft then shows Need admin approval, and an administrator approves Astruct once for everyone.

1. An owner or admin in Astruct opens Settings > Connections and, under Ask your IT admin to approve Astruct, selects Copy link for your IT admin. Send it to your Microsoft 365 administrator. Or select My company needs IT approval on the Outlook row and tell Astruct who to send it to.
2. The Microsoft 365 administrator opens the link, signs in with an administrator account, reviews the permissions and selects Accept. [Grant tenant-wide admin consent (Microsoft)](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)
3. Connect Outlook again. Each person still connects their own mailbox and sees only what they could already open in Microsoft 365.

## When it is working

- Apps: the Outlook row says Connected with your address and when it was last checked, and how many emails are filed to the project.
- Settings > Connections lists each mailbox with its address, Connected, and when it was checked.
- Mail in the sidebar shows what has been read, filed or not.

## If something goes wrong

- **“Your Microsoft 365 organisation needs an administrator to approve Astruct before it can connect.”** Follow If your organisation asks for IT approval, above, then select Reconnect.
- **“The Microsoft app registration is not known to your organisation.”** Your Microsoft 365 administrator allows it in the Entra admin centre under Enterprise applications > Consent and permissions, then you connect again.
- **Need admin approval (on the provider's screen)** Microsoft's screen when your organisation blocks new apps. Follow If your organisation asks for IT approval, above.
- **“Connect your own Outlook first. A shared mailbox is read through it.”** Connect your own Outlook mailbox, then add the shared mailbox.
- **“Your Microsoft account cannot open”** Ask your Microsoft 365 administrator for Full Access to that mailbox. If you can already open it in Outlook, select Reconnect on your own Outlook so Astruct holds the permission to read shared mailboxes.
- **“Outlook needs reconnecting before a shared mailbox can be added.”** Select Reconnect on your Outlook mailbox, then add the shared mailbox again.
- **“is not a mailbox in your Microsoft 365 organisation that your account can open.”** Check the address. A shared mailbox in another organisation cannot be added this way.
- **“mailboxes connected, the most Astruct reads for one person.”** Ten mailboxes is the most for one person. Disconnect one in Settings > Connections to add another.
- **“Ten mailboxes are connected, the most there can be.”** The same limit, on the new project page. Disconnect one in Settings > Connections first.
- **“did not connect: permission was not given. Try again.”** You chose Cancel or Deny on the provider's screen, or your organisation lets only an administrator approve new apps. Select Connect again and approve. If it stops at an approval screen, see the admin step in this guide.
- **“did not connect. Try again.”** The sign-in was open for more than 15 minutes, was started in another tab or browser, or the provider did not hand over access. Start again from the row, in one tab, and finish the sign-in within 15 minutes. If it fails twice, sign out of the provider in that browser, then connect again.
- **“Needs reconnecting”** The provider asked for permission again, for example after a password change or a new security policy. Select Reconnect on the row and sign in. What arrived in the meantime is read once it reconnects.

## Help from the provider

- [Grant tenant-wide admin consent (Microsoft)](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)
- [Configure how users consent to apps (Microsoft)](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent)
- [Manage permissions for recipients, Full Access (Microsoft)](https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-permissions-for-recipients)
- [Create a shared mailbox (Microsoft)](https://learn.microsoft.com/en-us/microsoft-365/admin/email/create-a-shared-mailbox)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
