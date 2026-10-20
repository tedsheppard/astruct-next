---
title: Connecting OneDrive
summary: The OneDrive folders you link, read and filed to the project.
category: connecting
order: 11
keywords: onedrive connect guide documents
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

Connect it yourself with your Microsoft 365 work account.

- **Who does it:** You.
- **How long:** About two minutes, then the first read of each folder.

## What Astruct reads

- The files in the OneDrive folders you link, and their new and changed versions. Read only: Astruct never changes, moves or deletes your files.

## Connect OneDrive

1. Open Apps in the sidebar. On the OneDrive row, select Connect.
2. Sign in with your Microsoft 365 work account and select Accept.
3. You come back to Apps and the row says Connected.

## Link folders to a project

1. Choose the project in the Project list at the top of Apps.
2. On the row, select Choose folders, then Link a folder. Find it in the list (select a name to open it) and select Link.
3. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## When it is working

- The OneDrive row says Connected, how many folders are linked to the project and how many files are filed there.
- Each linked folder shows when it was last synced.

## If something goes wrong

- **“Your Microsoft 365 organisation needs an administrator to approve Astruct before it can connect.”** Your Microsoft 365 administrator approves Astruct once. See If your organisation asks for IT approval in the Outlook guide.
- **“Sync failing”** Select See the error on the row. The folder or project was usually moved, deleted or taken off your access. Link it again, or select Stop syncing on it.
- **“did not connect: permission was not given. Try again.”** You chose Cancel or Deny on the provider's screen, or your organisation lets only an administrator approve new apps. Select Connect again and approve. If it stops at an approval screen, see the admin step in this guide.
- **“did not connect. Try again.”** The sign-in was open for more than 15 minutes, was started in another tab or browser, or the provider did not hand over access. Start again from the row, in one tab, and finish the sign-in within 15 minutes. If it fails twice, sign out of the provider in that browser, then connect again.
- **“Needs reconnecting”** The provider asked for permission again, for example after a password change or a new security policy. Select Reconnect on the row and sign in. What arrived in the meantime is read once it reconnects.

## Help from the provider

- [Grant tenant-wide admin consent (Microsoft)](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
