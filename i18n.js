/* ============================================================================
   LANGUAGE SWITCH — English (default) / French

   English lives in the HTML. This file carries the French, looked up by the
   English string itself, so adding copy to the page only means adding an entry
   here rather than threading ids through the markup. Inline markup survives
   because the swap happens text node by text node.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "cc-lang";
  var DEFAULT_LANG = "en";

  /* ---------- copy ---------- */
  var FR = {
    /* chrome */
    "Skip to content": "Aller au contenu",
    "Why Us": "Pourquoi nous",
    "Services": "Services",
    "Packages": "Forfaits",
    "Gallery": "Galerie",
    "Reviews": "Avis",
    "FAQ": "FAQ",
    "Contact": "Contact",
    "Book Your Bar": "Réserver votre bar",
    "Premium mobile bar": "Bar mobile haut de gamme",
    "Eastern Ontario & Western Quebec": "Est de l'Ontario et Ouest du Québec",
    "Eastern Ontario · Western Quebec": "Est de l'Ontario · Ouest du Québec",

    /* photo row */
    "Wedding show booth": "Kiosque de salon de mariage",
    "Market mornings": "Matins de marché",
    "Mango meets strawberry": "Mangue et fraise",
    "Two flavours on tap": "Deux saveurs au robinet",
    "Reception ready": "Prêt pour la réception",

    /* hero */
    "Bring": "Apportez",
    "the fun": "le plaisir",
    "Serve": "Servez",
    "the smile": "le sourire",

    /* why us */
    "Why Chill & Cheer": "Pourquoi Chill & Cheer",
    "Not just a drink station.": "Bien plus qu'un bar à boissons.",
    "A whole experience.": "Toute une expérience.",
    "A premium mobile slush bar experience for weddings, corporate events, festivals, and private parties — serving quality frozen drinks and mocktail favourites for all ages.":
      "Une expérience de bar à slush mobile haut de gamme pour les mariages, les événements d'entreprise, les festivals et les fêtes privées — des boissons glacées de qualité et des mocktails incontournables, pour tous les âges.",
    "View Packages": "Voir les forfaits",
    "Made with": "Fait avec",
    "real juice": "du vrai jus",
    "Favourite for all ages.": "Le favori de tous les âges.",
    "Real fruit juice. Never a powder mix.": "Du vrai jus de fruit. Jamais de poudre à mélanger.",
    "Zero-alcohol by default — spike it if you like.":
      "Sans alcool par défaut — à corser selon votre goût.",
    "Colour-matched to your palette or brand.":
      "Couleurs assorties à votre palette ou à votre marque.",

    /* occasions */
    "What we do": "Ce que nous faisons",
    "A bar for every occasion": "Un bar pour chaque occasion",
    "From black-tie weddings to high-energy festivals, we tailor every detail of your mobile slush bar to match the tone and style of your event.":
      "Des mariages en tenue de soirée aux festivals endiablés, nous adaptons chaque détail de votre bar à slush mobile au ton et au style de votre événement.",
    "Weddings": "Mariages",
    "A signature slush bar that becomes a centerpiece of your reception — elegant glassware, bespoke flavour pairings, and a team that blends seamlessly into your celebration.":
      "Un bar à slush signature qui devient la pièce maîtresse de votre réception — verrerie élégante, accords de saveurs sur mesure et une équipe qui se fond dans votre célébration.",
    "Corporate Events": "Événements d'entreprise",
    "Brand-activated slush bars for product launches, conferences, and team off-sites. Custom signage, branded menus, and a polished service team in uniform.":
      "Des bars à slush aux couleurs de votre marque pour les lancements de produits, conférences et sorties d'équipe. Signalétique personnalisée, menus à votre image et une équipe soignée en uniforme.",
    "Festivals": "Festivals",
    "High-volume slush stations built for crowds. Fast-pour taps, durable setups, and crowd-pleasing flavours that keep the energy flowing all day long.":
      "Des stations à slush à fort volume conçues pour la foule. Robinets rapides, installations robustes et saveurs rassembleuses qui gardent l'énergie toute la journée.",
    "Private Parties": "Fêtes privées",
    "Private party": "Fête privée",
    "Intimate gatherings deserve a touch of theatre. From garden parties to milestone birthdays, we bring a curated slush experience to your doorstep.":
      "Les réunions intimes méritent un brin de féerie. Des garden-parties aux anniversaires marquants, nous apportons une expérience de slush soignée jusqu'à votre porte.",

    /* packages */
    "Choose your experience": "Choisissez votre expérience",
    "Transparent pricing, fully inclusive. Every package is customizable — tell us about your event and we'll craft the perfect pour.":
      "Des prix transparents, tout inclus. Chaque forfait est personnalisable — parlez-nous de votre événement et nous créerons le service parfait.",
    "The Signature": "Le Signature",
    "Perfect for intimate gatherings": "Parfait pour les réunions intimes",
    "Starting at": "À partir de",
    "$575": "575 $",
    "+ tax": "+ taxes",
    "Ideal for up to 50 guests": "Idéal jusqu'à 50 invités",
    "Up to 2 hours of service": "Jusqu'à 2 heures de service",
    "2 signature slush flavours (10L each)": "2 saveurs de slush signature (10 L chacune)",
    "2 standard toppings": "2 garnitures standards",
    "Cups & straws": "Verres et pailles",
    "2 professional servers": "2 serveurs professionnels",
    "Setup and takedown included": "Installation et démontage inclus",
    "Enquire Now": "Demander une soumission",
    "Most booked": "Le plus réservé",
    "The Royal": "Le Royal",
    "Designed for elevated celebrations": "Pensé pour les célébrations d'exception",
    "$1,195": "1 195 $",
    "Ideal for up to 100 guests": "Idéal jusqu'à 100 invités",
    "Up to 4 hours of service": "Jusqu'à 4 heures de service",
    "2 signature slush flavours (15L each)": "2 saveurs de slush signature (15 L chacune)",
    "Martini-style premium glassware": "Verrerie haut de gamme style martini",
    "4 premium toppings": "4 garnitures haut de gamme",
    "Custom signage & styling": "Signalétique et stylisme personnalisés",
    "Welcome drink station setup": "Installation d'un poste de boisson d'accueil",
    "Add-Ons": "Extras",
    "Customize your experience": "Personnalisez votre expérience",
    "From": "À partir de",
    "$30": "30 $",
    "per item": "par item",
    "Extra service time — $100/hr (Signature) · $150/hr (Premium)":
      "Temps de service supplémentaire — 100 $/h (Signature) · 150 $/h (Premium)",
    "Additional guests — $5/guest, product & supplies included":
      "Invités supplémentaires — 5 $/invité, produit et fournitures inclus",
    "Premium candy topping — $30 each": "Garniture de bonbons haut de gamme — 30 $ chacune",

    /* collection */
    "Four finishes.": "Quatre finis.",
    "One good time.": "Un bon moment.",
    "A glimpse into the bars we've built. Every finish is dressed to match the room — pick one, or let us build something entirely yours.":
      "Un aperçu des bars que nous avons créés. Chaque fini est habillé pour la pièce — choisissez-en un, ou laissez-nous créer quelque chose rien que pour vous.",
    "Grass": "Gazon",
    "Rosé Gold": "Or rosé",
    "Black": "Noir",
    "Silver": "Argent",
    "Check availability": "Vérifier les disponibilités",
    "Bring the fun": "Apportez le plaisir",
    "Serve the smile": "Servez le sourire",
    "Real juice": "Vrai jus",
    "All ages": "Pour tous les âges",

    /* the four bars, as the switcher writes them */
    "01 — Living wall": "01 — Mur végétal",
    "02 — Mosaic shimmer": "02 — Mosaïque scintillante",
    "03 — Sequin noir": "03 — Sequins noirs",
    "04 — Mirror tile": "04 — Tuiles miroir",
    "The Grass Bar": "Le bar Gazon",
    "The Rosé Gold Bar": "Le bar Or rosé",
    "The Black Bar": "Le bar Noir",
    "The Silver Bar": "Le bar Argent",
    "A living-wall face with a soft-touch finish. Our signature look, and the one most guests photograph before they've had a single sip.":
      "Un mur végétal au fini velouté. Notre look signature, celui que la plupart des invités photographient avant même la première gorgée.",
    "A warm rose-gold mosaic that shifts with the light. Built for evening receptions and rooms that already glow.":
      "Une mosaïque or rosé chaleureuse qui joue avec la lumière. Pensé pour les réceptions en soirée et les salles qui brillent déjà.",
    "Sequin noir with brushed chrome trim. Understated, sharp, and a little bit rock and roll — a natural fit for brand launches.":
      "Sequins noirs et finition chrome brossé. Sobre, tranchant et un brin rock and roll — parfait pour les lancements de marque.",
    "Mirror-polished tile that catches every light in the room. Clean and modern, and endlessly photogenic in a crowd.":
      "Des tuiles polies miroir qui captent chaque lumière de la salle. Net et moderne, et photogénique à souhait dans la foule.",
    "Finish": "Fini",
    "Best for": "Idéal pour",
    "Lead time": "Délai",
    "Living grass": "Gazon végétal",
    "Gardens, weddings, daytime": "Jardins, mariages, jour",
    "3-6 months": "3 à 6 mois",
    "Rosé gold mosaic": "Mosaïque or rosé",
    "Evening receptions, galas": "Réceptions en soirée, galas",
    "Black sequin": "Sequins noirs",
    "Corporate, launches, after-dark": "Entreprises, lancements, soirées",
    "Mirror silver": "Argent miroir",
    "Festivals, studios, daytime": "Festivals, studios, jour",

    /* reviews */
    "Kind words": "Témoignages",
    "Loved by our clients": "Nos clients nous adorent",
    "The slush bar was the talk of our wedding. Every guest was mesmerised by the display, and the flavours were absolutely divine — it felt like a luxury cocktail bar with a playful twist.":
      "Le bar à slush a été le sujet de conversation de notre mariage. Tous les invités étaient fascinés par le montage, et les saveurs étaient divines — comme un bar à cocktails haut de gamme avec une touche ludique.",
    "Wedding · Ottawa": "Mariage · Ottawa",
    "We hired Chill & Cheer for our annual product launch and they completely elevated the event. The branded menu and the professionalism of the team exceeded every expectation.":
      "Nous avons fait appel à Chill & Cheer pour notre lancement de produit annuel et ils ont complètement rehaussé l'événement. Le menu à notre image et le professionnalisme de l'équipe ont dépassé toutes nos attentes.",
    "Brand Director, Cosmetics": "Directrice de marque, cosmétiques",
    "Our festival needed a bar that could handle hundreds of people without compromising on quality. The Royal package delivered flawlessly — fast pours, happy crowds, zero stress.":
      "Notre festival avait besoin d'un bar capable de servir des centaines de personnes sans compromis sur la qualité. Le forfait Royal a livré sans faute — service rapide, foule ravie, zéro stress.",
    "Festival Director": "Directrice de festival",
    "Hosted a milestone birthday in our garden and the slush bar transformed the whole evening. Elegant, fun, and the team was an absolute joy to work with. Already booked again.":
      "Nous avons organisé un anniversaire marquant dans notre jardin et le bar à slush a transformé toute la soirée. Élégant, amusant, et une équipe vraiment agréable. Déjà réservé de nouveau.",
    "Private Party": "Fête privée",

    /* event collective */
    "Good people, great events": "Belles personnes, beaux événements",
    "The Event Collective": "Le collectif Événement",
    "Great events are made even better together. Meet some of the talented local businesses and event professionals we love connecting with.":
      "Les beaux événements se créent encore mieux ensemble. Découvrez des entreprises locales talentueuses et des professionnels de l'événementiel avec qui nous aimons collaborer.",

    /* faq */
    "Questions, answered": "Vos questions",
    "Good to know": "Bon à savoir",
    "Still curious? Send us a note — we answer within 24 hours.":
      "Encore curieux? Écrivez-nous — nous répondons en 24 heures.",
    "Ask a question": "Poser une question",
    "How far in advance should I book?": "Combien de temps à l'avance dois-je réserver?",
    "We recommend booking 3-6 months in advance for weddings and peak-season events, though we do accommodate last-minute requests when our calendar allows. Get in touch and we'll do our best to make it work.":
      "Nous recommandons de réserver de 3 à 6 mois à l'avance pour les mariages et les événements de haute saison, mais nous acceptons les demandes de dernière minute lorsque notre calendrier le permet. Écrivez-nous et nous ferons tout notre possible.",
    "Do you offer both alcoholic and non-alcoholic options?":
      "Offrez-vous des options avec et sans alcool?",
    "Yes! We offer both alcoholic and non-alcoholic options. Alcohol can be added for an additional cost, which includes the required liquor licence and alcohol.":
      "Oui! Nous offrons des options avec et sans alcool. L'alcool peut être ajouté moyennant un supplément, qui comprend le permis d'alcool requis et l'alcool.",
    "Alternatively, you're welcome to provide your own liquor licence and alcohol. We're happy to mix drinks on-site or serve the alcohol on the side so guests can choose to add a splash to their drinks. This way, everyone can enjoy the experience, including kids and non-drinkers!":
      "Vous pouvez aussi fournir votre propre permis d'alcool et votre alcool. Nous mélangeons volontiers les boissons sur place ou servons l'alcool à part, pour que les invités puissent en ajouter un filet à leur verre. Ainsi, tout le monde profite de l'expérience, y compris les enfants et les personnes qui ne boivent pas!",
    "What areas do you cover?": "Quels secteurs couvrez-vous?",
    "We serve Eastern Ontario and Western Quebec — including Ottawa, Gatineau, Cornwall and the surrounding areas. We're also happy to travel — generally within about a 1-hour drive, and sometimes a bit further for special occasions.":
      "Nous desservons l'Est de l'Ontario et l'Ouest du Québec — dont Ottawa, Gatineau, Cornwall et les environs. Nous nous déplaçons aussi avec plaisir — généralement dans un rayon d'environ une heure de route, et parfois un peu plus loin pour les grandes occasions.",
    "How long does setup take?": "Combien de temps prend l'installation?",
    "A typical setup takes 60 minutes depending on the package. We arrive well before your guests and handle everything — delivery, assembly, styling, and cleanup at the end of the night.":
      "Une installation typique prend 60 minutes selon le forfait. Nous arrivons bien avant vos invités et nous nous occupons de tout — livraison, montage, stylisme et rangement à la fin de la soirée.",
    "Can you customize the bar to match our theme or brand?":
      "Pouvez-vous personnaliser le bar selon notre thème ou notre marque?",
    "Yes — this is where we shine. From custom signage and branded wraps to colour-matched garnishes and themed glassware, we tailor every visual detail to your event or brand identity.":
      "Oui — c'est notre force. De la signalétique personnalisée aux habillages à votre marque, en passant par les garnitures assorties et la verrerie thématique, nous adaptons chaque détail visuel à votre événement ou à votre identité de marque.",
    "What is included in the pricing?": "Qu'est-ce qui est inclus dans le prix?",
    "All of our packages are fully inclusive — delivery, setup, glassware, garnishes, toppings, and cleanup. No hidden fees. Add-ons like extra service time are optional and arranged in advance.":
      "Tous nos forfaits sont entièrement inclusifs — livraison, installation, verrerie, garnitures, accompagnements et rangement. Aucuns frais cachés. Les extras comme le temps de service supplémentaire sont facultatifs et planifiés à l'avance.",

    /* contact */
    "Get in touch": "Contactez-nous",
    "Let's plan": "Planifions",
    "your pour": "votre service",
    "Tell us about your event and we'll design a custom, tailored slush bar experience just for you.":
      "Parlez-nous de votre événement et nous concevrons une expérience de bar à slush sur mesure, rien que pour vous.",
    "Email": "Courriel",
    "Phone": "Téléphone",
    "Based in": "Basés dans",
    "Prefer to talk it through?": "Vous préférez en parler?",
    "Book a free 15-minute consultation and we'll walk you through every option.":
      "Réservez une consultation gratuite de 15 minutes et nous vous présenterons toutes les options.",
    "Full name": "Nom complet",
    "Event type": "Type d'événement",
    "Wedding": "Mariage",
    "Corporate event": "Événement d'entreprise",
    "Something else": "Autre",
    "Event date": "Date de l'événement",
    "Time": "Heure",
    "Location": "Lieu",
    "Guests": "Invités",
    "Tell us about your event": "Parlez-nous de votre événement",
    "Send Enquiry": "Envoyer la demande",
    "We reply within 24 hours. No spam, ever.": "Nous répondons en 24 heures. Aucun pourriel, jamais.",
    "Please add your name and a valid email address.":
      "Veuillez indiquer votre nom et une adresse courriel valide.",
    "Opening your email app… if nothing happens, write to chillandcheerstation@gmail.com.":
      "Ouverture de votre application courriel… si rien ne se passe, écrivez à chillandcheerstation@gmail.com.",

    /* newsletter popup */
    "Join the list": "Rejoignez la liste",
    "Sign up for news and special offers":
      "Inscrivez-vous pour recevoir nos nouvelles et nos offres spéciales",
    "New flavours, seasonal specials and first dibs on dates — straight to your inbox.":
      "Nouvelles saveurs, offres saisonnières et priorité sur les réservations — directement dans votre boîte de réception.",
    "Email address": "Adresse courriel",
    "Sign me up": "Je m'inscris",
    "No spam, ever. Unsubscribe anytime.":
      "Aucun pourriel, jamais. Désabonnement en tout temps.",
    "Please enter a valid email address.": "Veuillez entrer une adresse courriel valide.",
    "Thanks! Your email app is opening — press send to join the list.":
      "Merci! Votre application courriel s'ouvre — appuyez sur envoyer pour vous joindre à la liste.",
    "Adding you to the list…": "Ajout à la liste…",
    "Thank you for signing up.": "Merci de votre inscription.",
    "One moment…": "Un instant…",
    "We're taking you off the list.": "Nous vous retirons de la liste.",
    "You're off the list": "Vous êtes désabonné",
    "We've removed you from the Chill & Cheer newsletter. Sorry to see you go — the sign-up form is always on the site if you change your mind.":
      "Nous vous avons retiré de l'infolettre Chill & Cheer. Si vous changez d'avis, le formulaire d'inscription reste sur le site.",
    "That didn't go through": "L'opération n'a pas abouti",
    "We couldn't remove you just now. Please try again in a moment, or reply to the welcome email and we'll do it by hand.":
      "Nous n'avons pas pu vous retirer à l'instant. Réessayez dans un moment, ou répondez au courriel de bienvenue et nous nous en occuperons manuellement.",
    "This link is incomplete": "Ce lien est incomplet",
    "The unsubscribe link is missing something. Reply to the welcome email and we'll take you off the list by hand.":
      "Il manque un élément au lien de désabonnement. Répondez au courriel de bienvenue et nous vous retirerons de la liste manuellement.",
    "Back to the site": "Retour au site",
    "Close": "Fermer",

    /* footer */
    "Bring the fun, serve the smile.": "Apportez le plaisir, servez le sourire.",
    "A mobile slush bar for the moments you'll keep.":
      "Un bar à slush mobile pour les moments inoubliables.",
    "Explore": "Explorer",
    "Events": "Événements",
    "Company": "Entreprise",
    "Corporate": "Entreprises",
    "Email us": "Écrivez-nous",
    "Chill & Cheer Station. All rights reserved.": "Chill & Cheer Station. Tous droits réservés.",

    /* attributes: alt text */
    "The full Chill & Cheer booth with hedge front, slush machine and a shelf of glasses at a wedding show":
      "Le kiosque Chill & Cheer complet avec façade de haie, machine à slush et étagère de verres lors d'un salon de mariage",
    "The Chill & Cheer slush bar set up under a farm market shelter while a customer is served":
      "Le bar à slush Chill & Cheer installé sous un abri de marché fermier pendant qu'un client est servi",
    "A layered mango and strawberry slush in a Chill & Cheer cup, topped with fruit and a gummy":
      "Un slush mangue et fraise en couches dans un verre Chill & Cheer, garni de fruits et d'une gomme",
    "Close-up of the twin-bowl slush machine with mango and strawberry flavours ready to pour":
      "Gros plan de la machine à slush à deux bacs, saveurs mangue et fraise prêtes à servir",
    "A Chill & Cheer attendant standing beside the black sequin bar at an indoor reception":
      "Une préposée Chill & Cheer debout à côté du bar à sequins noirs lors d'une réception à l'intérieur",
    "The Chill & Cheer mobile slush bar in a grass finish, with a twin-bowl slush machine on a marble counter":
      "Le bar à slush mobile Chill & Cheer en fini gazon, avec une machine à slush à deux bacs sur un comptoir de marbre",
    "Chill & Cheer slush bar with a real-juice menu card":
      "Bar à slush Chill & Cheer avec une carte de menu au vrai jus",
    "Rosé gold Chill & Cheer bar for weddings": "Bar Chill & Cheer or rosé pour les mariages",
    "Black sequin Chill & Cheer bar for corporate events":
      "Bar Chill & Cheer à sequins noirs pour les événements d'entreprise",
    "Silver mirrored Chill & Cheer bar for festivals":
      "Bar Chill & Cheer argent miroir pour les festivals",
    "Grass Chill & Cheer bar for private parties": "Bar Chill & Cheer gazon pour les fêtes privées",
    "The Grass Bar in a living-wall grass finish": "Le bar Gazon en fini mur végétal",
    "The Rosé Gold Bar with a rose-gold mosaic panel": "Le bar Or rosé avec un panneau de mosaïque or rosé",
    "The Black Bar with a black sequin panel": "Le bar Noir avec un panneau de sequins noirs",
    "The Silver Bar with a mirrored silver panel": "Le bar Argent avec un panneau argent miroir",
    "Tomoni, Ottawa charcuterie and catering": "Tomoni, charcuterie et traiteur à Ottawa",
    "Modü Magnets, custom photo magnets": "Modü Magnets, aimants photo personnalisés",

    /* attributes: labels and hints */
    "Chill and Cheer — home": "Chill and Cheer — accueil",
    "Primary": "Navigation principale",
    "Open menu": "Ouvrir le menu",
    "Bar finishes": "Finis du bar",
    "Client reviews": "Avis des clients",
    "Rated five out of five": "Noté cinq sur cinq",
    "Previous review": "Avis précédent",
    "Next review": "Avis suivant",
    "Review 1 of 4": "Avis 1 sur 4",
    "Review 2 of 4": "Avis 2 sur 4",
    "Review 3 of 4": "Avis 3 sur 4",
    "Review 4 of 4": "Avis 4 sur 4",
    "Jane Doe": "Jeanne Tremblay",
    "jane@email.com": "jeanne@courriel.com",
    "07123 456789": "819 555 1234",
    "e.g. 1PM – 3PM": "p. ex. 13 h – 15 h",
    "Venue or city": "Salle ou ville",
    "Venue, theme, any special requests...": "Salle, thème, demandes particulières...",
    "Language": "Langue",
    "Switch the site between English and French": "Basculer le site entre l'anglais et le français",
  };

  var HEAD = {
    en: {
      title: "Chill & Cheer — Premium Mobile Slush Bar",
      description:
        "A premium mobile slush bar experience for weddings, corporate events, festivals and private parties. Real juice, fully branded, serving Eastern Ontario and Western Quebec.",
    },
    fr: {
      title: "Chill & Cheer — Bar à slush mobile haut de gamme",
      description:
        "Une expérience de bar à slush mobile haut de gamme pour les mariages, événements d'entreprise, festivals et fêtes privées. Vrai jus, entièrement personnalisé, dans l'Est de l'Ontario et l'Ouest du Québec.",
    },
  };

  /* ---------- matching ----------
     Keys are matched on a normalised copy of the text: curly quotes and dashes
     folded to plain ones, non-breaking spaces flattened, runs of whitespace
     collapsed. That way the dictionary is readable and the markup can use
     whatever punctuation it likes. */
  function normalise(value) {
    return String(value)
      .replace(/[\u00a0\u2007\u2009\u202f]/g, " ")
      .replace(/[\u2018\u2019\u02bc]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  var frByKey = Object.create(null);
  Object.keys(FR).forEach(function (key) {
    frByKey[normalise(key)] = FR[key];
  });

  var lang = DEFAULT_LANG;
  var textOrigins = new WeakMap();
  var attrOrigins = new WeakMap();
  var ATTRIBUTES = ["alt", "aria-label", "placeholder", "title", "content"];

  function applyAttributes(root) {
    var nodes = root.querySelectorAll("[alt], [aria-label], [placeholder], [title]");
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.closest("[data-i18n-skip]")) return;

      ATTRIBUTES.forEach(function (attr) {
        var current = el.getAttribute(attr);
        if (!current) return;

        var store = attrOrigins.get(el) || {};
        if (!(attr in store)) store[attr] = current;
        attrOrigins.set(el, store);

        var english = store[attr];
        var key = normalise(english);
        el.setAttribute(attr, lang === "fr" && frByKey[key] ? frByKey[key] : english);
      });
    });
  }

  function applyText(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, [data-i18n-skip]")) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(function (textNode) {
      if (!textOrigins.has(textNode)) textOrigins.set(textNode, textNode.nodeValue);

      var english = textOrigins.get(textNode);
      var lead = english.match(/^\s*/)[0];
      var trail = english.match(/\s*$/)[0];
      var core = english.slice(lead.length, english.length - trail.length);

      var key = normalise(core);
      var spoken = lang === "fr" && frByKey[key] ? frByKey[key] : core;
      textNode.nodeValue = lead + spoken + trail;
    });
  }

  function applyLang() {
    document.documentElement.lang = lang;
    applyText(document.body);
    applyAttributes(document.body);

    var head = HEAD[lang] || HEAD.en;
    document.title = head.title;
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", head.description);

    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (button) {
      var active = button.getAttribute("data-lang") === lang;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("is-active", active);
    });
  }

  function t(english) {
    if (lang !== "fr" || !english) return english;
    return frByKey[normalise(english)] || english;
  }

  function setLang(next, remember) {
    var value = next === "fr" ? "fr" : "en";
    if (value === lang) return;
    lang = value;

    if (remember !== false) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (error) {
        /* private mode — the choice just won't outlive the visit */
      }
    }

    applyLang();
    document.dispatchEvent(new CustomEvent("cc:lang", { detail: { lang: lang } }));
  }

  function storedLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved === "fr" || saved === "en" ? saved : DEFAULT_LANG;
    } catch (error) {
      return DEFAULT_LANG;
    }
  }

  /* ---------- wire up ---------- */
  function init() {
    var buttons = document.querySelectorAll("[data-lang]");
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener("click", function () {
        setLang(button.getAttribute("data-lang"));
      });
    });

    var saved = storedLang();
    if (saved !== lang) {
      lang = saved;
      applyLang();
    } else {
      applyLang();
    }
  }

  window.CC_I18N = {
    get lang() {
      return lang;
    },
    set: setLang,
    t: t,
    apply: applyLang,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
