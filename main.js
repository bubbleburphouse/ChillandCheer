/* ==========================================================================
   Chill & Cheer — interactions
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- smooth scrolling ----------
     Wheel and trackpad input is eased towards a target instead of landing on
     the page frame by frame, so the page glides and everything scroll-linked
     with it moves slower and softer. Touch, keyboard, the scrollbar, anchor
     jumps and reduced-motion visitors keep native scrolling. */
  const easeScroll =
    !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- section anchors ----------
     One definition of the spot each section comes to rest at, shared by the
     nav links and by scrolling, so the two never disagree about where a
     section belongs. A section shorter than the screen is centred with the
     header's height taken off the top; a taller one starts just below the
     header. Section 3 only reads as finished at the end of its held stretch,
     where the whole row is complete. */
  const headerClearance = () => {
    const head = document.getElementById("siteHeader");
    return (head ? head.getBoundingClientRect().height : 84) + 22;
  };

  const sectionAnchor = (section) => {
    const vh = window.innerHeight;
    const scroll = window.scrollY;
    const rect = section.getBoundingClientRect();
    const frame = section.querySelector(".occasions__frame");
    const pin = section.querySelector(".occasions__pin");

    if (frame && pin && getComputedStyle(frame).position === "sticky") {
      return rect.top + scroll + pin.getBoundingClientRect().height - vh;
    }

    // otherwise a section starts here: its own top padding is the air under the
    // header, so the content lands the same distance below the header on every
    // screen rather than being centred, which on a tall display leaves a band
    // of the previous section showing above it
    const style = getComputedStyle(section);
    const padTop = parseFloat(style.paddingTop) || 0;
    const start = rect.top + scroll + padTop - headerClearance();

    // packages is the one section taller than a laptop screen. resting at its
    // top can leave the cards' buttons just under the fold, so when they don't
    // fit there the heading is allowed to scroll past and the card row becomes
    // the frame instead — a title above the screen reads better than a title
    // sliced in half by the header. the cards only stand in one row from 900px
    // up; stacked, the last card is a whole screen below the first, so the
    // section keeps its normal start there.
    if (section.id === "packages" && window.matchMedia("(min-width: 900px)").matches) {
      const head = section.querySelector(".section-head");
      const card = section.querySelector(".package");
      // the button row's own bottom, read off the section's layout so a card
      // still carrying its reveal offset cannot move the answer
      const rowBottom = rect.bottom + scroll - (parseFloat(style.paddingBottom) || 0);
      const buttonRow = card
        ? rowBottom - (parseFloat(getComputedStyle(card).paddingBottom) || 0)
        : rowBottom;

      if (buttonRow <= start + vh || !head) return start;
      return head.getBoundingClientRect().bottom + scroll - (headerClearance() - 22);
    }

    return start;
  };

  // set by the eased-scroll block below, so a nav click travels the same way a
  // gesture does; touch and reduced-motion visitors fall back to native smooth
  let jumpTo = null;

  if (easeScroll) {
    const EASE = 0.085; // per 60 fps frame: lower = longer glide
    const STEP_MS = 1000 / 60;

    const IDLE_MS = 130; // a gesture is over once the wheel has been quiet this long
    // how far a gesture may end from a section and still be finished onto it:
    // generous when the section is still ahead (a flick that stops just short),
    // short when it has just been passed, so reading further down a long section
    // is never dragged back up to its start
    const APPROACH = 300;
    const OVERSHOOT = 280;

    let target = window.scrollY;
    let current = target;
    let gliding = false;
    let running = false;
    let last = 0;
    let idle = 0;
    let gestureStart = -1; // where the gesture began
    let restingPlace = []; // the y each section wants the page to come to rest at

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    // the stylesheet opts the page into smooth anchor scrolling, which would
    // make every programmatic step animate on its own and fight this loop
    const jump = (y) => {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      root.style.scrollBehavior = previous;
    };

    const glide = (now) => {
      const dt = last ? Math.min(64, Math.max(8, now - last)) : STEP_MS;
      last = now;

      const distance = target - current;
      if (Math.abs(distance) < 0.4) {
        current = target;
        jump(current);
        gliding = false;
        running = false;
        last = 0;
        return;
      }

      // frame-rate independent easing: the glide feels the same on a 120 Hz
      // panel as it does on a 60 Hz one
      const t = 1 - Math.pow(1 - EASE, dt / STEP_MS);
      current += distance * t;
      jump(current);
      requestAnimationFrame(glide);
    };

    // one loop only: retargeting a running glide must never start a second one
    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      requestAnimationFrame(glide);
    };

    // a nav click is a gesture towards a section anchor, so it glides the same
    // way and settles on the same spot as a scroll would
    jumpTo = (y) => {
      clearTimeout(idle);
      current = window.scrollY;
      target = Math.min(maxScroll(), Math.max(0, y));
      gliding = true;
      gestureStart = -1;
      start();
    };

    /* ---------- resting places ----------
       Each section has one position where it looks finished: its own content
       centred while it is shorter than the screen, or its top just under the
       header while it is taller. Section 3 is the exception — it holds itself
       still while the bar runs its three beats, so its only finished frame is
       the end of that hold, where the whole row is complete. A gesture that
       ends near one of these is drawn onto it, so scrolling never leaves a
       section half arrived with its heading under the header. */
    const collectRestingPlaces = () => {
      const max = maxScroll();
      const places = [0]; // the hero is its own opening frame

      document.querySelectorAll("main > section").forEach((section, index) => {
        if (index === 0) return;
        places.push(sectionAnchor(section));
      });

      // the foot of the page as well, so the footer is never left cut off
      places.push(max);

      restingPlace = Array.from(
        new Set(places.map((p) => Math.round(Math.min(max, Math.max(0, p)))))
      ).sort((a, b) => a - b);
    };

    const settleOnSection = () => {
      const base = gliding ? target : window.scrollY;
      const down = base >= gestureStart;
      // a real flick may be finished back onto the section it just overshot; a
      // small scroll is never dragged back, so reading further down a long
      // section is left where it was put
      const overshoot = Math.abs(base - gestureStart) > 300 ? OVERSHOOT : 120;
      let best = null;
      let gap = Infinity;

      for (const place of restingPlace) {
        const past = down ? place < base : place > base;
        const reach = past ? overshoot : APPROACH;

        // the section the gesture started from never pulls the page back: a
        // small scroll away from a section moves it, instead of springing home
        // the moment the fingers stop
        if (Math.abs(place - gestureStart) < 6) continue;

        const distance = Math.abs(place - base);
        if (distance < gap && distance <= reach) {
          gap = distance;
          best = place;
        }
      }

      if (best === null || gap < 2) return;

      if (!gliding) {
        current = window.scrollY;
        gliding = true;
      }
      target = best;
      start();
    };

    const armSettle = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        // read per gesture: an opened FAQ answer or a resized window moves every
        // resting place below it
        collectRestingPlaces();
        settleOnSection();
      }, IDLE_MS);
    };

    window.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;
        if (e.target instanceof Element && e.target.closest("textarea, [data-native-scroll]"))
          return;

        let delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 18;
        else if (e.deltaMode === 2) delta *= window.innerHeight;
        if (!delta) return;

        e.preventDefault();

        // taking over mid-jump: the anchor the page was heading for is a fine
        // place to measure the gesture from
        if (gestureStart < 0) gestureStart = window.scrollY;

        if (!gliding) {
          current = window.scrollY;
          target = current;
          gliding = true;
          gestureStart = current;
        }

        target = Math.min(maxScroll(), Math.max(0, target + delta));

        // a fast flick banks at most a screen of travel, so one hard gesture
        // never sends the page flying
        const lead = target - current;
        const limit = window.innerHeight * 1.1;
        if (lead > limit) target = current + limit;
        else if (lead < -limit) target = current - limit;

        start();
        armSettle();
      },
      { passive: false }
    );

    window.addEventListener(
      "scroll",
      () => {
        if (!gliding) {
          target = current = window.scrollY;
          return;
        }
        // the page moved by something other than this loop (keyboard, scrollbar,
        // anchor jump, browser restore): adopt that position instead of fighting it
        if (Math.abs(window.scrollY - current) > 2) {
          current = window.scrollY;
          target = current;
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      target = Math.min(target, maxScroll());
      if (!gliding) target = current = window.scrollY;
    });
  }

  /* ---------- in-page links ----------
     A nav link travels to the section's anchor — the same spot a scroll comes
     to rest on — rather than the raw top of the element, where the fixed
     header would sit over the heading. */
  document.addEventListener("click", (e) => {
    const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!link || e.defaultPrevented) return;

    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    let target = null;
    try {
      target = document.querySelector(id);
    } catch (error) {
      return;
    }
    if (!target || !target.matches("main > section")) return;

    e.preventDefault();

    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const first = document.querySelector("main > section");
    const y = Math.max(0, Math.min(max, target === first ? 0 : sectionAnchor(target)));

    if (jumpTo) jumpTo(y);
    else window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });

    if (history.pushState) history.pushState(null, "", id);
  });

  /* ---------- header ---------- */
  const header = document.getElementById("siteHeader");

  /* ---------- mobile nav ---------- */
  const nav = document.getElementById("primaryNav");
  const navToggle = document.getElementById("navToggle");

  const setNav = (open) => {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  navToggle.addEventListener("click", () => {
    setNav(navToggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setNav(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) setNav(false);
  });

  /* ---------- reveal on scroll ---------- */
  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- scroll-driven motion ----------
     One scroll listener, one rAF, and layout positions cached on resize, so a
     scroll frame never reads the DOM after writing to it (the old loop read a
     rect and wrote a transform six times per frame, plus the travelling bar). */
  const layers = Array.from(document.querySelectorAll("[data-parallax]"));
  const heroProduct = document.querySelector(".poster__product");
  const juiceProduct = document.querySelector(".juice__product");
  const heroBarImg = document.querySelector(".poster__product img");
  const juiceBarImg = document.querySelector(".juice__product img");
  const barTravel = document.getElementById("barTravel");
  // where the bar comes to rest in the occasions group: the grass finish is the
  // last of the four, so the bar drops straight into that slot
  const occasionsHead = document.querySelector(".occasions .section-head");
  const dockImg = document.querySelector('.occasion__stage[data-finish="grass"] img');
  const dockStage = dockImg ? dockImg.closest(".occasion__stage") : null;
  const occasionRow = document.querySelector(".occasion-grid");
  const occasionsPin = document.querySelector(".occasions__pin");
  const occasionsFrame = document.querySelector(".occasions__frame");
  // the finishes in order — rosé pink first, the grass finish last — paired with
  // the copy column that belongs to each. On desktop the grass slot's own
  // artwork stays hidden and the travelling bar is what lands in it; everywhere
  // else it drops in like the rest.
  const stageEls = Array.from(document.querySelectorAll(".occasion__stage"));
  const columns = Array.from(document.querySelectorAll(".occasion")).map((card, i) => {
    const stage = stageEls[i] || null;
    return {
      stage,
      img: stage ? stage.querySelector("img") : null,
      copy: Array.from(card.querySelectorAll(".occasion__title, .occasion__text")),
    };
  });

  const BASE_W = 400;
  const FOLLOW = 0.24; // per 60 fps frame: how quickly the layers chase the scroll
  const SNAP = 0.35; // px at which they lock back onto the real scroll position

  const clamp01 = (t) => Math.min(1, Math.max(0, t));
  // a quintic in-out: the longest, softest tails of the classic easing curves,
  // so the bar eases away from rest and settles into the slot without a bump
  const easeInOut = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  // the same shape with a lower peak speed: for the width change and anything
  // else where a steeper curve would read as a lurch rather than a glide
  const easeSoft = (t) => t * t * (3 - 2 * t);

  // a trapezoid: a short ramp up, a steady drift, a short ramp down. Its middle
  // speed is only a little above the page's own, which is what stops the long
  // fall from reading as a lunge the way a strongly eased curve does.
  const RAMP = 0.22;
  function easeDrift(t) {
    const v = 1 / (1 - RAMP);
    if (t < RAMP) return (v * t * t) / (2 * RAMP);
    if (t > 1 - RAMP) {
      const back = 1 - t;
      return 1 - (v * back * back) / (2 * RAMP);
    }
    return v * (RAMP / 2 + (t - RAMP));
  }
  // how the pinned stretch is spent, as fractions of it: a beat where the bar
  // sits on the centre line, then the travel out to the last slot
  const PIN_BUFFER = 0.14;
  const PIN_GLIDE = 0.74;

  const round = (n) => Math.round(n * 10) / 10;

  // The row is complete the moment it comes into view: every finish already
  // stands in its slot with the copy beneath it, so a visitor never meets a
  // four-column grid with three empty stages waiting their turn. Nothing slides
  // in behind the travelling bar. The one bar the scroll does deliver is the
  // one the travelling bar lands in — its own artwork stays hidden until then,
  // otherwise a second copy of it would sit there while another flew down.
  function showFinishes() {
    for (const col of columns) {
      if (col.img) {
        if (col.img.style.translate) col.img.style.translate = "";
        if (col.img.style.opacity) col.img.style.opacity = "";
      }
      for (const el of col.copy) {
        if (el.style.translate) el.style.translate = "";
        if (el.style.opacity) el.style.opacity = "";
      }
    }
  }

  const items = layers.map((el) => ({
    el,
    ref: el.parentElement || el,
    speed: parseFloat(el.dataset.parallax) || 0,
    isLine: el.classList.contains("poster__line"),
    isHero: el === heroProduct,
    isJuice: el === juiceProduct,
    top: 0,
    height: 0,
  }));

  const travelBar = Boolean(barTravel && heroBarImg && juiceBarImg);
  // the bar is only carried between the hero and section 2 where there is a wide
  // lane for it: on a phone the flight has to come down the middle of the page,
  // which puts it straight through the posters' own type, so each section keeps
  // its own bar there and nothing is ever crossed
  const travelWide = () => window.matchMedia("(min-width: 1024px)").matches;
  let animateTravel = false;

  let eased = window.scrollY;
  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let frameId = 0;
  let lastFrame = 0;
  let resizeId = 0;
  let headerScrolled = null;
  let narrow = window.innerWidth < 1024;
  let geo = null;
  let layoutW = 0;
  let layoutH = 0;

  function measure() {
    narrow = window.innerWidth < 1024;
    animateTravel = travelBar && travelWide();
    if (travelBar) {
      document.documentElement.classList.toggle("has-travel-bar", animateTravel);
      if (animateTravel) barTravel.style.width = BASE_W + "px";
    }
    geo = null;

    // whether the section pins has to be read before the frame is un-stuck below
    const pinned = occasionsFrame
      ? getComputedStyle(occasionsFrame).position === "sticky"
      : false;

    // read every position with the decorations neutralised, once per layout change.
    // reveal-in elements carry a 28px offset until they animate in, so they have to
    // be measured flat too or the dock point is off by that amount
    const previous = items.map((it) => it.el.style.transform);
    items.forEach((it) => {
      it.el.style.transform = "none";
    });

    const revealImgs = columns.map((col) => col.img).filter(Boolean);
    const previousReveal = revealImgs.map((img) => img.style.translate);
    revealImgs.forEach((img) => {
      img.style.translate = "none";
    });

    // the pinned frame is measured unpinned: while it sticks, its top is pinned to
    // the viewport, so its rect no longer says where the section really sits
    const previousFramePos = occasionsFrame ? occasionsFrame.style.position : "";
    if (occasionsFrame) occasionsFrame.style.position = "static";


    const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
    const revealTransforms = reveals.map((el) => el.style.transform);
    reveals.forEach((el) => {
      el.style.transform = "none";
    });

    const scroll = window.scrollY;

    items.forEach((it) => {
      const rect = it.ref.getBoundingClientRect();
      it.top = rect.top + scroll;
      it.height = rect.height;
    });

    if (animateTravel) {
      const from = heroBarImg.getBoundingClientRect();
      const to = juiceBarImg.getBoundingClientRect();
      geo = {
        from: { top: from.top + scroll, left: from.left, width: from.width },
        to: { top: to.top + scroll, left: to.left, width: to.width },
        occ: null,
        row: null,
        head: null,
        pin: null,
        ratio: 1.44,
      };

      // the shrink into the occasions row only has room to read on desktop;
      // below that the bar hands off into section 2 as before
      const wideEnough = window.matchMedia("(min-width: 1024px)").matches;

      if (dockImg && wideEnough) {
        const dock = dockImg.getBoundingClientRect();
        // the card may still carry its reveal offset (or be mid-transition),
        // so subtract its own transform to cache the settled position
        let shiftX = 0;
        let shiftY = 0;
        if (dockStage) {
          const t = getComputedStyle(dockStage).transform;
          if (t && t !== "none" && typeof DOMMatrixReadOnly === "function") {
            const m = new DOMMatrixReadOnly(t);
            shiftX = m.m41;
            shiftY = m.m42;
          }
        }
        geo.occ = {
          top: dock.top + scroll - shiftY,
          left: dock.left - shiftX,
          width: dock.width,
        };
      }

      // the pinned stretch: where it starts, how long it is, and where the dock
      // sits on screen while the frame is held. `dockY` is measured against the
      // pin (never sticky) rather than the frame, whose top moves while it holds
      if (occasionsPin && pinned && geo.occ) {
        const pin = occasionsPin.getBoundingClientRect();
        geo.pin = {
          top: pin.top + scroll,
          height: pin.height,
          dockY: geo.occ.top - (pin.top + scroll),
        };
      }

      // the row itself is measured on every screen size — the reveal runs at
      // every width, even where the bar hands off in section 2
      if (occasionRow) {
        const row = occasionRow.getBoundingClientRect();
        geo.row = { left: row.left, top: row.top + scroll, width: row.width };
      }

      // the section's intro: the bar falls through it, so it steps back
      if (occasionsHead) {
        const head = occasionsHead.getBoundingClientRect();
        geo.head = {
          left: head.left,
          width: head.width,
          top: head.top + scroll,
          height: head.height,
        };
      }
      // the bar's own proportions, so its on-screen height follows its width
      if (heroBarImg) {
        const hr = heroBarImg.getBoundingClientRect();
        if (hr.width) geo.ratio = hr.height / hr.width;
      }

      if (dockStage) dockStage.classList.toggle("is-travel-dock", Boolean(geo.occ));
    } else if (dockStage) {
      // no travel on this width: the slot keeps its own artwork
      dockStage.classList.remove("is-travel-dock");
    }

    items.forEach((it, i) => {
      it.el.style.transform = previous[i];
    });
    revealImgs.forEach((img, i) => {
      img.style.translate = previousReveal[i];
    });
    if (occasionsFrame) occasionsFrame.style.position = previousFramePos;
    reveals.forEach((el, i) => {
      el.style.transform = revealTransforms[i];
    });

    layoutW = window.innerWidth;
    layoutH = window.innerHeight;
    eased = scroll;
    requestFrame();
  }

  function requestFrame() {
    if (!frameId) frameId = requestAnimationFrame(frame);
  }

  function frame(now) {
    frameId = 0;

    // if the viewport changed without a resize event reaching us (a frame that
    // was sized during load, a restored window), the cached geometry is stale
    if (window.innerWidth !== layoutW || window.innerHeight !== layoutH) {
      scheduleMeasure();
      return;
    }

    const stamp = typeof now === "number" ? now : performance.now();
    const dt = lastFrame ? Math.min(64, Math.max(8, stamp - lastFrame)) : 1000 / 60;
    lastFrame = stamp;
    const step = dt / (1000 / 60);

    const scroll = window.scrollY;
    const vh = window.innerHeight;

    // the decorations chase the scroll with a long, frame-rate independent
    // ease: wheel and trackpad steps are interpolated instead of landing on
    // the page as hard jumps, so the bar drifts rather than snaps
    const follow = 1 - Math.pow(1 - FOLLOW, step);
    eased += (scroll - eased) * follow;
    if (Math.abs(scroll - eased) < SNAP) eased = scroll;

    const pointerEase = 1 - Math.pow(1 - 0.12, step);
    smoothX += (pointerX - smoothX) * pointerEase;
    smoothY += (pointerY - smoothY) * pointerEase;
    if (Math.abs(pointerX - smoothX) < 0.0008) smoothX = pointerX;
    if (Math.abs(pointerY - smoothY) < 0.0008) smoothY = pointerY;

    const scrolled = scroll > 16;
    if (scrolled !== headerScrolled) {
      headerScrolled = scrolled;
      header.classList.toggle("is-scrolled", scrolled);
    }

    let heroX = 0;
    let heroY = 0;
    let juiceY = 0;

    for (const it of items) {
      const top = it.top - eased;
      if (top + it.height < -240 || top > vh + 240) continue;

      let dx = 0;
      let dy = (top + it.height / 2 - vh / 2) * it.speed;
      // stacked on a phone, the bar and the phrase under it drift in opposite
      // directions and meet; there is no lane to spend that drift in, so the
      // poster holds still and keeps its spacing at every scroll position
      if (narrow && (it.isLine || it.isHero)) dy = 0;

      if (it.isLine) {
        dy += smoothY * 5;
        dx = smoothX * 4;
      } else if (it.isHero) {
        dy += smoothY * -9;
        dx = smoothX * -11;
        heroX = dx;
        heroY = dy;
      } else if (it.isJuice) {
        juiceY = dy;
      }

      const next = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
      if (it.el.style.transform !== next) it.el.style.transform = next;
    }

    if (geo) {
      // 0 while the hero sits at rest, 1 once section 2's slot is half-way up
      const start = vh * 0.12;
      const end = Math.max(start + 240, geo.to.top - vh * 0.5);
      const p = easeInOut(clamp01((eased - start) / (end - start)));

      const fromTop = geo.from.top - eased + heroY;
      const fromLeft = geo.from.left + heroX;
      const toTop = geo.to.top - eased + juiceY;
      const toLeft = geo.to.left;

      let x = fromLeft + (toLeft - fromLeft) * p;
      let y = fromTop + (toTop - fromTop) * p;
      let width = geo.from.width + (geo.to.width - geo.from.width) * p;

      // leg 2: out of section 2 and down into the occasions group. The four
      // finishes stand together in the middle, so this is a single drop: the bar
      // comes down its own slot's line and lands in it, shrinking to group size
      // on the way.
      if (geo.occ && geo.row) {
        const dockY = geo.occ.top - eased; // the slot's top, on screen
        // where the fall comes to rest: the dock's own line while the frame is
        // held, so the bar meets its slot exactly as the section locks
        const landY = geo.pin ? geo.pin.dockY : vh * 0.82;
        const centreX = geo.occ.left;

        // 1 — the fall. One long, slow drop on the slot's own line, shrinking to
        // group size on the way. It ends at the exact scroll where the slot has
        // climbed to the landing line, so the bar and its slot meet rather than
        // one chasing the other.
        const fallEnd = geo.occ.top - landY;
        const fallStart = Math.max(end, fallEnd - vh * 0.9);
        const pinEnd = geo.pin
          ? geo.pin.top + Math.max(0, geo.pin.height - vh)
          : Infinity;
        const targetY = Math.min(dockY, landY);
        const fallT = easeDrift(clamp01((eased - fallStart) / (fallEnd - fallStart)));
        x += (centreX - x) * fallT;
        y += (targetY - y) * fallT;
        // small early, so the bar is row-sized by the time it reaches the heading
        width += (geo.occ.width - width) * easeSoft(clamp01(fallT / 0.5));

        // 2 — the settle. The bar is already on its slot's line, so the swipe
        // out to a far column has nothing left to do: this only holds the bar on
        // the line while the pinned frame is still held.
        let gp;
        if (geo.pin) {
          const span = Math.max(1, geo.pin.height - vh);
          const held = clamp01((eased - geo.pin.top) / span);
          gp = clamp01((held - PIN_BUFFER) / PIN_GLIDE);
        } else {
          // no room to pin (short or narrow screens): a shorter, plain travel
          const glideStart = fallEnd + vh * 0.2;
          gp = clamp01((eased - glideStart) / (vh * 0.55));
        }
        const glideT = easeDrift(gp);
        x += (geo.occ.left - x) * glideT;
        if (fallT >= 1) {
          // while the pin holds, the dock stands still on screen, so the bar is
          // held on its line. the document coordinate of a sticky dock shifts
          // by the whole held stretch once it releases, so from there the bar is
          // measured off that line instead of off the dock's layout position
          y = geo.pin ? landY - Math.max(0, eased - pinEnd) : targetY;
        }

      }

      // while the bar is crossing the section's intro, the copy steps back so
      // neither it nor the bar has to fight the other for legibility
      if (geo.head && occasionsHead) {
        const headTop = geo.head.top - eased;
        const barH = width * geo.ratio;
        const yOver = Math.min(y + barH, headTop + geo.head.height) - Math.max(y, headTop);
        const xOver =
          Math.min(x + width, geo.head.left + geo.head.width) - Math.max(x, geo.head.left);
        const share = yOver > 0 && xOver > 0 ? clamp01(yOver / Math.min(barH, geo.head.height)) : 0;
        const dim = 1 - 0.5 * easeSoft(clamp01(share * 1.5));
        const value = dim > 0.999 ? "" : dim.toFixed(3);
        if (occasionsHead.style.opacity !== value) occasionsHead.style.opacity = value;
      }

      barTravel.style.transform = `translate3d(${round(x)}px, ${round(y)}px, 0) scale(${(
        width / BASE_W
      ).toFixed(4)})`;
    }

    // the row stands finished at every scroll position: nothing is held back
    // waiting for the bar to sweep past it
    if (geo && geo.row) showFinishes();

    const settling =
      Math.abs(scroll - eased) > SNAP ||
      Math.abs(pointerX - smoothX) > 0.0008 ||
      Math.abs(pointerY - smoothY) > 0.0008;

    if (settling) requestFrame();
    else lastFrame = 0;
  }

  function scheduleMeasure() {
    if (resizeId) return;
    resizeId = requestAnimationFrame(() => {
      resizeId = 0;
      measure();
    });
  }

  if (!reduceMotion && items.length) {
    measure();

    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("load", scheduleMeasure);
    window.addEventListener("pageshow", scheduleMeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleMeasure);
    if ("ResizeObserver" in window) new ResizeObserver(scheduleMeasure).observe(document.body);

    // the first measure can run before the page has finished settling (late
    // webfonts and lazy images shift sections by a few pixels), which leaves the
    // dock points slightly off until the next resize: measure again once the
    // first paint is through, and once more after everything has landed
    requestAnimationFrame(() => requestAnimationFrame(scheduleMeasure));
    setTimeout(scheduleMeasure, 900);

    const hero = document.getElementById("home");
    hero.addEventListener(
      "pointermove",
      (e) => {
        const rect = hero.getBoundingClientRect();
        pointerX = (e.clientX - rect.left) / rect.width - 0.5;
        pointerY = (e.clientY - rect.top) / rect.height - 0.5;
        requestFrame();
      },
      { passive: true }
    );
    hero.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
      requestFrame();
    });
  } else {
    const markHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
    markHeader();
    window.addEventListener("scroll", markHeader, { passive: true });
  }

  /* ---------- gallery / collection switcher ---------- */
  const bars = {
    grass: {
      label: "Grass",
      index: "01",
      note: "01 — Living wall",
      title: "The Grass Bar",
      text: "A living-wall face with a soft-touch finish. Our signature look, and the one most guests photograph before they've had a single\u00a0sip.",
      specs: [
        ["Finish", "Living grass"],
        ["Best for", "Gardens, weddings, daytime"],
        ["Lead time", "3–6 months"],
      ],
      img: "assets/bar-grass.webp?v=2",
      alt: "The Grass Bar in a living-wall grass finish",
    },
    rosegold: {
      label: "Rosé Gold",
      index: "02",
      note: "02 — Mosaic shimmer",
      title: "The Rosé Gold Bar",
      text: "A warm rose-gold mosaic that shifts with the light. Built for evening receptions and rooms that already\u00a0glow.",
      specs: [
        ["Finish", "Rosé gold mosaic"],
        ["Best for", "Evening receptions, galas"],
        ["Lead time", "3–6 months"],
      ],
      img: "assets/bar-rosegold.webp?v=2",
      alt: "The Rosé Gold Bar with a rose-gold mosaic panel",
    },
    black: {
      label: "Black",
      index: "03",
      note: "03 — Sequin noir",
      title: "The Black Bar",
      text: "Sequin noir with brushed chrome trim. Understated, sharp, and a little bit rock and roll — a natural fit for brand\u00a0launches.",
      specs: [
        ["Finish", "Black sequin"],
        ["Best for", "Corporate, launches, after-dark"],
        ["Lead time", "3–6 months"],
      ],
      img: "assets/bar-black.webp?v=2",
      alt: "The Black Bar with a black sequin panel",
    },
    silver: {
      label: "Silver",
      index: "04",
      note: "04 — Mirror tile",
      title: "The Silver Bar",
      text: "Mirror-polished tile that catches every light in the room. Clean and modern, and endlessly photogenic in a\u00a0crowd.",
      specs: [
        ["Finish", "Mirror silver"],
        ["Best for", "Festivals, studios, daytime"],
        ["Lead time", "3–6 months"],
      ],
      img: "assets/bar-silver.webp?v=2",
      alt: "The Silver Bar with a mirrored silver panel",
    },
  };

  const swatches = Array.from(document.querySelectorAll(".swatch"));
  const collectionProduct = document.getElementById("collectionProduct");
  const collectionImg = document.getElementById("collectionImg");
  const collectionNote = document.getElementById("collectionNote");
  const collectionTitle = document.getElementById("collectionTitle");
  const collectionText = document.getElementById("collectionText");
  const collectionSpecs = document.querySelector(".collection__specs");

  // Warm the cache so switching feels instant.
  Object.values(bars).forEach((bar) => {
    const img = new Image();
    img.src = bar.img;
  });

  let currentBar = "grass";
  let swapTimer = null;

  function selectBar(key) {
    if (!bars[key] || key === currentBar) return;
    const bar = bars[key];
    currentBar = key;

    swatches.forEach((s) => {
      const active = s.dataset.bar === key;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-selected", String(active));
    });

    clearTimeout(swapTimer);
    collectionProduct.classList.add("is-swapping");

    swapTimer = setTimeout(
      () => {
        collectionImg.src = bar.img;
        collectionImg.alt = bar.alt;
        collectionNote.textContent = bar.note;
        collectionTitle.textContent = bar.title;
        collectionText.textContent = bar.text;
        collectionSpecs.innerHTML = bar.specs
          .map(([term, value]) => `<li><span>${term}</span>${value}</li>`)
          .join("");
        collectionProduct.classList.remove("is-swapping");
      },
      reduceMotion ? 0 : 220
    );
  }

  swatches.forEach((s) => {
    s.addEventListener("click", () => selectBar(s.dataset.bar));
  });

  /* ---------- reviews slider ---------- */
  const slides = Array.from(document.querySelectorAll(".review"));
  const revPrev = document.getElementById("revPrev");
  const revNext = document.getElementById("revNext");
  const revDots = Array.from(document.querySelectorAll("#revDots button"));
  const reviewsCard = document.querySelector(".reviews__card");

  let slide = 0;

  if (slides.length) {
    revDots.forEach((btn) => {
      btn.addEventListener("click", () => goTo(Number(btn.dataset.index)));
    });

    function goTo(index) {
      slide = (index + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle("is-active", i === slide);
        // only the visible slide is exposed to assistive tech
        s.setAttribute("aria-hidden", String(i !== slide));
      });
      revDots.forEach((b, i) =>
        b.setAttribute("aria-current", String(i === slide))
      );
    }

    revPrev.addEventListener("click", () => goTo(slide - 1));
    revNext.addEventListener("click", () => goTo(slide + 1));

    reviewsCard.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goTo(slide - 1);
      if (e.key === "ArrowRight") goTo(slide + 1);
    });

    goTo(0);
  }

  /* ---------- FAQ: one open at a time ---------- */
  const faqItems = Array.from(document.querySelectorAll(".faq__item"));
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- active nav link ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    // Track every section currently in the reading band, then paint from the
    // full set. Reacting only to sections *entering* left the last one latched
    // on forever — scrolling back to the hero kept "Why Us" underlined.
    const inBand = new Set();

    const paintCurrent = () => {
      const current = sections.find((section) => inBand.has(section.id));
      navLinks.forEach((link) =>
        link.classList.toggle(
          "is-current",
          Boolean(current) && link.getAttribute("href") === `#${current.id}`
        )
      );
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        });
        paintCurrent();
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- booking form ---------- */
  const form = document.getElementById("bookingForm");
  const formNote = document.getElementById("formNote");
  const defaultNote = formNote.textContent;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    form.querySelectorAll(".field").forEach((f) => f.classList.remove("field--error"));

    if (!name || !emailOk) {
      if (!name) form.querySelector('[name="name"]').closest(".field").classList.add("field--error");
      if (!emailOk) form.querySelector('[name="email"]').closest(".field").classList.add("field--error");
      formNote.textContent = "Please add your name and a valid email\u00a0address.";
      formNote.className = "booking__note is-error";
      return;
    }

    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${data.get("phone") || "not given"}`,
      `Event date: ${data.get("date") || "not set"}`,
      `Event time: ${data.get("time") || "not set"}`,
      `Event type: ${data.get("type")}`,
      `Location: ${data.get("location") || "not given"}`,
      `Guests: ${data.get("guests") || "not set"}`,
      "",
      "About the event:",
      (data.get("message") || "").toString().trim() || "—",
    ];

    const subject = encodeURIComponent(`Slush bar enquiry — ${name}`);
    const body = encodeURIComponent(lines.join("\n"));

    formNote.textContent =
      "Opening your email app… if nothing happens, write to\u00a0chillandcheerstation@gmail.com.";
    formNote.className = "booking__note is-success";

    window.location.href = `mailto:chillandcheerstation@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      formNote.textContent = defaultNote;
      formNote.className = "booking__note";
    }, 9000);
  });

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
