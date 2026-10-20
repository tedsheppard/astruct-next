---
title: Connecting Procore
summary: RFIs, submittals, drawings and documents from Procore, with keys from your Procore company admin.
category: connecting
order: 18
keywords: procore connect guide project platforms
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

Connect with your own Procore keys: your Procore company admin makes a custom app for Astruct in Procore, once, and you enter its keys on Apps. One-click Connect (signing in with Procore) arrives once Procore approves Astruct's Marketplace listing. Connections made with keys keep working then.

- **Who does it:** Your Procore company admin, once. Then you, or anyone in your team, enters the keys.
- **How long:** About 15 minutes of the admin's time. The first time, Procore verifies your organisation before the app can go to production, and Procore sets how long that takes.

## What Astruct reads

- Only the Procore tools the admin sets to Read-only on the app's service account (documents, drawings, specifications, RFIs, submittals, the directory, and any others chosen), and only on the projects the admin permits.
- Read only: Astruct never creates, changes or deletes anything in Procore.

## For your Procore company admin

Your Procore company admin makes a custom app for Astruct in Procore and installs it in your company, once. Astruct then reads Procore through that app's read-only service account.

1. Sign in to the Procore Developer Portal with your company email. Select Create a New App and name it Astruct. [Create an App](https://developers.procore.com/documentation/building-apps-create-new)
2. Select Create Version, then Edit Components. Under Data Connector, select User Level Authentication and Service Account Authentication, then Save. [Build a Data Connector App](https://developers.procore.com/documentation/building-data-connection-apps)
3. On Service Account Authentication, select Manage. On the Project Level tab, set Read-only on Documents, Drawings, Specifications, RFIs, Submittals and Directory, and on any of Daily Log, Photos, Inspections, Observations, Change Events, Change Orders, Commitments, Correspondence and Meetings you want in Astruct. Leave the rest at None. Select Save Configuration.
4. Select Save Version, then Promote to Production on the Sandbox Version card. The first time, Procore asks you to verify your organisation: apply as a Private Developer and describe the app as internal, and Procore verifies you as a Customer. [Verification & Production Access](https://developers.procore.com/documentation/verification-and-production-access)
5. On the Credentials tab, under Production OAuth Credentials, select Generate Client Secret. Copy the Client ID and the Client Secret. Procore shows the secret once. [OAuth Credentials Management](https://developers.procore.com/documentation/oauth-keys)
6. Copy the production version's 36-character App Version ID. In Procore, open Company Admin > App Management > Install App > Install Custom App, paste it and select Install. [Install a Custom App](https://support.procore.com/products/online/user-guide/company-level/admin/tutorials/install-a-custom-app)
7. Still in App Management, view the app, open Permissions and add the projects Astruct may read. [Add a Permitted Project](https://support.procore.com/products/online/user-guide/company-level/admin/tutorials/add-permitted-project)
8. Send the Client ID, the Client Secret and the Company ID to whoever connects Astruct, by a private channel. The Company ID is the number after app.procore.com/ in your Procore address, for example app.procore.com/1234567/company/home.

## Then connect

1. Open Apps. On the Procore row, select Connect with your Procore keys. The sheet shows the admin's steps above; Copy steps puts them on the clipboard to send.
2. Enter the Client ID, the Client Secret and the Company ID, and select Connect.
3. Astruct checks the keys with Procore before saving them: it gets a token, finds the company and lists the permitted projects. The Client Secret is stored encrypted and never shown again.
4. Choose the project in the Project list at the top of Apps.
5. On the row, select Choose Procore projects, then Link a Procore project. Find it in the list (select a name to open it) and select Link.
6. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## When it is working

- A message names the Procore company and how many projects are permitted.
- The Procore row says Connected as the app's service account, and how many Procore projects are linked to the project.

## If something goes wrong

- **“Procore does not recognise that Client ID and Client Secret.”** Copy both again from Production OAuth Credentials on the app's Credentials tab in the Developer Portal. If the secret was not saved, select Generate Client Secret for a new one.
- **“Procore will not issue a service account token for that app.”** Add Service Account Authentication to the app version (step 2), promote it to production, then try again.
- **“but the app is not installed in Procore company”** Install it with Install Custom App and the App Version ID (step 6), and check the Company ID is the number after app.procore.com/.
- **“but its service account cannot read projects.”** Set the project tools to Read-only on Service Account Authentication (step 3), promote that version and accept the update in App Management.
- **“but no projects are permitted yet.”** In App Management, view the app, open Permissions and add the projects (step 7).
- **“The Company ID is the number after app.procore.com/ in your Procore address”** Enter only the number, for example 1234567 from app.procore.com/1234567/company/home.
- **“has spaces or is too long. Copy it again from the app's Credentials tab.”** Copy the value again without spaces or line breaks.
- **“Procore no longer accepts the connection's keys.”** The secret was regenerated or the app was uninstalled. Select Reconnect and enter the current keys.
- **“Procore did not answer just now. Try again in a minute.”** Procore's service was busy. Try again in a minute.

## Help from the provider

- [Create an App (Procore)](https://developers.procore.com/documentation/building-apps-create-new)
- [Install a Custom App (Procore)](https://support.procore.com/products/online/user-guide/company-level/admin/tutorials/install-a-custom-app)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
