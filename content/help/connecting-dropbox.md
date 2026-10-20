---
title: Connecting Dropbox
summary: The Dropbox folders you link, team spaces included.
category: connecting
order: 16
keywords: dropbox connect guide documents
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

Connect it yourself with your Dropbox account.

- **Who does it:** You.
- **How long:** About two minutes, then the first read of each folder.

## What Astruct reads

- The files in the Dropbox folders you link, team spaces included, with their new and changed versions. Read only.

## Connect Dropbox

1. Open Apps. On the Dropbox row, select Connect.
2. Sign in to Dropbox and select Allow.
3. You come back to Apps and the row says Connected.

## Link folders to a project

1. Choose the project in the Project list at the top of Apps.
2. On the row, select Choose folders, then Link a folder. Find it in the list (select a name to open it) and select Link.
3. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## When it is working

- The Dropbox row says Connected, how many folders are linked to the project and how many files are filed there.

## If something goes wrong

- **“Sync failing”** Select See the error on the row. The folder or project was usually moved, deleted or taken off your access. Link it again, or select Stop syncing on it.
- **“did not connect: permission was not given. Try again.”** You chose Cancel or Deny on the provider's screen, or your organisation lets only an administrator approve new apps. Select Connect again and approve. If it stops at an approval screen, see the admin step in this guide.
- **“did not connect. Try again.”** The sign-in was open for more than 15 minutes, was started in another tab or browser, or the provider did not hand over access. Start again from the row, in one tab, and finish the sign-in within 15 minutes. If it fails twice, sign out of the provider in that browser, then connect again.
- **“Needs reconnecting”** The provider asked for permission again, for example after a password change or a new security policy. Select Reconnect on the row and sign in. What arrived in the meantime is read once it reconnects.

## Help from the provider

- [Third-party apps on Dropbox (Dropbox)](https://help.dropbox.com/integrations/third-party-apps)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
