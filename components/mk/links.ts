// Where the site's calls to action go. The app lives on its own subdomain.
export const APP_ORIGIN = 'https://app.astruct.io'
// Every call to action is "Request a free trial": it goes to the request form,
// which writes to the leads table, and Ted sends the invite. The trial terms
// sit under it everywhere, from this one line, so they never drift.
export const TRIAL_URL = '/request-trial'
export const CTA_LABEL = 'Request a free trial'
export const TRIAL_LINE = 'Free for 30 days. Two projects and 100 credits. No\u00a0card.'
// "Book a walkthrough": Ted's Google Calendar booking page on info@astruct.io
// (30-minute "Astruct walkthrough with Ted"). It opens in a new tab.
export const BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0MgJKmcMd-sB9r6myaCNqf62YC_BOIoBgTDH6jXTgguxoUvzSs5_tocmOhYiHzWbaFLgdO_Vp2'
export const BOOKING_LABEL = 'Book a walkthrough'
export const LOGIN_URL = `${APP_ORIGIN}/login`
export const CONTACT_EMAIL = 'info@astruct.io'
export const SITE_ORIGIN = 'https://astruct.io'
