/* ============================================================================
   UNSUBSCRIBE LINK LANDING — ?unsubscribe=<token>

   The link in the welcome email points at this site, so the address a reader
   sees is the site's own; this module does the work behind it and shows the
   confirmation. Every word it prints comes from unsubscribe-copy.js, the same
   file the email and the Worker's no-JavaScript page are worded from.

   Loaded as a module after i18n.js and main.js, so the dictionary and the
   language on screen are already settled by the time this runs.
   ========================================================================== */
import { unsubCopy } from "./unsubscribe-copy.js?v=1";

const view = document.getElementById("unsub");
const params = new URLSearchParams(window.location.search);
const token = params.get("unsubscribe");
const i18n = window.CC_I18N || { lang: "en", t: (value) => value, set() {} };

if (view && token) {
  const title = document.getElementById("unsubTitle");
  const body = document.getElementById("unsubBody");
  const back = document.getElementById("unsubBack");

  /* the custom domain serves assets only, so its form posts to the Worker */
  const api = /(^|\.)chillandcheerstation\.com$/.test(window.location.hostname)
    ? "https://site-806e683dd94e4381a422409af0323082.freebuff.page/api/unsubscribe"
    : "/api/unsubscribe";

  const say = (lang, state) => {
    const copy = unsubCopy(lang);
    const [heading, message] = copy[state] || copy.missing;
    title.textContent = heading;
    body.textContent = message;
    back.textContent = copy.back;
    view.className = `unsub is-${state}`;
  };

  /* the token carries the language the reader signed up in, so a French
     subscriber gets the French confirmation wherever the site happens to be */
  let lang = params.get("l") === "fr" ? "fr" : "en";
  if (lang === "fr") i18n.set("fr", false);

  document.documentElement.classList.add("is-unsub");
  view.hidden = false;
  say(lang, "waiting");

  fetch(`${api}?format=json`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ t: token, l: lang }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result && result.lang === "fr" && lang !== "fr") {
        lang = "fr";
        i18n.set("fr", false);
      }
      if (result && result.state === "removed") say(lang, "removed");
      else if (result && result.state === "missing") say(lang, "missing");
      else say(lang, "failed");
    })
    .catch(() => say(lang, "failed"));
}
