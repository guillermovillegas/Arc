// Cloudflare Turnstile verification for the public marketing opt-in.
//
// The IP-address rate limit alone punishes shared NAT egress (offices, campuses,
// carrier CGNAT) while a bot that rotates `x-forwarded-for` sidesteps it, so the
// real abuse control is a challenge the caller cannot forge. Verification is
// optional: with no secret configured the function keeps its previous behaviour
// so the form is never broken by a half-provisioned deployment.

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type VerifyTurnstile = (
  secret: string,
  token: string | null,
  remoteIp: string | null,
) => Promise<boolean>;

export const verifyTurnstileToken: VerifyTurnstile = async (
  secret,
  token,
  remoteIp,
) => {
  if (!token) return false;

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (remoteIp) form.append("remoteip", remoteIp);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: form,
    });
    if (!response.ok) return false;
    const body = await response.json() as { success?: boolean };
    return body.success === true;
  } catch {
    // Fail closed: an unreachable verifier must not become an open door.
    return false;
  }
};
