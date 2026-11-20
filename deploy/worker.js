/* ============================================================================
   Worker entry for the static site.

   Everything is served from the built assets except two routes:

     POST /api/signup       files the newsletter address with Brevo and sends a
                            welcome email in the language the visitor was reading
     GET  /api/unsubscribe  takes a signed link from that email and removes the
                            contact from the newsletter list

   The API key lives in the site's secrets (BREVO_API_KEY) and never reaches the
   browser. The unsubscribe link is signed with UNSUBSCRIBE_SECRET so only the
   person holding the email can remove that address.

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
const WORKER = "https://site-806e683dd94e4381a422409af0323082.freebuff.page";
const UNSUBSCRIBE_URL = WORKER + "/api/unsubscribe";
const DEFAULT_SENDER = "hello@chillandcheerstation.com";
/* hello@ is the brand inbox; replies land there and are read */
const DEFAULT_REPLY_TO = "hello@chillandcheerstation.com";

const WELCOME = {
  en: {
    subject: "Thank you for signing up",
    heading: "Thank you for signing up",
    p1: "You're on the list: new flavours, seasonal specials and first dibs on dates, straight to your inbox.",
    p2: "Planning something? Reply to this email, or check availability and we'll bring the slush bar to you.",
    cta: "Check availability",
    place: "Eastern Ontario &middot; Western Quebec",
    placeText: "Eastern Ontario · Western Quebec",
    why: `You're receiving this because you signed up at ${SITE}.`,
    unsubscribe: "Unsubscribe",
    intro: "You're on the Chill & Cheer Station list: new flavours, seasonal specials",
    intro2: "and first dibs on dates, straight to your inbox.",
    planning: "Planning something? Reply to this email or check availability at",
    planning2: SITE + ", and we'll bring the slush bar to you across Eastern Ontario",
    planning3: "and Western Quebec.",
    sign: "Chill & Cheer Station",
  },
  fr: {
    subject: "Merci de votre inscription",
    heading: "Merci de votre inscription",
    p1: "Vous êtes sur la liste : nouvelles saveurs, offres saisonnières et priorité sur les réservations — directement dans votre boîte de réception.",
    p2: "Vous préparez un événement ? Répondez à ce courriel, ou vérifiez les disponibilités et nous apporterons la bar à slush chez vous.",
    cta: "Vérifier les disponibilités",
    place: "Est de l'Ontario &middot; Ouest du Québec",
    placeText: "Est de l'Ontario · Ouest du Québec",
    why: `Vous recevez ce courriel parce que vous vous êtes inscrit sur ${SITE}.`,
    unsubscribe: "Se désabonner",
    intro: "Vous êtes sur la liste de Chill & Cheer Station : nouvelles saveurs,",
    intro2: "offres saisonnières et priorité sur les réservations.",
    planning: "Vous préparez un événement ? Répondez à ce courriel ou vérifiez les",
    planning2: "disponibilités à " + SITE + ", et nous apporterons la bar à slush chez vous",
    planning3: "dans l'Est de l'Ontario et l'Ouest du Québec.",
    sign: "Chill & Cheer Station",
  },
};

const UNSUB_PAGE = {
  en: {
    removed: ["You're off the list", "We've removed you from the Chill & Cheer newsletter. If you change your mind, the sign-up form is always on the site."],
    failed: ["That didn't go through", "We couldn't remove you just now. Reply to the welcome email and we'll take care of it by hand."],
    missing: ["This link is incomplete", "The unsubscribe link is missing something. Reply to the welcome email and we'll take you off the list by hand."],
    back: "Back to the site",
  },
  fr: {
    removed: ["Vous êtes désabonné", "Nous vous avons retiré de l'infolettre Chill & Cheer. Si vous changez d'avis, le formulaire d'inscription reste sur le site."],
    failed: ["L'opération n'a pas abouti", "Nous n'avons pas pu vous retirer à l'instant. Répondez au courriel de bienvenue et nous nous en occuperons manuellement."],
    missing: ["Ce lien est incomplet", "Il manque un élément au lien de désabonnement. Répondez au courriel de bienvenue et nous vous retirerons de la liste manuellement."],
    back: "Retour au site",
  },
};

function welcomeText(copy, link) {
  return [
    copy.heading,
    "",
    copy.intro,
    copy.intro2,
    "",
    copy.planning,
    copy.planning2,
    copy.planning3,
    "",
    copy.sign,
    copy.placeText,
    "",
    copy.why,
    copy.unsubscribe + ": " + link,
  ].join("\n");
}

function welcomeHtml(copy, lang, link) {
  return `<!doctype html>
<html lang="${lang}">
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
                <h1 style="margin:10px 0 0;font-size:30px;line-height:1.15;font-weight:normal;">${copy.heading}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0;font-size:16px;line-height:1.6;color:#5a3a2b;">
                <p style="margin:0 0 14px;">${copy.p1}</p>
                <p style="margin:0 0 22px;">${copy.p2}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 30px;">
                <a href="${SITE}" style="display:inline-block;background:#f06786;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;letter-spacing:.04em;text-decoration:none;padding:14px 26px;border-radius:999px;">${copy.cta}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 30px;border-top:1px solid #f3e6cd;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#8a6f60;">
                ${copy.place}<br />
                ${copy.why}
                <div style="padding:12px 0 0;">
                  <a href="${link}" style="display:inline-block;border:1px solid #f0c9d3;color:#d9496b;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.04em;text-decoration:none;padding:9px 20px;border-radius:999px;">${copy.unsubscribe}</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function unsubscribePage(lang, kind) {
  const text = UNSUB_PAGE[lang] || UNSUB_PAGE.en;
  const [heading, body] = text[kind] || text.missing;

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${heading} — Chill &amp; Cheer Station</title>
  </head>
  <body style="margin:0;background:#fff9e7;font-family:Georgia,'Times New Roman',serif;color:#462417;">
    <main style="max-width:520px;margin:0 auto;padding:64px 24px;">
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#d9496b;">Chill &amp; Cheer Station</p>
      <h1 style="margin:0 0 14px;font-size:30px;line-height:1.15;font-weight:normal;">${heading}</h1>
      <p style="margin:0 0 26px;font-size:16px;line-height:1.6;color:#5a3a2b;">${body}</p>
      <a href="${SITE}" style="display:inline-block;background:#f06786;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:13px 24px;border-radius:999px;">${text.back}</a>
    </main>
  </body>
</html>`;
}

/* ---------- signed unsubscribe links ---------- */

const encoder = new TextEncoder();

function b64url(bytes) {
  let raw = "";
  const view = new Uint8Array(bytes);
  for (let i = 0; i < view.length; i += 1) raw += String.fromCharCode(view[i]);
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(text) {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function sign(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

function tokenSecret(env) {
  return env.UNSUBSCRIBE_SECRET || env.BREVO_API_KEY || "";
}

async function unsubscribeToken(env, email, lang) {
  const secret = tokenSecret(env);
  if (!secret) return "";

  const payload = b64url(encoder.encode(JSON.stringify({ e: email, l: lang })));
  return payload + "." + b64url(await sign(secret, payload));
}

async function readUnsubscribeToken(env, token) {
  const secret = tokenSecret(env);
  if (!secret || !token) return null;

  const parts = String(token).split(".");
  if (parts.length !== 2) return null;

  const expected = b64url(await sign(secret, parts[0]));
  if (expected.length !== parts[1].length) return null;

  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ parts[1].charCodeAt(i);
  }
  if (diff !== 0) return null;

  try {
    const data = JSON.parse(new TextDecoder().decode(unb64url(parts[0])));
    const email = String((data && data.e) || "").toLowerCase();
    if (!EMAIL.test(email)) return null;
    return { email: email, lang: data.l === "fr" ? "fr" : "en" };
  } catch (error) {
    return null;
  }
}

/* ---------- Brevo ---------- */

/* 201 means Brevo created the contact; 204 means it already existed, and a
   returning subscriber should not get the welcome again */
async function addContact(env, email) {
  const body = { email: email, updateEnabled: true };
  const listId = Number(env.BREVO_LIST_ID);
  if (Number.isInteger(listId) && listId > 0) body.listIds = [listId];

  return fetch(BREVO_CONTACTS, {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

/* takes the address off the newsletter list rather than deleting the contact:
   the record (and its history) stays in Brevo, it just stops receiving */
async function removeFromList(env, email) {
  const listId = Number(env.BREVO_LIST_ID);
  const body =
    Number.isInteger(listId) && listId > 0
      ? { unlinkListIds: [listId] }
      : { emailBlacklisted: true };

  try {
    const response = await fetch(BREVO_CONTACTS + "/" + encodeURIComponent(email), {
      method: "PUT",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.ok || response.status === 204 ? "removed" : "failed";
  } catch (error) {
    return "failed";
  }
}

/* the contact is already saved by the time this runs: a mail problem must never
   turn a successful sign-up into an error on the page */
async function sendWelcome(env, email, lang) {
  const copy = WELCOME[lang] || WELCOME.en;
  const token = await unsubscribeToken(env, email, lang);
  const link = token ? UNSUBSCRIBE_URL + "?t=" + token : SITE;

  try {
    const response = await fetch(BREVO_EMAIL, {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Chill & Cheer Station", email: env.BREVO_SENDER || DEFAULT_SENDER },
        to: [{ email: email }],
        replyTo: {
          email: env.BREVO_REPLY_TO || DEFAULT_REPLY_TO,
          name: "Chill & Cheer Station",
        },
        subject: copy.subject,
        htmlContent: welcomeHtml(copy, lang === "fr" ? "fr" : "en", link),
        textContent: welcomeText(copy, link),
        headers: token
          ? {
              "List-Unsubscribe": "<" + link + ">",
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            }
          : undefined,
        tags: ["website-signup", "lang-" + (lang === "fr" ? "fr" : "en")],
      }),
    });

    return response.ok ? "sent" : "failed";
  } catch (error) {
    return "failed";
  }
}

/* ---------- routes ---------- */

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

function page(html, status) {
  return new Response(html, {
    status: status || 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
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

  const lang =
    String((payload && payload.lang) || "en").slice(0, 2).toLowerCase() === "fr" ? "fr" : "en";

  if (!env.BREVO_API_KEY) return json({ ok: false, error: "unconfigured" }, 503, headers);

  let response;
  try {
    response = await addContact(env, email);
  } catch (error) {
    return json({ ok: false, error: "network" }, 502, headers);
  }

  if (response.ok || response.status === 204) {
    const welcome = response.status === 201 ? await sendWelcome(env, email, lang) : "skipped";
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

async function unsubscribe(request, env, url) {
  /* GET is the button in the email; POST is Gmail's one-click, which sends
     "List-Unsubscribe=One-Click" without the reader having to open anything */
  if (request.method !== "GET" && request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { allow: "GET, POST" } });
  }

  const found = await readUnsubscribeToken(env, url.searchParams.get("t"));

  if (!found) return page(unsubscribePage("en", "missing"), 400);
  if (!env.BREVO_API_KEY) return page(unsubscribePage(found.lang, "failed"), 503);

  const state = await removeFromList(env, found.email);

  if (state === "removed") return page(unsubscribePage(found.lang, "removed"), 200);
  return page(unsubscribePage(found.lang, "failed"), 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/signup") return signup(request, env, url);
    if (url.pathname === "/api/unsubscribe") return unsubscribe(request, env, url);

    return env.ASSETS.fetch(request);
  },
};
