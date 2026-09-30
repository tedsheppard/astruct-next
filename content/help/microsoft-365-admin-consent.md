---
title: Admin consent for Microsoft 365
summary: Your Microsoft 365 administrator approves Astruct once for the whole organisation, using one link.
category: connecting
order: 3
keywords: admin consent approve it administrator entra azure tenant sharepoint shared mailbox permission blocked
---
Some Microsoft 365 organisations need an administrator to approve an app before anyone can use it. Astruct needs this approval for **SharePoint** and **shared mailboxes**, and for any organisation that stops people approving apps themselves.

It is one link, opened once.

## For the Astruct admin in your team

1. Open **Settings > Connections**.
2. Under **Ask your IT admin to approve Astruct**, choose **Copy link**.
3. Send the link to your Microsoft 365 administrator with a short note saying what it is for.

Only owners and admins of your Astruct organisation see this section.

## For the Microsoft 365 administrator

1. Open the link and sign in with an administrator account.
2. Microsoft shows the permissions Astruct asks for: reading mail (including shared mailboxes the person can already open), sending mail when a person chooses to, calendars, reading files and SharePoint sites, and the person’s basic profile.
3. Choose **Accept**.

That is all. The approval covers your whole organisation, and each person still connects their own account and only sees what they could already see in Microsoft 365.

## Revoking

Your administrator can remove Astruct at any time in the Microsoft Entra admin centre under **Enterprise applications**. Connections stop working straight away.

## If Microsoft shows an error

- **“Need admin approval”** when someone connects: the approval above hasn’t been given yet.
- **The publisher is shown as unverified**: this is expected while Microsoft completes publisher verification. The link and the permissions are the same.

Still stuck? Email hello@astruct.io and we’ll help your administrator through it.
