---
title: Deadlines and “check the clause”
summary: How Astruct works out a deadline, why it shows the clause, and what it can’t know.
category: agent
order: 5
keywords: deadline time bar notice period business days calendar holidays check the clause confirm rule limits
---
Every deadline Astruct shows comes with the clause it was worked out from. It stays marked **Check the clause** until someone on your team confirms the rule for the project.

## How a deadline is worked out

1. **The trigger.** Astruct finds the event the period runs from, for example the time a direction was received or the date you became aware of a delay. It shows the email or document that fixes that date.
2. **The rule.** It finds the clause that governs the event in your contract. Where a special condition replaces a general condition, it uses the special condition. It shows the clause text and its page.
3. **The count.** It applies the period the clause sets:
   - **business days or calendar days**, as the contract defines them;
   - **public holidays** in the state named in the contract, and any other days the contract excludes, such as a Christmas shutdown;
   - **when a notice is received**, where the contract says, for example, that an email sent after 5.00 pm is received the next business day;
   - whether the day of the event itself counts.
4. **The result.** A date and time, with the working shown, such as *Received Fri 25 Sep, 3:12 pm · 5 Business Days · Brisbane · due Fri 2 Oct, 5:00 pm*.

## Confirming the rule

Open the issue and read the clause beside the deadline. If it is right, choose **Confirm rule**. You confirm each rule once per project. Later issues under the same clause use the confirmed rule.

If it is wrong, for example because a later amendment changed the period, correct it on the issue.

## The limits

Be clear about what Astruct can and can’t know:

- **It only sees connected sources.** A direction given on site, by phone or to a mailbox you haven’t connected isn’t seen until it is added.
- **It relies on the contract you gave it.** A missing annexure, amendment or side letter can change the answer.
- **The trigger date is a judgement.** When you *became aware* of a delay can be arguable. Astruct shows its evidence so you can decide.
- **The law can add to the contract.** Security of payment law and other legislation can set their own periods, and courts can read time bars in different ways.

Astruct helps you give notice on time. Your team remains responsible for your notices, and for legal advice where you need it.
