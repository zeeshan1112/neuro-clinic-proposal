/**
 * V6 Story-Driven Deck Engine (TripVan-Inspired Editorial Motion)
 * - Reveal.js 5.1.0 (1600x900 desktop / airy single-column mobile <= 900px)
 * - Driving Medical Care Van (#van on rail, #bigvan across stage, #roadvan on Slide 10 winding highway, #m-van on mobile rail)
 * - Evolving Dr. Mira guide with walk cycle, pointer-tracking pupils, warm cream speech bubble & confetti
 */
(function initDeckV6() {
  const isMobileViewport = () => window.innerWidth <= 900;
  let lastMobileState = isMobileViewport();

  function syncStageScale() {
    const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    document.documentElement.style.setProperty("--stage-scale", scale.toFixed(4));
  }
  syncStageScale();

  Reveal.initialize({
    width: 1600,
    height: 900,
    margin: 0,
    minScale: 0.2,
    maxScale: 2.0,
    disableLayout: isMobileViewport(),
    hash: true,
    controls: true,
    progress: false,
    touch: true,
    center: false,
    transition: "fade",
    transitionSpeed: "default",
  });

  const SLIDE_STAGE = [
    {
      label: "01 Intro",
      x: 1320, y: 476, flip: -1, bx: 1285, by: 306, tail: "62%",
      state: "planning", warm: 0.25,
      line: "Welcome! First, we build a free 48-hour demo of your clinic website at ₹0 cost.",
    },
    {
      label: "02 Foundation",
      x: 56, y: 476, flip: 1, bx: 36, by: 306, tail: "34%",
      state: "planning", warm: 0.12,
      line: "You focus on neurology & neurosurgery; we run your entire digital patient funnel.",
    },
    {
      label: "03 Search",
      x: 1320, y: 476, flip: -1, bx: 1285, by: 306, tail: "62%",
      state: "leading", warm: 0.85,
      line: "82% of Ranchi patients check Google Maps, reviews & AI before visiting a new clinic.",
    },
    {
      label: "04 Offerings",
      x: 56, y: 476, flip: 1, bx: 36, by: 306, tail: "34%",
      state: "planning", warm: 0.40,
      line: "Three clear steps: Free 48h Website Demo → One-Time Clinic Setup → Monthly Care.",
    },
    {
      label: "05 Website",
      x: 1320, y: 476, flip: -1, bx: 1285, by: 306, tail: "62%",
      state: "connected", warm: 0.20,
      line: "1 mobile tap opens a pre-filled WhatsApp chat AND emails your clinic inbox instantly.",
    },
    {
      label: "06 AI Search",
      x: 56, y: 476, flip: 1, bx: 36, by: 306, tail: "34%",
      state: "illuminated", warm: 0.30,
      line: "Ask ChatGPT or Gemini for the best neuro clinic in Ranchi—it should recommend you.",
    },
    {
      label: "07 Maps & QR",
      x: 1320, y: 476, flip: -1, bx: 1285, by: 306, tail: "62%",
      state: "celebrating", warm: 0.70,
      line: "Google Business Profile puts you on Maps; our reception QR builds 5★ reviews safely!",
    },
    {
      label: "08 One-Time",
      x: 56, y: 476, flip: 1, bx: 36, by: 306, tail: "34%",
      state: "leading", warm: 0.28,
      line: "Preview your mobile-friendly website demo first at ₹0 before starting the full setup.",
    },
    {
      label: "09 Monthly",
      x: 1320, y: 476, flip: -1, bx: 1285, by: 306, tail: "62%",
      state: "illuminated", warm: 0.55,
      line: "Monthly Care includes 5 quick edits/mo, 2 free medical blogs/mo & GA4 growth data.",
    },
    {
      label: "10 Roadmap",
      x: 56, y: 476, flip: 1, bx: 36, by: 306, tail: "34%",
      state: "inviting", warm: 0.90,
      line: "Hop in! Message us on WhatsApp to start your free 48-hour clinic website demo.",
    },
  ];

  const BONUS_TIPS = [
    "85%+ of Ranchi clinic searches happen on phones—fast mobile websites double WhatsApp bookings.",
    "Google Business Profile is your official Google Maps clinic card showing OPD hours, directions & 5★ reviews.",
    "Publishing 2 fresh neurology & neurosurgery blogs every month compounds Google SEO and AI citations.",
    "Monthly care includes up to 5 quick website edits a month—just message us on WhatsApp anytime.",
  ];
  let bonusIdx = 0;

  // ── Route Rail (Desktop + Mobile Driving Medical Van) ─────────────────
  const railEl = document.getElementById("rail");
  const railVan = document.getElementById("van");
  const pageNoEl = document.getElementById("pageno");
  const railDots = [];

  if (railEl) {
    SLIDE_STAGE.forEach((s, i) => {
      const pct = (i / (SLIDE_STAGE.length - 1)) * 100;
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot" + (i === 0 ? " on" : "");
      dot.style.left = pct + "%";
      dot.title = s.label;
      dot.setAttribute("aria-label", s.label);
      dot.addEventListener("click", () => Reveal.slide(i));
      railEl.appendChild(dot);
      railDots.push(dot);
    });
  }

  const mobileCountEl = document.getElementById("mobile-count");
  const mobileVanEl = document.getElementById("m-van");
  const mobilePrevBtn = document.getElementById("mobile-prev");
  const mobileNextBtn = document.getElementById("mobile-next");

  if (mobilePrevBtn) mobilePrevBtn.addEventListener("click", () => Reveal.prev());
  if (mobileNextBtn) mobileNextBtn.addEventListener("click", () => Reveal.next());

  // ── Motion State ──────────────────────────────────────────────────────
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let motionPaused = prefersReduced;
  const motionToggleBtn = document.getElementById("motion-toggle");

  function syncMotionButton() {
    if (motionToggleBtn) {
      motionToggleBtn.textContent = motionPaused ? "Play Motion" : "Pause Motion";
    }
  }
  syncMotionButton();

  // ── Dr. Mira + Big Medical Van Transition Engine ──────────────────────
  const stageEl = document.getElementById("stage");
  const doctorWrap = document.getElementById("doctor-wrap");
  const doctorFlip = document.getElementById("doctor-flip");
  const docBody = document.getElementById("doc-body");
  const docHead = document.getElementById("doc-head");
  const docPupils = document.getElementById("doc-pupils");
  const docArmWave = document.getElementById("doc-arm-wave");
  const legL = document.getElementById("leg-l");
  const legR = document.getElementById("leg-r");
  const bubble = document.getElementById("bubble");
  const bubbleText = document.getElementById("bubble-text");
  const bigVan = document.getElementById("bigvan");

  // Mobile Interactive Stage Dock Elements (Animated Dr. Mira + Warm Cream Bubble + Transit Van)
  const mDocBtn = document.getElementById("mobile-doc-btn");
  const mDocBody = document.getElementById("m-doc-body");
  const mDocArm = document.getElementById("m-doc-arm");
  const mDocPupils = document.getElementById("m-doc-pupils");
  const mPropHalo = document.getElementById("m-prop-halo");
  const mPropStars = document.getElementById("m-prop-stars");
  const mBubbleCard = document.getElementById("mobile-bubble-card");
  const mBubbleText = document.getElementById("mobile-bubble-text");
  const mTransitVan = document.getElementById("m-transit-van");

  const FACES = {
    calm: document.getElementById("doc-face-calm"),
    celebrating: document.getElementById("doc-face-celebrating"),
  };

  const PROPS = {
    clipboard: document.getElementById("prop-clipboard"),
    phone: document.getElementById("prop-phone"),
    halo: document.getElementById("prop-halo"),
    stars: document.getElementById("prop-stars"),
    badge: document.getElementById("prop-badge"),
  };

  function setDoctorState(stateName) {
    const isCeleb = stateName === "celebrating" || stateName === "inviting";
    if (FACES.calm) FACES.calm.setAttribute("opacity", isCeleb ? "0" : "1");
    if (FACES.celebrating) FACES.celebrating.setAttribute("opacity", isCeleb ? "1" : "0");

    const activeProps = {
      planning: ["clipboard"],
      connected: ["phone"],
      illuminated: ["halo"],
      celebrating: ["stars"],
      leading: ["badge"],
      inviting: ["badge", "stars"],
    }[stateName] || ["clipboard"];

    Object.entries(PROPS).forEach(([k, el]) => {
      if (el) el.setAttribute("opacity", activeProps.includes(k) ? "1" : "0");
    });
    if (mPropHalo) mPropHalo.setAttribute("opacity", activeProps.includes("halo") ? "1" : "0");
    if (mPropStars) mPropStars.setAttribute("opacity", activeProps.includes("stars") ? "1" : "0");

    if (!motionPaused && typeof gsap !== "undefined" && docHead) {
      gsap.fromTo(
        docHead,
        { rotation: isCeleb ? -6 : 4, transformOrigin: "120px 110px" },
        { rotation: 0, duration: 0.42, ease: "back.out(2)" }
      );
    }
  }

  // Walk cycle + Big Van wheel spin & chassis bob
  let walkTl = null;
  let vanWheelsTl = null;
  let vanBobTl = null;
  let dustTimer = null;
  let transitTl = null;
  let currentDocX = 1320;

  if (typeof gsap !== "undefined") {
    if (legL && legR) {
      walkTl = gsap
        .timeline({ paused: true, repeat: -1 })
        .to(legL, { rotation: 16, duration: 0.16, transformOrigin: "100px 232px", ease: "sine.inOut" }, 0)
        .to(legR, { rotation: -16, duration: 0.16, transformOrigin: "140px 232px", ease: "sine.inOut" }, 0)
        .to(legL, { rotation: -16, duration: 0.32, transformOrigin: "100px 232px", ease: "sine.inOut" }, 0.16)
        .to(legR, { rotation: 16, duration: 0.32, transformOrigin: "140px 232px", ease: "sine.inOut" }, 0.16)
        .to([legL, legR], { rotation: 0, duration: 0.16, ease: "sine.inOut" }, 0.48);
    }
    vanWheelsTl = gsap.to(["#bv-w1", "#bv-w2"], {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 0.28,
      ease: "none",
      repeat: -1,
      paused: true,
    });
    vanBobTl = gsap.to("#bv-body", {
      y: -3,
      duration: 0.13,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      paused: true,
    });
  }

  function spawnExhaustPuff() {
    if (!stageEl || !bigVan || motionPaused || typeof gsap === "undefined") return;
    const vx = Number(gsap.getProperty(bigVan, "x")) || 0;
    const vy = Number(gsap.getProperty(bigVan, "y")) || 500;
    if (vx < -250 || vx > 1600) return;
    const d = document.createElement("div");
    const sz = 14 + Math.random() * 14;
    d.className = "puff";
    d.style.cssText = `width:${sz}px;height:${sz}px;left:${vx + 8}px;top:${vy + 150}px;opacity:0.55;`;
    stageEl.insertBefore(d, bigVan);
    gsap.to(d, {
      x: -55 - Math.random() * 35,
      y: -16 - Math.random() * 20,
      scale: 2.3,
      opacity: 0,
      duration: 0.75,
      ease: "power2.out",
      onComplete: () => d.remove(),
    });
  }

  function stopBigVan() {
    if (dustTimer) {
      clearInterval(dustTimer);
      dustTimer = null;
    }
    if (vanWheelsTl) vanWheelsTl.pause();
    if (vanBobTl) vanBobTl.pause();
    if (bigVan && typeof gsap !== "undefined") {
      gsap.killTweensOf(bigVan);
      gsap.set(bigVan, { display: "none" });
    }
  }

  function stopWalkCycle() {
    if (walkTl) walkTl.pause();
    if (legL && legR && typeof gsap !== "undefined") {
      gsap.to([legL, legR], { rotation: 0, duration: 0.15 });
    }
  }

  window.addEventListener("pointermove", (e) => {
    if (motionPaused || typeof gsap === "undefined" || !doctorWrap || !docPupils || isMobileViewport()) return;
    const rect = doctorWrap.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.28;
    const dx = gsap.utils.clamp(-2.3, 2.3, (e.clientX - cx) / 140);
    const dy = gsap.utils.clamp(-1.8, 1.8, (e.clientY - cy) / 140);
    gsap.to(docPupils, { x: dx, y: dy, duration: 0.25, overwrite: "auto" });
  });

  function confettiBurst(cx, cy) {
    if (!stageEl || motionPaused || typeof gsap === "undefined" || isMobileViewport()) return;
    const colors = ["#FFCC78", "#5FC4BC", "#E6F2F0", "#F7C062", "#1E5153"];
    for (let i = 0; i < 32; i++) {
      const dot = document.createElement("div");
      dot.className = "confetti-dot";
      dot.style.background = colors[i % colors.length];
      dot.style.left = cx + "px";
      dot.style.top = cy + "px";
      stageEl.appendChild(dot);

      const angle = (Math.PI * 2 * i) / 32 + Math.random() * 0.3;
      const dist = 60 + Math.random() * 120;
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 50,
        rotation: Math.random() * 540,
        opacity: 0,
        duration: 1.15 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => dot.remove(),
      });
    }
  }

  let ambientTls = [];
  function stopAmbientDoctor() {
    ambientTls.forEach((t) => t.kill());
    ambientTls = [];
  }

  function startAmbientDoctor() {
    stopAmbientDoctor();
    if (motionPaused || typeof gsap === "undefined") return;

    if (docBody) {
      ambientTls.push(
        gsap.to(docBody, { y: -4, duration: 1.9, repeat: -1, yoyo: true, ease: "sine.inOut" })
      );
    }
    if (docPupils) {
      ambientTls.push(
        gsap.to(docPupils, {
          scaleY: 0.15,
          transformOrigin: "120px 78px",
          duration: 0.1,
          repeat: -1,
          repeatDelay: 3.4,
          yoyo: true,
        })
      );
    }
    if (mDocBody) {
      ambientTls.push(
        gsap.to(mDocBody, { y: -2.6, duration: 1.9, repeat: -1, yoyo: true, ease: "sine.inOut" })
      );
    }
    if (mDocPupils) {
      ambientTls.push(
        gsap.to(mDocPupils, {
          scaleY: 0.15,
          transformOrigin: "55px 44px",
          duration: 0.1,
          repeat: -1,
          repeatDelay: 3.1,
          yoyo: true,
        })
      );
    }
  }

  function waveDoctor() {
    if (motionPaused || typeof gsap === "undefined") return;
    if (docArmWave) {
      gsap.fromTo(
        docArmWave,
        { rotation: 0, transformOrigin: "24px 8px" },
        { rotation: -24, duration: 0.2, yoyo: true, repeat: 3, ease: "power1.inOut" }
      );
    }
    if (mDocArm) {
      gsap.fromTo(
        mDocArm,
        { rotation: 0, transformOrigin: "14px 8px" },
        { rotation: -22, duration: 0.2, yoyo: true, repeat: 3, ease: "power1.inOut" }
      );
    }
  }

  function cycleTip() {
    const tip = BONUS_TIPS[bonusIdx % BONUS_TIPS.length];
    bonusIdx++;
    if (bubbleText) bubbleText.textContent = tip;
    if (mBubbleText) mBubbleText.textContent = tip;
    if (mBubbleCard && !motionPaused && typeof gsap !== "undefined") {
      gsap.fromTo(mBubbleCard, { scale: 0.96 }, { scale: 1, duration: 0.24, ease: "back.out(2)" });
    }
    waveDoctor();
  }

  if (doctorWrap) doctorWrap.addEventListener("click", cycleTip);
  if (bubble) bubble.addEventListener("click", cycleTip);
  if (mDocBtn) mDocBtn.addEventListener("click", cycleTip);
  if (mBubbleCard) mBubbleCard.addEventListener("click", cycleTip);

  // ── Slide 6: Interactive SEO / AEO / GEO AI Theatre ───────────────────
  const AI_SCENARIOS = [
    {
      prompt: "“Which is the best neurology and neurosurgery clinic in Ranchi?”",
      before: {
        score: 34,
        reply: "Lists 3 older hospitals; your new clinic is omitted from AI answers.",
        signalNote: "Missing medical schema · AI business hubs unclaimed",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✗ 3 rivals", state: "miss" },
          { icon: "ico-gemini", name: "Gemini", val: "✗ Not listed", state: "miss" },
          { icon: "ico-aimode", name: "AI Mode", val: "⚠ Directory", state: "warn" },
          { icon: "ico-gmaps", name: "Overviews", val: "✗ Omitted", state: "miss" },
        ],
      },
      after: {
        score: 94,
        reply: "Recommended: Ranchi Neuro Care — Specialist neurology & neurosurgery OPD, EEG diagnostics, 4.9★ rating & direct booking.",
        signalNote: "Medical schema + Bing & OpenAI Hubs verified",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✓ Cited #1", state: "ok" },
          { icon: "ico-gemini", name: "Gemini", val: "✓ Top Pick", state: "ok" },
          { icon: "ico-aimode", name: "AI Mode", val: "✓ Cited", state: "ok" },
          { icon: "ico-gmaps", name: "Overviews", val: "✓ Map + Link", state: "ok" },
        ],
      },
    },
    {
      prompt: "“Best brain and spine neurosurgeon or EEG clinic near Bariatu Ranchi?”",
      before: {
        score: 31,
        reply: "Only large hospital chains appear; AI cannot confirm your neurosurgery or EEG scope.",
        signalNote: "No dedicated neurosurgery or EEG pages indexed",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✗ Hospitals", state: "miss" },
          { icon: "ico-gemini", name: "Gemini", val: "⚠ No page", state: "warn" },
          { icon: "ico-aimode", name: "AI Mode", val: "✗ Skipped", state: "miss" },
          { icon: "ico-gmaps", name: "Overviews", val: "✗ Unlisted", state: "miss" },
        ],
      },
      after: {
        score: 95,
        reply: "Ranchi Neuro Care provides brain & spine neurosurgery consultations, EEG diagnostics, stroke care & 1-tap WhatsApp slot booking.",
        signalNote: "Neurology & Neurosurgery condition FAQs + schema indexed",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✓ Services", state: "ok" },
          { icon: "ico-gemini", name: "Gemini", val: "✓ Top Local", state: "ok" },
          { icon: "ico-aimode", name: "AI Mode", val: "✓ Highlight", state: "ok" },
          { icon: "ico-gmaps", name: "Overviews", val: "✓ Quoted", state: "ok" },
        ],
      },
    },
    {
      prompt: "“Ranchi Neuro Care OPD timings, specialist credentials & reviews”",
      before: {
        score: 40,
        reply: "Third-party directory snippet with incomplete clinic hours and missing booking links.",
        signalNote: "Conflicting directory hours · Few verified Google reviews",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "⚠ Thin bio", state: "warn" },
          { icon: "ico-gemini", name: "Gemini", val: "⚠ Old hours", state: "warn" },
          { icon: "ico-aimode", name: "AI Mode", val: "✗ Few stars", state: "miss" },
          { icon: "ico-gmaps", name: "Overviews", val: "⚠ 3rd-party", state: "warn" },
        ],
      },
      after: {
        score: 96,
        reply: "Ranchi Neuro Care · Verified OPD hours, neurology & neurosurgery credentials, 4.9★ Google Business Profile reviews & direct booking.",
        signalNote: "100% factual accuracy synced across Google, Bing & OpenAI",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✓ Exact OPD", state: "ok" },
          { icon: "ico-gemini", name: "Gemini", val: "✓ 4.9★ Info", state: "ok" },
          { icon: "ico-aimode", name: "AI Mode", val: "✓ Verified", state: "ok" },
          { icon: "ico-gmaps", name: "Overviews", val: "✓ Official", state: "ok" },
        ],
      },
    },
  ];

  let aiMode = "after";
  let aiQueryIdx = 0;
  let aiUserInteracted = false;

  const aiModeBtns = document.querySelectorAll("[data-ai-mode]");
  const aiQBtns = document.querySelectorAll("[data-ai-q]");
  const aiPromptEl = document.getElementById("ai-prompt-text");
  const aiReplyEl = document.getElementById("ai-chat-reply");
  const aiSignalNoteEl = document.getElementById("ai-signal-note");
  const aiGridEl = document.getElementById("ai-engine-grid");
  const aiScoreValEl = document.getElementById("ai-score-val");
  const aiRingArc = document.getElementById("ai-ring-arc");

  function renderAiConsole(animateRing = true) {
    const scenario = AI_SCENARIOS[aiQueryIdx] || AI_SCENARIOS[0];
    const data = scenario[aiMode];
    const clinicName = (window.DECK_CONFIG && window.DECK_CONFIG.clinicName) || "Ranchi Neuro Care";

    if (aiPromptEl) aiPromptEl.textContent = scenario.prompt.replace("Ranchi Neuro Care", clinicName);
    if (aiReplyEl) {
      aiReplyEl.textContent = data.reply.replace("Ranchi Neuro Care", clinicName);
      aiReplyEl.classList.toggle("is-missed", aiMode === "before");
    }
    if (aiSignalNoteEl) aiSignalNoteEl.textContent = data.signalNote;

    aiModeBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.aiMode === aiMode));
    aiQBtns.forEach((b) => b.classList.toggle("is-active", Number(b.dataset.aiQ) === aiQueryIdx));

    if (aiGridEl) {
      aiGridEl.innerHTML = data.engines
        .map(
          (e) =>
            `<div class="engine-cell">
               <span class="engine-name-wrap"><svg class="plat-ico"><use href="#${e.icon}"/></svg><span class="engine-name">${e.name}</span></span>
               <span class="verdict-pill is-${e.state}">${e.val}</span>
             </div>`
        )
        .join("");
    }

    const circumference = 157.1;
    const offset = circumference - (data.score / 100) * circumference;
    if (aiRingArc && aiScoreValEl) {
      aiRingArc.setAttribute("stroke", aiMode === "before" ? "#FF8A6B" : "#5FC4BC");
      if (animateRing && typeof gsap !== "undefined" && !motionPaused) {
        gsap.to(aiRingArc, { strokeDashoffset: offset, duration: 0.55, ease: "power2.out" });
        const obj = { val: Number(aiScoreValEl.textContent) || 0 };
        gsap.to(obj, {
          val: data.score,
          duration: 0.55,
          ease: "power2.out",
          onUpdate: () => {
            aiScoreValEl.textContent = String(Math.round(obj.val));
          },
        });
      } else {
        aiRingArc.style.strokeDashoffset = offset.toFixed(1);
        aiScoreValEl.textContent = String(data.score);
      }
    }
  }

  aiModeBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      aiUserInteracted = true;
      aiMode = btn.dataset.aiMode || "after";
      renderAiConsole(true);
    })
  );
  aiQBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      aiUserInteracted = true;
      aiQueryIdx = Number(btn.dataset.aiQ) || 0;
      renderAiConsole(true);
    })
  );

  // ── Slide 9: Monthly Improvement Data Stepper ─────────────────────────
  const WATCH_PHASES = [
    {
      visitors: "180",
      visW: "22%",
      maps: "35 / mo",
      mapsW: "20%",
      calls: "18 / mo",
      callsW: "18%",
      share: "14%",
      aiW: "14%",
      delta: "M0 Launch Baseline",
      visDelta: "GA4 Installed",
      blogBadge: "BLOG QUEUE READY",
      note: "M0 Launch: GA4 analytics installed + baseline across 25 Ranchi neurology & neurosurgery prompts.",
    },
    {
      visitors: "460",
      visW: "45%",
      maps: "90 / mo",
      mapsW: "42%",
      calls: "52 / mo",
      callsW: "40%",
      share: "29%",
      aiW: "29%",
      delta: "▲ +15% AI Share",
      visDelta: "2.5× Visitors",
      blogBadge: "2 FREE BLOGS PUBLISHED · M1",
      note: "M1 Report: 2 neurology blogs published + up to 5 quick website edits + full GA4 report.",
    },
    {
      visitors: "890",
      visW: "68%",
      maps: "175 / mo",
      mapsW: "64%",
      calls: "104 / mo",
      callsW: "60%",
      share: "46%",
      aiW: "46%",
      delta: "▲ +32% AI Share",
      visDelta: "4.9× Visitors",
      blogBadge: "4 FREE BLOGS PUBLISHED · M2",
      note: "M2 Report: 4 blogs indexed on Google & AI + 104 direct WhatsApp & phone call taps.",
    },
    {
      visitors: "1,420",
      visW: "92%",
      maps: "280 / mo",
      mapsW: "84%",
      calls: "165 / mo",
      callsW: "78%",
      share: "58%",
      aiW: "58%",
      delta: "▲ +44% AI Share",
      visDelta: "7.8× Visitors",
      blogBadge: "6 BLOGS LIVE BY M3",
      note: "2 new blogs/month + 5 quick edits/month + full GA4 & AI growth report. No annual lock-in.",
    },
  ];

  let watchUserInteracted = false;
  const phaseBtns = document.querySelectorAll("[data-phase]");

  function setWatchPhase(idx) {
    const p = WATCH_PHASES[idx] || WATCH_PHASES[3];
    phaseBtns.forEach((b) => b.classList.toggle("is-active", Number(b.dataset.phase) === idx));

    const elVisitors = document.getElementById("watch-visitors");
    const elMaps = document.getElementById("watch-maps");
    const elCalls = document.getElementById("watch-calls");
    const elShare = document.getElementById("watch-share");
    const elDelta = document.getElementById("watch-delta");
    const elVisDelta = document.getElementById("watch-vis-delta");
    const elBlogBadge = document.getElementById("blog-month-badge");
    const elNote = document.getElementById("watch-cycle-note");

    if (elVisitors) elVisitors.textContent = p.visitors;
    if (elMaps) elMaps.textContent = p.maps;
    if (elCalls) elCalls.textContent = p.calls;
    if (elShare) elShare.textContent = p.share;
    if (elDelta) elDelta.textContent = p.delta;
    if (elVisDelta) elVisDelta.textContent = p.visDelta;
    if (elBlogBadge) elBlogBadge.textContent = p.blogBadge;
    if (elNote) elNote.textContent = p.note;

    const barVis = document.getElementById("bar-visitors");
    const barMaps = document.getElementById("bar-maps");
    const barCalls = document.getElementById("bar-calls");
    const barAi = document.getElementById("bar-ai");

    if (barVis) barVis.style.width = p.visW;
    if (barMaps) barMaps.style.width = p.mapsW;
    if (barCalls) barCalls.style.width = p.callsW;
    if (barAi) barAi.style.width = p.aiW;
  }

  phaseBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      watchUserInteracted = true;
      setWatchPhase(Number(btn.dataset.phase) || 0);
    })
  );

  // ── Story Animations Controller ───────────────────────────────────────
  let activeLoopTl = null;
  let activeTimers = [];

  function clearSlideTimers() {
    activeTimers.forEach((id) => clearTimeout(id));
    activeTimers = [];
  }

  function killStoryAnimations() {
    clearSlideTimers();
    if (activeLoopTl) {
      activeLoopTl.kill();
      activeLoopTl = null;
    }
  }

  function forceSlideVisible(slide) {
    if (!slide || typeof gsap === "undefined") return;
    const all = slide.querySelectorAll(
      ".eyebrow, .wordmark, .x, .sub, .meta, .h2, .lede, .chip, .card, .photo, .deepen, .commercial, .cta-pill"
    );
    gsap.set(all, { opacity: 1, clearProps: "transform" });
  }

  function runSlideStoryAnimations(slide, index) {
    killStoryAnimations();
    if (!slide || motionPaused || typeof gsap === "undefined") {
      if (index === 8) setWatchPhase(3);
      return;
    }

    // Animated Polaroid Photo Frames (.ph-in)
    slide.querySelectorAll(".photo.ph-in").forEach((p, i) => {
      const r = (p.style.transform.match(/-?[\d.]+deg/) || ["0deg"])[0];
      gsap.fromTo(
        p,
        { opacity: 0, y: 40, scale: 0.9, rotate: parseFloat(r) * -2 + "deg" },
        { opacity: 1, y: 0, scale: 1, rotate: r, duration: 0.75, delay: 0.15 + i * 0.12, ease: "back.out(1.4)" }
      );
    });

    // Slide 1 (index 0): Animated Glowing EEG Waveform across the Hero Clinic Card (Desktop + Mobile)
    if (index === 0) {
      const eegPath = slide.querySelector("#cover-eeg-path");
      if (eegPath) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
        activeLoopTl
          .fromTo(
            eegPath,
            { strokeDashoffset: 440, opacity: 0.45 },
            { strokeDashoffset: 0, opacity: 1, duration: 1.9, ease: "power2.out" }
          )
          .to(eegPath, { opacity: 0.75, duration: 0.7, ease: "sine.inOut" });
      }
    }

    // Animated Number Counters ([data-count])
    slide.querySelectorAll("[data-count]").forEach((el) => {
      const to = Number(el.dataset.count) || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: to,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v));
        },
      });
    });

    // Slide 3: Animated SVG Percentage Rings (.ring .fg) + Capture Bar (.cut[data-w])
    slide.querySelectorAll(".ring .fg").forEach((c, i) => {
      const C = 2 * Math.PI * 40;
      const pct = Number(c.dataset.pct) || 50;
      c.style.strokeDasharray = `${C}`;
      gsap.fromTo(
        c,
        { strokeDashoffset: C },
        { strokeDashoffset: C * (1 - pct / 100), duration: 1.1, delay: 0.2 + i * 0.1, ease: "power3.out" }
      );
    });

    slide.querySelectorAll(".cut[data-w]").forEach((el) => {
      if (!isMobileViewport()) {
        gsap.fromTo(el, { width: "0%" }, { width: el.dataset.w + "%", duration: 1.1, delay: 0.3, ease: "power3.out" });
      }
    });

    // Slide 4 & Slide 10: SVG Path Draw (path.draw)
    slide.querySelectorAll("path.draw").forEach((p) => {
      try {
        const len = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDashoffset: len, opacity: 0.2 },
          { strokeDashoffset: 0, opacity: 1, duration: 1.4, delay: 0.2, ease: "power2.inOut" }
        );
      } catch (_) {}
    });

    // Slide 5: Mobile-Friendly Website Booking Cinema (Animated Cursor + Bridge + Toasts)
    if (index === 4) {
      const cursor = slide.querySelector("#sim-cursor");
      const btn = slide.querySelector("#phone-submit-btn");
      const waPkt = slide.querySelector("#cinema-wa-pkt");
      const mailPkt = slide.querySelector("#cinema-mail-pkt");
      const waCard = slide.querySelector("#wa-toast-card");
      const mailCard = slide.querySelector("#mail-toast-card");
      const badgeTxt = slide.querySelector("#inbox-badge-txt");

      if (btn && waPkt && mailPkt) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        activeLoopTl
          .call(() => {
            if (badgeTxt) {
              badgeTxt.textContent = "NEW BOOKING";
              badgeTxt.className = "verdict-pill is-warn";
            }
          })
          .fromTo(cursor, { x: 36, y: -55, opacity: 0.4 }, { x: 0, y: 0, opacity: 1, duration: 0.55, ease: "power2.out" })
          .to(btn, { scale: 0.96, duration: 0.14, yoyo: true, repeat: 1 })
          .fromTo([waPkt, mailPkt], { scale: 0.88, opacity: 0.5 }, { scale: 1.06, opacity: 1, duration: 0.35, yoyo: true, repeat: 1 })
          .fromTo([waCard, mailCard], { y: 4 }, { y: 0, duration: 0.35, ease: "back.out(2)" })
          .call(() => {
            if (badgeTxt) {
              badgeTxt.textContent = "ALERT SENT ✓";
              badgeTxt.className = "verdict-pill is-ok";
            }
          })
          .to({}, { duration: 1.1 });
      }
    }

    // Slide 6: Auto-flip Before -> After AI Recommendation
    if (index === 5) {
      if (!aiUserInteracted) {
        aiMode = "before";
        aiQueryIdx = 0;
        renderAiConsole(false);
        const tId = setTimeout(() => {
          if (!aiUserInteracted && Reveal.getIndices().h === 5 && !motionPaused) {
            aiMode = "after";
            renderAiConsole(true);
          }
        }, 1250);
        activeTimers.push(tId);
      }
    }

    // Slide 7: Google Business Profile Actions + Reception QR Laser Scan + 5 Stars + Confetti
    if (index === 6) {
      const gbpPills = slide.querySelectorAll("#gbp-actions .gbp-act-pill");
      const laser = slide.querySelector("#qr-laser-line");
      const stars = slide.querySelectorAll(".qr-star");
      const pubCard = slide.querySelector("#qr-route-public");
      const privCard = slide.querySelector("#qr-route-private");
      let pillStep = 0;

      confettiBurst(1420, 480);

      if (stars.length) {
        gsap.fromTo(
          stars,
          { scale: 0.4, opacity: 0.3 },
          { scale: 1, opacity: 1, duration: 0.35, stagger: 0.08, ease: "back.out(2)" }
        );
      }

      if (laser && pubCard && privCard) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.25 });
        activeLoopTl
          .call(() => {
            pubCard.classList.add("is-active-route");
            privCard.classList.remove("is-active-route");
            if (gbpPills.length) {
              gbpPills.forEach((p, idx) => p.classList.toggle("is-pulsing", idx === pillStep % gbpPills.length));
              pillStep++;
            }
          })
          .fromTo(laser, { y: 0 }, { y: 118, duration: 1.0, yoyo: true, repeat: 1, ease: "sine.inOut" })
          .call(() => {
            pubCard.classList.remove("is-active-route");
            privCard.classList.add("is-active-route");
            if (gbpPills.length) {
              gbpPills.forEach((p, idx) => p.classList.toggle("is-pulsing", idx === pillStep % gbpPills.length));
              pillStep++;
            }
          })
          .fromTo(laser, { y: 0 }, { y: 118, duration: 1.0, yoyo: true, repeat: 1, ease: "sine.inOut" });
      }
    }

    // Slide 9: Monthly Improvement Data Stepper
    if (index === 8) {
      if (!watchUserInteracted) {
        setWatchPhase(0);
        [1, 2, 3].forEach((phaseIdx, step) => {
          const tId = setTimeout(() => {
            if (!watchUserInteracted && Reveal.getIndices().h === 8 && !motionPaused) {
              setWatchPhase(phaseIdx);
            }
          }, (step + 1) * 1050);
          activeTimers.push(tId);
        });
      }
    }

    // Slide 10: Winding Highway Road — Medical Care Van (#roadvan) drives the curved route on Desktop AND Mobile!
    if (index === 9) {
      confettiBurst(180, 480);
      const rv = slide.querySelector("#roadvan");
      const p = slide.querySelector("#roadpath");
      if (rv && p) {
        try {
          const len = p.getTotalLength();
          const Place = (t) => {
            const a = p.getPointAtLength(t * len);
            const b = p.getPointAtLength(Math.min(len, t * len + 2));
            const ang = Math.atan2(b.y - a.y, b.x - a.x) * 57.2958;
            rv.setAttribute("transform", `translate(${a.x.toFixed(1)},${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
          };
          Place(0);
          const obj = { t: 0 };
          activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
          activeLoopTl.fromTo(
            obj,
            { t: 0 },
            {
              t: 1,
              duration: 2.8,
              ease: "power1.inOut",
              onUpdate: () => Place(obj.t),
            }
          );
        } catch (_) {}
      }
    }
  }

  // ── Stage Sync: Driving Van on Rail + Big Van Cross-Stage Ride ────────
  function updateStage(index, isInitial = false) {
    const clamped = Math.max(0, Math.min(SLIDE_STAGE.length - 1, index));
    const cfg = SLIDE_STAGE[clamped];
    const pct = (clamped / (SLIDE_STAGE.length - 1)) * 100;

    if (window.setBayerSlide) window.setBayerSlide(clamped, cfg.warm);
    setDoctorState(cfg.state);

    // 1. Desktop Route Rail: Mini Medical Van drives stop-to-stop & bobs
    railDots.forEach((d, k) => d.classList.toggle("on", k <= clamped));
    if (pageNoEl) {
      pageNoEl.textContent =
        String(clamped + 1).padStart(2, "0") + " / " + String(SLIDE_STAGE.length).padStart(2, "0");
    }
    if (railVan) {
      if (!motionPaused && !isInitial && typeof gsap !== "undefined") {
        gsap.to(railVan, { left: pct + "%", duration: 1.15, ease: "power2.inOut" });
        gsap.fromTo(railVan, { y: 0 }, { y: -3.5, duration: 0.11, yoyo: true, repeat: 9, ease: "sine.inOut" });
      } else {
        railVan.style.left = pct + "%";
      }
    }

    // 2. Mobile Route Rail: Mobile Medical Van drives across bottom track
    if (mobileCountEl) {
      mobileCountEl.textContent =
        String(clamped + 1).padStart(2, "0") + " / " + String(SLIDE_STAGE.length).padStart(2, "0");
    }
    if (mobileVanEl) {
      mobileVanEl.style.left = `calc(10px + ${(pct / 100).toFixed(3)} * (100% - 54px))`;
    }

    // 3. Position Speech Bubble in Safe Zone (Desktop + Mobile Warm Cream Bubble)
    if (bubble && bubbleText) {
      bubble.style.setProperty("--tail", cfg.tail);
      bubble.style.left = cfg.bx + "px";
      bubble.style.top = cfg.by + "px";
      bubbleText.textContent = cfg.line;
    }
    if (mBubbleText) {
      mBubbleText.textContent = cfg.line;
    }
    if (!motionPaused && !isInitial && typeof gsap !== "undefined" && isMobileViewport()) {
      if (mBubbleCard) {
        gsap.fromTo(
          mBubbleCard,
          { y: 5, opacity: 0.65 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
      if (mTransitVan) {
        gsap.fromTo(
          mTransitVan,
          { x: -80, opacity: 0.95 },
          { x: window.innerWidth + 90, opacity: 0, duration: 0.75, ease: "power2.inOut" }
        );
      }
    }

    // 4. Dr. Mira Movement + Big Medical Van Cross-Stage Ride (when moving Left -> Right)
    if (!doctorWrap || !doctorFlip) return;
    if (transitTl) {
      transitTl.kill();
      transitTl = null;
    }
    stopBigVan();
    stopWalkCycle();

    const dx = cfg.x - currentDocX;
    currentDocX = cfg.x;

    if (motionPaused || isInitial || typeof gsap === "undefined" || isMobileViewport()) {
      gsap.set(doctorWrap, { x: cfg.x, y: cfg.y, autoAlpha: 1 });
      gsap.set(doctorFlip, { scaleX: cfg.flip });
      if (bubble) gsap.set(bubble, { opacity: 1, transform: "none" });
      return;
    }

    if (dx > 400 && bigVan) {
      // Moving from left zone to right zone: Dr. Mira rides the Big Medical Care Van across the stage!
      gsap.set(bubble, { opacity: 0 });
      gsap.set(doctorWrap, { x: cfg.x, y: cfg.y, autoAlpha: 0 });
      gsap.set(doctorFlip, { scaleX: cfg.flip });

      transitTl = gsap.timeline({
        onStart: () => {
          gsap.set(bigVan, { display: "block", x: -420, y: 520, scale: 0.92 });
          if (vanWheelsTl) vanWheelsTl.play();
          if (vanBobTl) vanBobTl.play();
          dustTimer = setInterval(spawnExhaustPuff, 65);
        },
        onComplete: () => {
          stopBigVan();
          stopWalkCycle();
          gsap.set(doctorWrap, { x: cfg.x, y: cfg.y, autoAlpha: 1 });
          gsap.set(bubble, { opacity: 1, clearProps: "transform" });
        },
      });

      transitTl
        .fromTo(bigVan, { x: -420 }, { x: 1660, duration: 0.62, ease: "power1.inOut" }, 0)
        .call(() => {
          stopBigVan();
          gsap.set(doctorWrap, { x: 1480, y: cfg.y, autoAlpha: 1 });
          if (walkTl) walkTl.play();
        })
        .to(doctorWrap, { x: cfg.x, duration: 0.22, ease: "power2.out" })
        .call(() => stopWalkCycle())
        .fromTo(
          bubble,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.22, ease: "back.out(1.5)", clearProps: "transform" },
          "-=0.12"
        );
    } else {
      // Walking transition
      if (walkTl) walkTl.play();
      gsap.to(doctorFlip, { scaleX: cfg.flip, duration: 0.25, ease: "power2.out" });
      transitTl = gsap
        .timeline({
          onComplete: () => {
            stopWalkCycle();
            gsap.set(doctorWrap, { x: cfg.x, y: cfg.y, autoAlpha: 1 });
            if (bubble) gsap.set(bubble, { opacity: 1, clearProps: "transform" });
          },
        })
        .to(doctorWrap, { x: cfg.x, y: cfg.y, duration: 0.58, ease: "power3.out" }, 0)
        .fromTo(
          bubble,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.32, delay: 0.18, ease: "back.out(1.4)", clearProps: "transform" },
          0
        );
    }
  }

  function onSlideActive(slide, index, isInitial = false) {
    updateStage(index, isInitial);
    runSlideStoryAnimations(slide, index);
    waveDoctor();

    if (!slide) return;
    if (isMobileViewport()) {
      slide.scrollTop = 0;
    }
    forceSlideVisible(slide);
    if (motionPaused || typeof gsap === "undefined") return;

    const eyebrows = slide.querySelectorAll(".eyebrow");
    const headings = slide.querySelectorAll(".wordmark, .x, .sub, .h2, .lede");
    const cards = slide.querySelectorAll(".chip, .card, .deepen, .commercial, .cta-pill, .meta");

    gsap.killTweensOf([...eyebrows, ...headings, ...cards]);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (eyebrows.length) tl.from(eyebrows, { x: -14, opacity: 0, duration: 0.28, clearProps: "opacity,transform" });
    if (headings.length) tl.from(headings, { y: 14, opacity: 0, duration: 0.36, stagger: 0.04, clearProps: "opacity,transform" }, "-=0.15");
    if (cards.length) tl.from(cards, { y: 16, opacity: 0, duration: 0.36, stagger: 0.04, clearProps: "opacity,transform" }, "-=0.2");
  }

  window.addEventListener("resize", () => {
    syncStageScale();
    const mobileNow = isMobileViewport();
    if (mobileNow !== lastMobileState) {
      lastMobileState = mobileNow;
      Reveal.configure({ disableLayout: mobileNow });
      const slide = Reveal.getCurrentSlide();
      forceSlideVisible(slide);
      runSlideStoryAnimations(slide, Reveal.getIndices().h || 0);
    }
  });

  if (motionToggleBtn) {
    motionToggleBtn.addEventListener("click", () => {
      motionPaused = !motionPaused;
      syncMotionButton();
      if (motionPaused) {
        if (window.bayerBg) window.bayerBg.pause();
        stopAmbientDoctor();
        stopBigVan();
        stopWalkCycle();
        killStoryAnimations();
        if (typeof gsap !== "undefined") gsap.globalTimeline.pause();
        forceSlideVisible(Reveal.getCurrentSlide());
      } else {
        if (window.bayerBg) window.bayerBg.resume();
        if (typeof gsap !== "undefined") gsap.globalTimeline.resume();
        startAmbientDoctor();
        runSlideStoryAnimations(Reveal.getCurrentSlide(), Reveal.getIndices().h || 0);
      }
    });
  }

  Reveal.on("ready", (e) => {
    renderAiConsole(false);
    setWatchPhase(3);
    startAmbientDoctor();
    onSlideActive(e.currentSlide, e.indexh || 0, true);
  });

  Reveal.on("slidechanged", (e) => {
    onSlideActive(e.currentSlide, e.indexh || 0, false);
  });
})();
