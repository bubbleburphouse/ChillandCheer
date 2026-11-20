/* ============================================================================
   Worker entry for the static site.

   Everything is served from the built assets except /api/signup, which takes
   the newsletter form and files the address with Brevo. The API key lives in
   the site's secrets (BREVO_API_KEY) and never reaches the browser.
   ========================================================================== */

const BREVO_CONTACTS = "https://api.brevo.com/v3/contacts";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function signup(request, env, url) {
  if (request.method !== "POST") return json({ ok: false, error: "method" }, 405);

  /* the form only ever calls this from the site itself */
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) return json({ ok: false, error: "origin" }, 403);

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return json({ ok: false, error: "body" }, 400);
  }

  const email = String((payload && payload.email) || "")
    .trim()
    .toLowerCase();

  if (!EMAIL.test(email) || email.length > 254) return json({ ok: false, error: "email" }, 400);

  const key = env.BREVO_API_KEY;
  if (!key) return json({ ok: false, error: "unconfigured" }, 503);

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
    return json({ ok: false, error: "network" }, 502);
  }

  if (response.ok || response.status === 204) return json({ ok: true });

  let message = "";
  try {
    message = (await response.json()).message || "";
  } catch (error) {
    /* Brevo answered with something that isn't JSON */
  }

  return json(
    { ok: false, error: "brevo", status: response.status, message: message },
    502
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/signup") return signup(request, env, url);

    return env.ASSETS.fetch(request);
  },
};
