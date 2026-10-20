---
title: Connecting InEight Document (TeamBinder)
summary: The InEight Document register, project mail and transmittals, with credentials InEight issues.
category: connecting
order: 21
keywords: ineight document teambinder connect guide project platforms
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

InEight issues API credentials for integrations. If your company already holds them, enter them on InEight's sheet and it connects. If not, request a connection and Astruct arranges it with InEight and your administrator.

- **Who does it:** Your InEight administrator, with your InEight account representative, who issues the credentials. Then you enter them.
- **How long:** A few minutes to enter the credentials. Getting them from InEight takes as long as InEight takes.

## What Astruct reads

- The document register, project mail and transmittals of the InEight Document projects the API user can see, with their numbers, senders, recipients and dates. Read only.

## What your InEight administrator gets first

1. InEight's account representative issues a Client ID, a Client Secret and a Tenant ID for API access. [InEight API, getting started (InEight)](https://developer.ineight.com/getting-started)
2. An InEight APIM account (developer.ineight.com) subscribes to the External Integrations product. Its subscription key is the APIM subscription key.
3. The InEight administrator gives the API user the permission Manage external API's (Suite administration > Application integrations).

## Enter the credentials

1. Open Settings > Connections and, on the InEight Document (TeamBinder) row, select Enter API credentials. (On Apps, open the row's More menu and select Enter API credentials.)
2. Enter the InEight environment address (for example yourcompany.hds.ineight.com), the Tenant ID, the Client ID, the Client Secret and the APIM subscription key, and select Connect.
3. Astruct checks them with InEight before saving. The secrets are stored encrypted and never shown again.
4. Choose the project in the Project list at the top of Apps.
5. On the row, select Choose InEight Document projects, then Link an InEight Document project. Find it in the list (select a name to open it) and select Link.
6. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## Or request it

1. On the InEight row, select Request connection. Enter your InEight environment address, the company name in InEight and your InEight administrator's email.
2. Until then, upload what you need from it to the project as files, folders or zips. See the Uploads guide.

## When it is working

- The row says Connected and how many InEight Document projects are linked to the project.

## If something goes wrong

- **“InEight no longer accepts the API credentials”** Enter the current Client ID and Secret InEight issued, with Enter API credentials.
- **“InEight needs”** A field was left empty. Enter every field on the sheet.
- **“is not linked to the InEight environment”** The API user cannot see that project. Your InEight administrator adds it, or link another project.
- **“InEight is limiting requests; the sync will resume shortly.”** Nothing to do. The sync carries on.
- **“Needs more from you”** Astruct has asked a question about your request. The line under it, and an email to you, say what is needed. Select Add details on the row to answer.

## Help from the provider

- [InEight API, getting started (InEight)](https://developer.ineight.com/getting-started)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
