/* ============================================================================
   Worker entry for the static site.

   Everything is served from the built assets except /api/signup, which takes
   the newsletter form and files the address with Brevo. The API key lives in
   the site's secrets (BREVO_API_KEY) and never reaches the browser.

   The custom domain serves assets only, so the form on that domain posts here
   from the browser: both site origins are allowed, and nothing else is.
   ========================================================================== */

const BREVO_CONTACTS = "https://api.brevo.com/v3/contacts";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SITE_ORIGINS = [
  "https://chillandcheerstation.com",
  "https://www.chillandcheerstation.com",
];

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

  if (response.ok || response.status === 204) return json({ ok: true }, 200, headers);

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
