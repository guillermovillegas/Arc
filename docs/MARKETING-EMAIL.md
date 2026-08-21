# Marketing email consent and delivery

This runbook owns the homepage email list, its consent evidence, immediate
welcome message, suppression behavior, and release gates. It is not a substitute
for review by counsel in every place where Faineant markets.

## User contract

Disclosure version `marketing-email-v1` requires a separate, unchecked choice:

> I agree to receive marketing emails from Faineant, Inc. about launch updates,
> in-home services, events, and offers. Consent is not a condition of purchase. I
> can withdraw consent at any time using the unsubscribe link.

The UI links the disclosure to `/privacy` and `/marketing-terms`. Do not broaden
the topics, add SMS, pre-check the box, or bundle this choice into registration or
purchase terms without a new disclosure version and legal review.

This structure follows the FTC's CAN-SPAM guidance for accurate sender/subject,
commercial identification, a valid postal address, and a working opt-out, and the
ICO's PECR guidance for a freely given, specific, informed, affirmative choice and
consent records:

- <https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business>
- <https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/how-do-we-comply-with-the-pecr-electronic-mail-marketing-rules/>

## Data and security flow

1. The browser validates email, honeypot, and explicit consent, then invokes the
   public `marketing-subscribe` Edge Function.
2. The function validates the exact disclosure version and permitted site origin.
3. It records normalized email, consent time/source/version, referrer, user agent,
   and an HMAC of the request address in `waitlist_entries`.
4. Anonymous SQL writes are denied. The service-role Edge Function is the only
   subscription writer; the service key never reaches the browser.
5. A newly consented address receives one branded welcome through Resend. The send
   uses an idempotency key and is recorded only after provider success.
6. The email includes human and provider one-click unsubscribe paths. Withdrawal
   changes the row to `unsubscribed`; the suppression record is retained.

Rows captured before this disclosure remain `legacy`. They are not eligible for
marketing unless the person returns and gives fresh consent.

Public responses do not reveal whether an address was already subscribed. The
browser uses the same confirmation language for new and existing addresses.

Every future audience query must require:

```sql
where marketing_status = 'subscribed'
  and consent_at is not null
  and unsubscribed_at is null
```

## Required production configuration

The Edge Function requires these Supabase secrets:

- `RESEND_API_KEY`
- `EMAIL_FROM_NAME`
- `EMAIL_FROM_ADDRESS`
- `WEB_URL`
- `MARKETING_POSTAL_ADDRESS` — the owner's valid physical postal address
- `MARKETING_SIGNING_SECRET` — at least 32 random bytes
- `MARKETING_ALLOWED_ORIGINS` — optional comma-separated preview origins
- `TURNSTILE_SECRET_KEY` — optional Cloudflare Turnstile secret. When set, a
  solved challenge is required before any database read or write. Deploy it
  together with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` on Vercel; a secret without a
  site key refuses every submission, so set the site key first.

Never invent the postal address or commit secret values. Resend's domain DKIM and
return-path records must resolve publicly before the function is enabled for live
submissions. `privacy@faineantapp.com` must be a monitored mailbox or alias before
release.

## Abuse controls and the address budget

Subscriptions are capped at 30 charged requests per HMAC-of-address per rolling
hour. "Charged" means the request records consent or sends a welcome note.
Re-submitting an address that is already subscribed and already welcomed writes
nothing and sends nothing, so it costs no budget.

The bucket key is an IP address, which is not a person. Offices, campuses, VPNs
and carrier CGNAT put many genuine visitors behind one egress address, and a bot
that rewrites `x-forwarded-for` gets a fresh budget for free. The budget is
therefore a coarse flood stop only. Turnstile, the honeypot and the explicit
consent gate are the controls that actually distinguish a person from a script.

To find out whether a visitor report of "Too many requests. Try again later."
is a real cap or a shared-address collision:

```sql
select ip_hash, count(*) as charged, min(consent_at), max(consent_at)
from public.waitlist_entries
where consent_at > now() - interval '1 hour'
group by ip_hash
order by charged desc;
```

Welcome-note delivery failures are recorded separately and never surface as a
rate-limit message. Resend throttling appears as `Resend error 429: ...` in
`last_email_error`:

```sql
select email, marketing_status, consent_at, welcome_email_sent_at, last_email_error
from public.waitlist_entries
where last_email_error is not null
order by updated_at desc
limit 50;
```

Supabase Auth email (signup confirmation, password reset) is a separate path
that leaves through Resend SMTP and is governed by `[auth.rate_limit].email_sent`
in `supabase/config.toml`, not by anything in this function.

## Email compliance controls

The welcome email:

- truthfully identifies the subscription in its subject;
- labels itself as an advertisement from Faineant, Inc.;
- explains why the recipient received it and what topics may follow;
- states that no purchase is required;
- includes the configured valid physical postal address;
- includes a visible unsubscribe link plus RFC 8058 `List-Unsubscribe` headers.

Resend documents one-click unsubscribe headers for API-sent email here:
<https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails>.

## Verification and release

Before any hosted change:

```sh
pnpm db:reset
pnpm db:test
pnpm db:types
deno check --node-modules-dir=auto supabase/functions/marketing-subscribe/index.ts
deno test --allow-env --node-modules-dir=auto supabase/functions
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Then, with explicit production authorization only:

1. Confirm the owner-supplied legal name, postal address, monitored privacy inbox,
   and counsel-approved copy.
2. Verify Resend DKIM, SPF/return-path, and DMARC evidence.
3. Apply the reviewed database migration and confirm its ledger entry.
4. Set the required function secrets without printing them.
5. Deploy `marketing-subscribe` with JWT verification disabled; the function
   performs its own origin, token, rate-limit, and body checks.
6. Run `pnpm db:verify:hosted`; it must confirm the migration ledger, function,
   JWT setting, and required secret names without exposing their values.
7. Deploy the exact Vercel commit containing the new form and legal routes.
8. Use a disposable, owner-controlled inbox to opt in through the real UI.
9. Prove the row contains the current consent version, the welcome message arrives
   with the correct sender/footer/headers, and its unsubscribe changes the row.
10. Delete or clearly label the disposable fixture after evidence is captured.

Do not seed a real person's address, send a live marketing message without their
affirmative choice, or treat a successful API response as delivery evidence.
