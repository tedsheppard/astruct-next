---
title: Connecting Autodesk Construction Cloud
summary: Documents, issues, RFIs and submittals from Autodesk Construction Cloud (now part of Autodesk Forma) and BIM 360.
category: connecting
order: 20
keywords: autodesk construction cloud connect guide project platforms
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

Connect it yourself with your Autodesk account. Some accounts first need their Autodesk account admin to add Astruct as a custom integration, once; Astruct tells you on the row if yours does.

- **Who does it:** You. If Autodesk asks for it, your Autodesk account admin (Hub Admin in Autodesk Forma, Account Admin in older screens) adds Astruct once.
- **How long:** About two minutes. The admin's step takes a few minutes, once.

## What Astruct reads

- Documents and their versions, issues, RFIs and submittals from the Autodesk Construction Cloud or BIM 360 projects you link, as far as your own Autodesk access reaches. Read only.

## Connect Autodesk

1. Open Apps. On the Autodesk Construction Cloud row, select Connect.
2. Sign in with your Autodesk account and select Allow.
3. You come back to Apps and the row says Connected. If it says Needs reconnecting with a message about a custom integration, your account admin does the step below first.

## If your account admin adds Astruct first

Autodesk lets an app into an account only after its account admin adds the app's client ID. Astruct asks for this only when Autodesk says so, and the message on the row includes Astruct's client ID.

1. The account admin opens Hub Admin (Account Admin in older screens) and the Custom Integrations tool, and selects Add custom integration. [Add custom integrations (Autodesk)](https://help.autodesk.com/view/BUILD/ENU/?guid=Custom_Integrations)
2. Enter Astruct's client ID from the message, the name Astruct and a short description, then select Next.
3. Autodesk looks for service accounts for that client ID. Astruct has none, so select Proceed anyway.
4. Back in Astruct, select Reconnect on the row.

## Link projects to an Astruct project

1. Choose the project in the Project list at the top of Apps.
2. On the row, select Choose Autodesk projects, then Link an Autodesk project. Find it in the list (select a name to open it) and select Link.
3. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## When it is working

- The row says Connected and how many Autodesk projects are linked to the project and how many items are filed there.

## If something goes wrong

- **“account admin needs to add Astruct as a custom integration first”** Your account admin follows If your account admin adds Astruct first, above, then you select Reconnect.
- **“No Autodesk Construction Cloud or BIM 360 account is open to this sign-in.”** Sign in with the Autodesk account that is a member of your company's account and its projects.
- **“Sync failing”** Select See the error on the row. The folder or project was usually moved, deleted or taken off your access. Link it again, or select Stop syncing on it.
- **“did not connect: permission was not given. Try again.”** You chose Cancel or Deny on the provider's screen, or your organisation lets only an administrator approve new apps. Select Connect again and approve. If it stops at an approval screen, see the admin step in this guide.
- **“did not connect. Try again.”** The sign-in was open for more than 15 minutes, was started in another tab or browser, or the provider did not hand over access. Start again from the row, in one tab, and finish the sign-in within 15 minutes. If it fails twice, sign out of the provider in that browser, then connect again.
- **“Needs reconnecting”** The provider asked for permission again, for example after a password change or a new security policy. Select Reconnect on the row and sign in. What arrived in the meantime is read once it reconnects.

## Help from the provider

- [Add custom integrations (Autodesk)](https://help.autodesk.com/view/BUILD/ENU/?guid=Custom_Integrations)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
