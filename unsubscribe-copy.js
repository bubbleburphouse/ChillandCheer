/* ============================================================================
   UNSUBSCRIBE COPY — the one set of strings

   Three places show this wording and all of them read it from here:

     · the button in the welcome email
     · the confirmation the site shows when that button is followed
       (unsubscribe-page.js)
     · the plain page the Worker serves if the link is opened without
       JavaScript (deploy/worker.js, which imports this same module)

   Each state is [heading, body]. `waiting` is what the page shows while the
   request is still in flight; `missing` covers a link with no usable token.
   ========================================================================== */

export const UNSUB_COPY = {
  en: {
    button: "Unsubscribe",
    waiting: ["One moment…", "We're taking you off the list."],
    removed: [
      "You're off the list",
      "We've removed you from the Chill & Cheer newsletter. Sorry to see you go — the sign-up form is always on the site if you change your mind.",
    ],
    missing: [
      "This link is incomplete",
      "The unsubscribe link is missing something. Reply to the welcome email and we'll take you off the list by hand.",
    ],
    failed: [
      "That didn't go through",
      "We couldn't remove you just now. Please try again in a moment, or reply to the welcome email and we'll do it by hand.",
    ],
    back: "Back to the site",
  },
  fr: {
    button: "Se désabonner",
    waiting: ["Un instant…", "Nous vous retirons de la liste."],
    removed: [
      "Vous êtes désabonné",
      "Nous vous avons retiré de l'infolettre Chill & Cheer. Si vous changez d'avis, le formulaire d'inscription reste sur le site.",
    ],
    missing: [
      "Ce lien est incomplet",
      "Il manque un élément au lien de désabonnement. Répondez au courriel de bienvenue et nous vous retirerons de la liste manuellement.",
    ],
    failed: [
      "L'opération n'a pas abouti",
      "Nous n'avons pas pu vous retirer à l'instant. Réessayez dans un moment, ou répondez au courriel de bienvenue et nous nous en occuperons manuellement.",
    ],
    back: "Retour au site",
  },
};

export function unsubCopy(lang) {
  return UNSUB_COPY[lang === "fr" ? "fr" : "en"];
}
