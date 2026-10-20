---
title: Connecting Google Drive
summary: Google Drive folders and shared drives, on request with Gmail.
category: connecting
order: 15
keywords: gdrive google drive connect guide documents
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

On request, the same way as Gmail: Astruct adds your Google address first, then you connect it yourself.

- **Who does it:** You. A Google Workspace administrator who limits third-party apps allows Astruct.
- **How long:** Up to 24 hours for Astruct to add your address. About two minutes to connect.

## What Astruct reads

- The files in the Drive folders and shared drives you link, and their new and changed versions. Read only.

## Request it

1. Open Apps. On the Google Drive row, select Request connection, enter your Google address and send it.
2. When the row says Ready, select Connect and sign in with that Google account. If Google says it has not verified the app, select Continue. [Unverified apps (Google)](https://support.google.com/cloud/answer/7454865)

## Link folders to a project

1. Choose the project in the Project list at the top of Apps.
2. On the row, select Choose folders, then Link a folder. Find it in the list (select a name to open it) and select Link.
3. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## When it is working

- The Google Drive row says Connected, how many folders are linked to the project and how many files are filed there.

## If something goes wrong

- **“Google connections are switched on per account”** Request it from its row, as above.
- **Access blocked (on the provider's screen)** The Google address is not one Astruct has added yet, or your Workspace administrator limits third-party apps.
- **“Sync failing”** Select See the error on the row. The folder or project was usually moved, deleted or taken off your access. Link it again, or select Stop syncing on it.
- **“did not connect: permission was not given. Try again.”** You chose Cancel or Deny on the provider's screen, or your organisation lets only an administrator approve new apps. Select Connect again and approve. If it stops at an approval screen, see the admin step in this guide.
- **“did not connect. Try again.”** The sign-in was open for more than 15 minutes, was started in another tab or browser, or the provider did not hand over access. Start again from the row, in one tab, and finish the sign-in within 15 minutes. If it fails twice, sign out of the provider in that browser, then connect again.
- **“Needs reconnecting”** The provider asked for permission again, for example after a password change or a new security policy. Select Reconnect on the row and sign in. What arrived in the meantime is read once it reconnects.

## Help from the provider

- [Unverified apps (Google)](https://support.google.com/cloud/answer/7454865)
- [Control which apps access Google Workspace data (Google)](https://support.google.com/a/answer/7281227)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
