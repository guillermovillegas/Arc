# Stakeholder audit notes — David, 2026-09-01 (WS-A)

> **Source document.** Verbatim notes from David's platform audit (plan
> `docs/PLAN.md` WS-A, due Sep 1). Requirements derived from these notes live in
> `docs/REQUIREMENTS.md` with IDs that cite the section headings below. Do not
> edit this file except to append later note batches under a dated heading.

## Practitioner (provider) dashboard

### Overview Screen

- GPS interface shown on login, with a map of nearby users needing services
- Incoming bookings surface as "Pending" cards showing:
  - Client name, address, and requested service
  - Accept/Decline option, then auto-sends ETA (Uber-style) on acceptance
  - Client photo and reviews visible to practitioner
- Booking status flow: Pending → Confirmed → Completed
  - Remove "In Progress" state: screen should go blank during active service
  - "All" filter replaced with just "Completed," showing past bookings with date, time, and earnings
- Reviews are two-way: clients review practitioners, practitioners review clients
  - Client-facing reviews hidden from clients (internal community trust layer)

### Scheduling: Replace With "Ready to Work" Toggle

- Drop the weekly schedule grid entirely: too "9-to-5," will alienate barbers
- Replace with a single green toggle button
  - Label options: "Ready to Go Behyond the Chair," "Ready to Travel," or similar empowering phrase
  - Active = available now; no fixed hours required

### Services, Portfolio, and Profile (Merged Section)

- Combine Services, Portfolio, and Profile into one unified section
- Service setup:
  - Practitioner selects their trade (barber, nail tech, stylist, etc.) with a free-text "add your own" option
  - Full dropdown menu of services with custom pricing per item
- Travel/mileage fee:
  - Charge per mile on top of service price (starting at $0.70–$1.00/mile)
- Premium hour pricing (auto-applied based on time of booking):
- EXAMPLES:
  - 6–9 AM: fixed $100 rate
  - 9 AM–5 PM: fixed $85 rate
  - 6–10 PM: back to $100
  - Travel fee always added on top; always shown to both client and practitioner
- Portfolio:
  - In-app photo and video uploads
  - Optional Instagram link for exposure, but keep users on-platform as primary goal
- Profile:
  - Name, bio, rating, reviews, service radius
  - Mandatory intro video: name, trade, years of experience, short Q&A to build client trust

### Earnings

- Show net take-home only (after fees), not gross minus deductions
  - Example: earned $100, after fees $92 → display "$92 total to date"
  - Make it known that all tips are 100% theirs to keep.
- Faineant takes 5%; Stripe takes standard fees; neither should be prominently displayed
  - If shown at all, fees go in a small/secondary area
- Add inspirational quotes to the earnings screen
- Remove "Ledger" label: unclear, replace with simpler language
- Update font and color contrast to make the section feel distinct and motivating

### No-Show and Cancellation Policy

- Cancellation window: 3 hours in advance (not 24 hours), given travel/fuel costs
- No-show trigger: 15+ minutes with no contact from client
- Practitioner documentation steps:
  1. Photo of location with timestamp
  2. Screenshot of outbound call history as proof of attempt
  3. Auto-send message to client (e.g., "Hi [Name], I've been waiting 15 minutes and tried reaching you. Per policy, a no-show fee will be charged.")
- No-show fee: 50% of the full service price
  - Split: 70% to practitioner, 30% to Faineant
  - Example: $100 service → $50 fee → practitioner keeps $35, Faineant keeps $15
- Policy must be clearly established and agreed to before the appointment is confirmed

### Next Steps (practitioner)

- **Consolidate Services, Portfolio, and Profile into one nav section**
- **Design the "Ready to Work" toggle to replace the Schedule screen**
- **Finalize no-show fee split percentages**
- **Finalize premium hour pricing tiers and mileage rate**

## Client dashboard

### Colors and Typography

- Background too dark overall: lighten it to improve readability
- Font contrast issue: background and lettering both dark, pick one or the other
  - Light background needs dark text, or vice versa
  - "Your calendar is quiet" text too light, needs to pop more
- Welcome greeting ("Welcome, Quinn") to use cursive font for a luxurious feel

### Overview and Booking Flow

- Overview page to include:
  - GPS map showing practitioner locations
  - Available barbers, styles, and practitioners
  - Past visits section (status: completed, in progress, no-show; date, time, day)
  - Price display TBD: may omit to avoid deterring clients
  - Service type, provider name, and service rendered per visit
- Bookings section to feel like a hotel concierge:
  - Replace "zero on the calendar" with a call-to-action: "Nothing on today's calendar. How can we help you?"
  - Surface nearby practitioners, services, or promotions inline
  - "Find a practitioner" currently leads to a 404, needs fixing
- GPS integration: clicking "Find a Practitioner" should open a service-selection flow
  - Prompt: "What are you looking to get?" with typed input or smart suggestions
  - Personalized nudges based on last visit (e.g. "Last time you got a haircut")
- Inspirational short quotes throughout the page (example: "A short slow ledger. What's coming and what's already been")

### Messaging

- Chat UI to mimic iMessage style
  - Show profile photo, date, and time per message
  - Online status indicator: green dot when user is active in the app
- In-app notification pop-up when a message arrives, regardless of which section the user is in
  - Goal: keep users on the web app, no need to log off

### Profile and Notifications

- Profile fields: first name, last name, email, profile photo, address
  - Replace "neighborhood" with "apartment/building type": options for house, apartment, hotel, warehouse, etc.
  - Arrival note font ("she arrives at two") needs to be bolder with stronger color contrast
  - Card on file: keep as-is
- Notifications:
  - Visit reminders to be automated on booking (no manual toggle needed)
  - Keep "quiet rebooking" and "occasional letter" settings as-is

### Next Steps (client)

- **Fix "Find a Practitioner" 404 error**
- **Decide on price display in past visits**
- **Automate visit reminders on booking**
- **Revise color and font contrast across client page**

## Landing page

### Overall Direction

- Logo and "Fainnt" wordmark: keep as-is across the whole site
- Hero image of the woman: fine for now, swap for real photos later
- Background color: lighten to a warm brown (Skims-inspired), cream, or white
  - Keep darker tones for text and UI elements so everything stays readable
- General principle: user-friendly, straightforward, no hidden info, all prices visible

### Typography and Color Adjustments

- Main Fainnt logo font: keep the current font and color exactly
- Secondary/nav text (Services, Manifesto, Sign In): slightly too small
  - Make bolder, increase contrast
  - Consider white instead of cream for key call-to-action labels
- Hero subtext ("She has just arrived. The kit is heavy. The towels are warm."): keep the copy and color tone, just make it bolder and easier to read
- Manifesto section font: already great, no changes needed

### Call to Action and Map Feature

- Current CTAs ("Reserve a Window," "View Practitioners"): reconsider placement and wording
  - Inspiration: the Cut app, which shows a zip-code-entry map immediately on load
  - Explore replacing or supplementing CTAs with an interactive map
  - Map would show practitioners, locations, and prices; clicking leads to a booking page
- "One App. Three Tabs." section: keep as-is
  - Service, Pick a Window, Open the Door: clear and direct, no changes needed

### Manifesto Page and Brand Story

- Manifesto page currently empty: needs content
- Core brand meaning of "Fainnt": a person who feels stuck or idle
  - Double meaning: it's okay to feel sluggish at home, and we come to you
  - Tone: community-driven, human, relatable
- Manifesto content to include:
  - Why it's called Fainnt (origin story and double meaning)
  - Who we are, what we are, where we're established
- Consider adding a live map or live GPS view on the login/manifesto page
- Recurring quote style throughout the site: short, engaging lines ("You are the celebrity," "Be the change," "See the change from your own home")

### Next Steps (landing)

- **Update secondary fonts site-wide**
- **Prototype the interactive map on the landing page**
- **Write the Manifesto page copy**
- **Test lighter background options**
