---
title: Connecting Google Calendar
summary: Site meetings and key dates from Google Calendar, connected in one click.
category: connecting
order: 14
keywords: gcal google calendar connect guide mail and
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

Connect it yourself with your Google account.

- **Who does it:** You.
- **How long:** About two minutes.

## What Astruct reads

- Events in the calendars you link: site meetings, inspections and key dates, set beside the contract's dates. Astruct never changes your events; it adds one only when you approve it.

## Connect Google Calendar

1. Open Apps. On the Google Calendar row, select Connect and sign in with your Google account. If Google says it has not verified the app, select Continue. [Unverified apps (Google)](https://support.google.com/cloud/answer/7454865)

## Link calendars to a project

1. Choose the project in the Project list at the top of Apps.
2. On the row, select Choose calendars, then Link a calendar. Find it in the list (select a name to open it) and select Link.
3. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## When it is working

- The Google Calendar row says Connected and how many calendars are linked to the project.

## If something goes wrong

- **Access blocked (on the provider's screen)** Your Google Workspace administrator limits third-party apps. Ask them to allow Astruct, then connect again.
- **“did not connect: permission was not given. Try again.”** You chose Cancel or Deny on the provider's screen, or your organisation lets only an administrator approve new apps. Select Connect again and approve. If it stops at an approval screen, see the admin step in this guide.
- **“did not connect. Try again.”** The sign-in was open for more than 15 minutes, was started in another tab or browser, or the provider did not hand over access. Start again from the row, in one tab, and finish the sign-in within 15 minutes. If it fails twice, sign out of the provider in that browser, then connect again.
- **“Needs reconnecting”** The provider asked for permission again, for example after a password change or a new security policy. Select Reconnect on the row and sign in. What arrived in the meantime is read once it reconnects.

## Help from the provider

- [Unverified apps (Google)](https://support.google.com/cloud/answer/7454865)
- [Manage connections between your Google Account and third parties (Google)](https://support.google.com/accounts/answer/13533235)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
