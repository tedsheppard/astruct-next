---
title: Connecting SharePoint
summary: Document libraries on the SharePoint sites you can open, after your Microsoft 365 admin approves Astruct once.
category: connecting
order: 12
keywords: sharepoint connect guide documents
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

Connect it yourself once your Microsoft 365 administrator has approved Astruct for the organisation. The approval is one link, opened once.

- **Who does it:** Your Microsoft 365 administrator approves Astruct once. Then you connect.
- **How long:** A few minutes for the approval, once. About two minutes to connect.

## What Astruct reads

- The files in the document libraries and folders you link, from the SharePoint sites you can already open, with their new and changed versions. Read only.

## Your Microsoft 365 administrator approves Astruct

1. An owner or admin in Astruct opens Settings > Connections and, under Ask your IT admin to approve Astruct, selects Copy link for your IT admin. Owners and admins also find Copy link for your IT admin on the SharePoint sheet in Apps.
2. The Microsoft 365 administrator opens the link, signs in with an administrator account and selects Accept. [Grant tenant-wide admin consent (Microsoft)](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)

## Connect SharePoint

1. Open Apps. On the SharePoint row, select Connect, sign in with your Microsoft 365 work account and select Accept.
2. You come back to Apps and the row says Connected.

## Link libraries to a project

1. Choose the project in the Project list at the top of Apps.
2. On the row, select Choose libraries and folders, then Link a library or folder. Find it in the list (select a name to open it) and select Link.
3. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## When it is working

- The SharePoint row says Connected, how many libraries and folders are linked to the project and how many files are filed there.

## If something goes wrong

- **“Your Microsoft 365 organisation needs an administrator to approve Astruct before it can connect.”** The approval above has not been given yet. Once it is, select Reconnect.
- **Need admin approval (on the provider's screen)** Microsoft's screen before the approval above. Send your administrator the link.
- **“Sync failing”** Select See the error on the row. The folder or project was usually moved, deleted or taken off your access. Link it again, or select Stop syncing on it.
- **“did not connect: permission was not given. Try again.”** You chose Cancel or Deny on the provider's screen, or your organisation lets only an administrator approve new apps. Select Connect again and approve. If it stops at an approval screen, see the admin step in this guide.
- **“did not connect. Try again.”** The sign-in was open for more than 15 minutes, was started in another tab or browser, or the provider did not hand over access. Start again from the row, in one tab, and finish the sign-in within 15 minutes. If it fails twice, sign out of the provider in that browser, then connect again.
- **“Needs reconnecting”** The provider asked for permission again, for example after a password change or a new security policy. Select Reconnect on the row and sign in. What arrived in the meantime is read once it reconnects.

## Help from the provider

- [Grant tenant-wide admin consent (Microsoft)](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)
- [Configure how users consent to apps (Microsoft)](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
