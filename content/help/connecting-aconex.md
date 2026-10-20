---
title: Connecting Oracle Aconex
summary: The Aconex document register and project mail, with an OAuth client your Lobby admin makes.
category: connecting
order: 19
keywords: aconex oracle connect guide project platforms
source: written from lib/connectors/guides.ts in the Astruct app by scripts/gen-help-guides.ts; edit it there
---

Connect with your own Aconex keys: your Lobby admin makes an OAuth client for Astruct in the Oracle Lobby, once, and you enter its keys on Apps. One-click Connect arrives once Oracle approves Astruct's partner registration. Connections made with keys keep working then.

- **Who does it:** Your Lobby admin (an Oracle Lobby Admin in your organisation), once. Then you, or anyone in your team, enters the keys.
- **How long:** About 10 minutes of the Lobby admin's time.

## What Astruct reads

- The document register and project mail (with mail numbers, senders, recipients and sent dates) of the Aconex projects the bound Lobby user is on. Astruct sees what that user sees.
- Read only: Astruct never sends mail or transmittals in Aconex and never changes the register.

## For your Lobby admin

Your Lobby admin makes an OAuth client for Astruct in the Oracle Lobby, once. Astruct then reads Aconex as the Lobby user bound to that client, and only reads.

1. Sign in to the Lobby at constructionandengineering.oraclecloud.com as a Lobby Admin. AU2 (AU Gov) accounts use constructionandengineering-au2.oraclecloud.com. [Lobby and Aconex links](https://help.aconex.com/aconex-essentials/what-are-the-links-for-each-instance-and-lobby)
2. Choose the Lobby user Astruct reads as. A service user on the projects Astruct may read works best: every call runs as that user, so Astruct sees what it sees.
3. Open OAuth Clients from the main menu and select Add. Enter a Name (Astruct) and a Description (Astruct reads the document register and mail). [Create an OAuth client](https://help.aconex.com/apis/create-an-oauth-client/)
4. Set Resource Application to Aconex and Type to User-Bound Integration. In User Account, choose the user from step 2.
5. Select your organisation, accept the Aconex API terms of use, then select Add.
6. Select the new client in the list. Copy the Client ID, then select the eye icon and copy the Client Secret. [Find your OAuth client credentials](https://help.aconex.com/apis/find-your-scp-oauth-client-credentials/)
7. Send the Client ID and the Client Secret to whoever connects Astruct, by a private channel. If that Lobby user has more than one Aconex account, send its Aconex user ID (in Aconex: Setup > Account Details, just above Title) and the Aconex address it signs in to, for example https://au1.aconex.com. [Find your User ID](https://help.aconex.com/your-account/find-your-user-organization-project-id/)

## Then connect

1. Open Apps. On the Aconex row, select Connect with your Aconex keys. The sheet shows the Lobby admin's steps above; Copy steps puts them on the clipboard to send.
2. Enter the Client ID and the Client Secret. If the bound Lobby user has more than one Aconex account, tick My Lobby account has more than one Aconex account and enter the Aconex user ID and the instance URL, for example https://au1.aconex.com.
3. Select Connect. Astruct checks the keys with Oracle before saving them and lists the Aconex projects the user is on. The Client Secret is stored encrypted and never shown again.
4. Choose the project in the Project list at the top of Apps.
5. On the row, select Choose Aconex projects, then Link an Aconex project. Find it in the list (select a name to open it) and select Link.
6. Astruct reads everything in it now, files each item to the project, then checks for new and changed items. Link more, or select Move here on one linked to another project.

## When it is working

- A message names the Aconex user, the instance and how many projects are visible.
- The Aconex row says Connected and how many Aconex projects are linked to the project.

## If something goes wrong

- **“Oracle does not recognise that Client ID and Client Secret.”** In the Lobby, open OAuth Clients, select the client and copy both again. The eye icon shows the secret.
- **“has more than one Aconex account.”** Tick My Lobby account has more than one Aconex account and enter the Aconex user ID (Aconex: Setup > Account Details, just above Title) and the instance URL.
- **“Oracle does not link Aconex user”** Check the user ID and the instance URL belong to the Lobby user bound to the client.
- **“has no Aconex account linked.”** In the Lobby, edit the OAuth client and bind a user who has an Aconex account.
- **“Oracle will not issue a token to that client without a person signing in.”** In the Lobby, check the client's Resource Application is Aconex and its Type is User-Bound Integration.
- **“sign-on policy (single sign-on or two-step verification) blocks this client.”** The Lobby admin adds the OAuth client's app, whose name ends in _client, to that sign-on policy.
- **“Oracle issued a token, but Aconex did not accept it.”** Check the client's Resource Application is Aconex.
- **“Aconex has not switched on API access for”** Your Aconex organisation admin asks Oracle Support to switch on API access.
- **“is on no Aconex projects yet.”** In Aconex, add the bound user to the projects Astruct may read, then try again.
- **“That is the Lobby's address.”** Enter the Aconex address the user signs in to, for example https://au1.aconex.com, not the Lobby's.
- **“Oracle does not offer User-Bound Integration on High Compliance instances”** Keys cannot connect a High Compliance instance. Request a connection and upload meanwhile.
- **“Oracle no longer accepts the connection's keys.”** The client was changed or removed in the Lobby. Select Reconnect and enter the current keys.
- **“Aconex did not answer just now. Try again in a minute.”** Aconex was busy. Try again in a minute.

## Help from the provider

- [Create an OAuth client (Oracle Aconex)](https://help.aconex.com/apis/create-an-oauth-client/)
- [Lobby and Aconex links (Oracle Aconex)](https://help.aconex.com/aconex-essentials/what-are-the-links-for-each-instance-and-lobby)

Astruct never asks for your password. Still stuck? Email info@astruct.io.
