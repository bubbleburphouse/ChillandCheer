/* ============================================================================
   Worker entry for the static site.

   Everything is served from the built assets except /api/signup, which takes
   the newsletter form, files the address with Brevo and sends a welcome email.
   The API key lives in the site's secrets (BREVO_API_KEY) and never reaches the
   browser.

   The custom domain serves assets only, so the form on that domain posts here
   from the browser: both site origins are allowed, and nothing else is.
   ========================================================================== */

const BREVO_CONTACTS = "https://api.brevo.com/v3/contacts";
const BREVO_EMAIL = "https://api.brevo.com/v3/smtp/email";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SITE_ORIGINS = [
  "https://chillandcheerstation.com",
  "https://www.chillandcheerstation.com",
];
const SITE = "https://chillandcheerstation.com";
const DEFAULT_SENDER = "chillandcheerstation@gmail.com";

const WELCOME_SUBJECT = "Thank you for signing up";

const WELCOME_TEXT = [
  "Thank you for signing up",
  "",
  "You're on the Chill & Cheer Station list: new flavours, seasonal specials",
  "and first dibs on dates, straight to your inbox.",
  "",
  "Planning something? Reply to this email or check availability at",
  SITE + " — we bring the slush bar to you across Eastern Ontario and",
  "Western Quebec.",
  "",
  "Chill & Cheer Station",
  "Eastern Ontario · Western Quebec",
  "",
  "You're receiving this because you signed up at " + SITE + ".",
  "Reply with \"unsubscribe\" and we'll take you off the list.",
].join("\n");

const WELCOME_HTML = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#fff9e7;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff9e7;padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;color:#462417;">
            <tr>
              <td style="padding:34px 32px 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#d9496b;">
                Chill &amp; Cheer Station
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <h1 style="margin:10px 0 0;font-size:30px;line-height:1.15;font-weight:normal;">Thank you for signing up</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0;font-size:16px;line-height:1.6;color:#5a3a2b;">
                <p style="margin:0 0 14px;">You're on the list: new flavours, seasonal specials and first dibs on dates, straight to your inbox.</p>
                <p style="margin:0 0 22px;">Planning something? Reply to this email, or check availability and we'll bring the slush bar to you.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 30px;">
                <a href="${SITE}" style="display:inline-block;background:#f06786;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;letter-spacing:.04em;text-decoration:none;padding:14px 26px;border-radius:999px;">Check availability</a>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 30px;border-top:1px solid #f3e6cd;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#8a6f60;">
                Eastern Ontario &middot; Western Quebec<br />
                You're receiving this because you signed up at ${SITE}.<br />
                Reply with &ldquo;unsubscribe&rdquo; and we'll take you off the list.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

function cors(origin, url) {
  if (!origin) return null;

  const allowed = origin === url.origin || SITE_ORIGINS.indexOf(origin) !== -1;
  if (!allowed) return false;

  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign(
      {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
      headers || {}
    ),
  });
}

/* the contact is already saved by the time this runs: a mail problem must never
   turn a successful sign-up into an error on the page */
async function sendWelcome(env, email) {
  const sender = env.BREVO_SENDER || DEFAULT_SENDER;

  try {
    const response = await fetch(BREVO_EMAIL, {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Chill & Cheer Station", email: sender },
        to: [{ email: email }],
        replyTo: { email: sender, name: "Chill & Cheer Station" },
        subject: WELCOME_SUBJECT,
        htmlContent: WELCOME_HTML,
        textContent: WELCOME_TEXT,
        tags: ["website-signup"],
      }),
    });

    return response.ok ? "sent" : "failed";
  } catch (error) {
    return "failed";
  }
}

async function signup(request, env, url) {
  const origin = request.headers.get("Origin");
  const allowed = cors(origin, url);

  if (allowed === false) return json({ ok: false, error: "origin" }, 403, { vary: "Origin" });

  const headers = allowed || {};

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });

  if (request.method !== "POST") return json({ ok: false, error: "method" }, 405, headers);

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return json({ ok: false, error: "body" }, 400, headers);
  }

  const email = String((payload && payload.email) || "")
    .trim()
    .toLowerCase();

  if (!EMAIL.test(email) || email.length > 254) {
    return json({ ok: false, error: "email" }, 400, headers);
  }

  const key = env.BREVO_API_KEY;
  if (!key) return json({ ok: false, error: "unconfigured" }, 503, headers);

  const body = { email: email, updateEnabled: true };

  const listId = Number(env.BREVO_LIST_ID);
  if (Number.isInteger(listId) && listId > 0) body.listIds = [listId];

  let response;
  try {
    response = await fetch(BREVO_CONTACTS, {
      method: "POST",
      headers: {
        "api-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    return json({ ok: false, error: "network" }, 502, headers);
  }

  if (response.ok || response.status === 204) {
    /* 201 means Brevo created the contact; 204 means it already existed, and a
       returning subscriber should not get the welcome again */
    const welcome = response.status === 201 ? await sendWelcome(env, email) : "skipped";
    return json({ ok: true, welcome: welcome }, 200, headers);
  }

  let message = "";
  try {
    message = (await response.json()).message || "";
  } catch (error) {
    /* Brevo answered with something that isn't JSON */
  }

  return json({ ok: false, error: "brevo", status: response.status, message: message }, 502, headers);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/signup") return signup(request, env, url);

    return env.ASSETS.fetch(request);
  },
};
