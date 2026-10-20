---
title: Connecting Gmail
summary: Google Workspace or Gmail mail, on request until Google verifies Astruct's sign-in.
category: connecting
order: 13
keywords: gmail connect guide mail and calendar
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

On request. Until Google verifies Astruct's app, Google lets Astruct connect only the Google accounts Astruct adds first. Request it with your Google address and Astruct adds it, usually within 24 hours. Then you connect it yourself.

- **Who does it:** You. If your company uses Google Workspace and limits third-party apps, your Workspace administrator allows Astruct.
- **How long:** Up to 24 hours for Astruct to add your address. About two minutes to connect.

## What Astruct reads

- The mail in the Gmail account you connect, with its attachments. Each email is filed to its project.
- Astruct puts a draft reply in your Drafts when you ask for one. Nothing is sent from your mailbox without your approval.

## Request it

1. Open Apps. On the Gmail row, select Request connection.
2. Enter the Google account address you will sign in with, say whether it is a Google Workspace account, and send it.
3. The row says Requested and under review. When Astruct has added your address, it says Ready, and Apps shows Gmail is ready.

## Connect Gmail

1. On the Gmail row, select Connect and sign in with the Google account you gave.
2. Google may say it has not verified the app. Select Continue. [Unverified apps (Google)](https://support.google.com/cloud/answer/7454865)
3. Allow the access Google lists and you come back to Astruct. The row says Connected.

## File its mail to a project

1. Choose the project in the Project list at the top of Apps.
2. On the mail row, select Mail for this project.
3. Enter the sender domains (for example superintendent.com.au) and the keywords (the project number, site name or contract number) that mark this project's mail. Select Save rules.
4. To file mail you already have, select File past mail by these rules. Astruct searches the last 12 months of the mailbox.

## When it is working

- The Gmail row says Connected with your address and when it was last checked.
- Settings > Connections lists the mailbox. New mail is checked about every five minutes.

## If something goes wrong

- **“Google connections are switched on per account”** Request Gmail from its row, as above.
- **Access blocked (on the provider's screen)** Google's screen when the address is not one Astruct has added yet, when you signed in with another Google account, or when your Google Workspace administrator limits third-party apps. Check the row says Ready and connect with the address you gave; if it still stops, ask your Workspace administrator to allow Astruct.
- **“Needs more from you”** Astruct has asked a question about your request. The line under it, and an email to you, say what is needed. Select Add details on the row to answer.
- **“did not connect: permission was not given. Try again.”** You chose Cancel or Deny on the provider's screen, or your organisation lets only an administrator approve new apps. Select Connect again and approve. If it stops at an approval screen, see the admin step in this guide.
- **“did not connect. Try again.”** The sign-in was open for more than 15 minutes, was started in another tab or browser, or the provider did not hand over access. Start again from the row, in one tab, and finish the sign-in within 15 minutes. If it fails twice, sign out of the provider in that browser, then connect again.
- **“Needs reconnecting”** The provider asked for permission again, for example after a password change or a new security policy. Select Reconnect on the row and sign in. What arrived in the meantime is read once it reconnects.

## Help from the provider

- [Unverified apps (Google)](https://support.google.com/cloud/answer/7454865)
- [Control which apps access Google Workspace data (Google)](https://support.google.com/a/answer/7281227)
- [Manage connections between your Google Account and third parties (Google)](https://support.google.com/accounts/answer/13533235)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
