/**
 * V4 Story-Driven Deck Engine
 * - Reveal.js 5.1.0 (1600x900) + GSAP 3.12.5 + WebGL 8x8 Bayer Dithering
 * - Never leaves elements at opacity: 0 (uses clearProps + instant reset)
 * - Evolving Dr. Mira guide with pointer-tracking pupils + TripVan-inspired confetti & story timelines
 */
(function initDeckV4() {
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
    progress: true,
    touch: true,
    center: false,
    transition: "fade",
    transitionSpeed: "default",
  });

  const SLIDE_STAGE = [
    {
      label: "01 Intro",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "planning", warm: 0.10,
      line: "Welcome Dr. Shiwangi! First, we build a free 48-hour demo of your clinic website.",
    },
    {
      label: "02 Partner",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "planning", warm: 0.08,
      line: "You focus on neurology in-clinic; we run your entire digital patient discovery funnel.",
    },
    {
      label: "03 Offerings",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "planning", warm: 0.16,
      line: "Stage 1 launches your digital clinic; Stage 2 maintains your site, adds 2 free blogs/mo & tracks data.",
    },
    {
      label: "04 Website",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "connected", warm: 0.14,
      line: "Your mobile-friendly website opens pre-filled WhatsApp chat AND emails booking alerts instantly.",
    },
    {
      label: "05 AI Search",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "illuminated", warm: 0.22,
      line: "Structured Physician schema + hubs teach ChatGPT, Gemini & Google AI Mode to recommend you.",
    },
    {
      label: "06 Google Maps",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "leading", warm: 0.36,
      line: "Google Business Profile puts you on Google Maps; optional Google Ads pay direct from your card.",
    },
    {
      label: "07 QR Reviews",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "celebrating", warm: 0.62,
      line: "Patients scan your reception QR: 5★ boosts Google Business Profile, 1–3★ comes privately to you!",
    },
    {
      label: "08 One-Time",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "leading", warm: 0.28,
      line: "You preview your mobile-friendly website demo first at ₹0 before starting the One-Time Launch Setup.",
    },
    {
      label: "09 Monthly",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "illuminated", warm: 0.32,
      line: "Monthly Care includes website maintenance, 2 free medical blogs/month & monthly improvement data.",
    },
    {
      label: "10 Start",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "inviting", warm: 0.68,
      line: "Share 5 quick details on WhatsApp and preview your custom clinic website demo at ₹0!",
    },
  ];

  const BONUS_TIPS = [
    "85%+ of Ranchi clinic searches happen on mobile phones—a mobile-friendly site doubles WhatsApp bookings.",
    "Google Business Profile is your official Google Maps clinic card showing OPD hours, directions & 5★ reviews.",
    "Publishing 2 fresh neurology blogs every month steadily compounds both Google SEO and ChatGPT/Gemini citations.",
    "Your monthly improvement report shows exact Google Analytics (GA4) visitors, phone calls, and WhatsApp taps.",
  ];
  let bonusIdx = 0;

  // ── Navigation Rails (Desktop + Mobile) ───────────────────────────────
  const railEl = document.getElementById("rail");
  const railToken = document.getElementById("rail-token");
  const railDots = [];
  const railLbls = [];

  if (railEl) {
    SLIDE_STAGE.forEach((s, i) => {
      const pct = (i / (SLIDE_STAGE.length - 1)) * 100;
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.style.left = pct + "%";
      dot.title = s.label;
      dot.setAttribute("aria-label", s.label);
      dot.addEventListener("click", () => Reveal.slide(i));
      railEl.appendChild(dot);
      railDots.push(dot);

      const lbl = document.createElement("span");
      lbl.className = "lbl" + (i === 0 ? " active" : "");
      lbl.style.left = pct + "%";
      lbl.textContent = s.label;
      railEl.appendChild(lbl);
      railLbls.push(lbl);
    });
  }

  const mobileCountEl = document.getElementById("mobile-count");
  const mobileBubbleEl = document.getElementById("mobile-bubble-text");
  const mobileDotsWrap = document.getElementById("mobile-dots");
  const mobilePrevBtn = document.getElementById("mobile-prev");
  const mobileNextBtn = document.getElementById("mobile-next");
  const mobileNavStop = document.getElementById("mobile-nav-stop");
  const mobileDocBtn = document.getElementById("mobile-doc-btn");
  const mobileDotEls = [];

  if (mobileDotsWrap) {
    SLIDE_STAGE.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = i === 0 ? "active" : "";
      btn.setAttribute("aria-label", s.label);
      btn.addEventListener("click", () => Reveal.slide(i));
      mobileDotsWrap.appendChild(btn);
      mobileDotEls.push(btn);
    });
  }

  if (mobileNavStop) mobileNavStop.addEventListener("click", (e) => e.stopPropagation());
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

  // ── Evolving Dr. Mira Character Engine ────────────────────────────────
  const stageEl = document.getElementById("stage");
  const doctorWrap = document.getElementById("doctor-wrap");
  const doctorFlip = document.getElementById("doctor-flip");
  const docBody = document.getElementById("doc-body");
  const docHead = document.getElementById("doc-head");
  const docPupils = document.getElementById("doc-pupils");
  const docArmWave = document.getElementById("doc-arm-wave");
  const bubble = document.getElementById("bubble");
  const bubbleText = document.getElementById("bubble-text");

  const FACES = {
    calm: document.getElementById("doc-face-calm"),
    concerned: document.getElementById("doc-face-concerned"),
    celebrating: document.getElementById("doc-face-celebrating"),
  };

  const PROPS = {
    clipboard: document.getElementById("prop-clipboard"),
    lens: document.getElementById("prop-lens"),
    phone: document.getElementById("prop-phone"),
    halo: document.getElementById("prop-halo"),
    stars: document.getElementById("prop-stars"),
    badge: document.getElementById("prop-badge"),
  };

  function setDoctorState(stateName) {
    const faceKey =
      stateName === "concerned"
        ? "concerned"
        : stateName === "celebrating" || stateName === "inviting"
        ? "celebrating"
        : "calm";

    Object.entries(FACES).forEach(([k, el]) => {
      if (el) el.setAttribute("opacity", k === faceKey ? "1" : "0");
    });

    const activeProps = {
      planning: ["clipboard"],
      concerned: ["lens"],
      connected: ["phone"],
      illuminated: ["halo"],
      celebrating: ["stars"],
      leading: ["badge"],
      inviting: ["badge", "stars"],
    }[stateName] || ["clipboard"];

    Object.entries(PROPS).forEach(([k, el]) => {
      if (el) el.setAttribute("opacity", activeProps.includes(k) ? "1" : "0");
    });

    if (!motionPaused && typeof gsap !== "undefined" && docHead) {
      gsap.fromTo(
        docHead,
        { rotation: stateName === "celebrating" ? -6 : 3, transformOrigin: "120px 110px" },
        { rotation: 0, duration: 0.45, ease: "back.out(2)" }
      );
    }
  }

  // Pointer-tracking pupils (TripVan-inspired character life)
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
    const colors = ["#F5C45E", "#38E1C6", "#56B4FF", "#F4F8FF"];
    for (let i = 0; i < 18; i++) {
      const dot = document.createElement("div");
      dot.className = "confetti-dot";
      dot.style.background = colors[i % colors.length];
      dot.style.left = cx + "px";
      dot.style.top = cy + "px";
      stageEl.appendChild(dot);

      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.35;
      const dist = 55 + Math.random() * 90;
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 1.1 + Math.random() * 0.4,
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
    const mPupils = document.getElementById("m-doc-pupils");
    if (mPupils) {
      ambientTls.push(
        gsap.to(mPupils, {
          scaleY: 0.15,
          transformOrigin: "40px 35px",
          duration: 0.1,
          repeat: -1,
          repeatDelay: 3.6,
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
        { rotation: -22, duration: 0.22, yoyo: true, repeat: 3, ease: "power1.inOut" }
      );
    }
    const mArm = document.getElementById("m-doc-arm");
    if (mArm) {
      gsap.fromTo(
        mArm,
        { rotation: 0, transformOrigin: "12px 10px" },
        { rotation: -20, duration: 0.2, yoyo: true, repeat: 3, ease: "power1.inOut" }
      );
    }
  }

  function cycleTip() {
    const tip = BONUS_TIPS[bonusIdx % BONUS_TIPS.length];
    bonusIdx++;
    if (bubbleText) bubbleText.textContent = tip;
    if (mobileBubbleEl) mobileBubbleEl.textContent = tip;
    waveDoctor();
  }

  if (doctorWrap) doctorWrap.addEventListener("click", cycleTip);
  if (bubble) bubble.addEventListener("click", cycleTip);
  if (mobileDocBtn) mobileDocBtn.addEventListener("click", cycleTip);

  // ── Slide 5: Interactive SEO / AEO / GEO AI Theatre ───────────────────
  const AI_SCENARIOS = [
    {
      prompt: "“Who is the best neurologist for migraine and epilepsy in Ranchi?”",
      before: {
        score: 34,
        reply: "Lists 3 established hospital chains and older clinics; your new clinic is omitted from recommendations.",
        signalNote: "Missing Physician JSON-LD · AI bots or hubs unclaimed",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✗ 3 rivals", state: "miss" },
          { icon: "ico-gemini", name: "Gemini", val: "✗ Not listed", state: "miss" },
          { icon: "ico-aimode", name: "AI Mode", val: "⚠ Directory", state: "warn" },
          { icon: "ico-gmaps", name: "Overviews", val: "✗ Omitted", state: "miss" },
        ],
      },
      after: {
        score: 94,
        reply: "Recommended: Ranchi Neuro Care (Bariatu Rd) — Dedicated migraine & epilepsy OPD, verified timings, 4.9★ rating & direct booking.",
        signalNote: "Physician JSON-LD · llms.txt · Bing & OpenAI Hubs verified",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✓ Cited #1", state: "ok" },
          { icon: "ico-gemini", name: "Gemini", val: "✓ Top Pick", state: "ok" },
          { icon: "ico-aimode", name: "AI Mode", val: "✓ Cited", state: "ok" },
          { icon: "ico-gmaps", name: "Overviews", val: "✓ Map + Link", state: "ok" },
        ],
      },
    },
    {
      prompt: "“Which neurology clinic near Bariatu Ranchi offers EEG & stroke follow-up?”",
      before: {
        score: 31,
        reply: "Only large multi-specialty hospitals appear; AI cannot confirm your outpatient neurology or stroke follow-up scope.",
        signalNote: "No dedicated EEG or stroke condition pages indexed",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✗ Hospitals", state: "miss" },
          { icon: "ico-gemini", name: "Gemini", val: "⚠ No page", state: "warn" },
          { icon: "ico-aimode", name: "AI Mode", val: "✗ Skipped", state: "miss" },
          { icon: "ico-gmaps", name: "Overviews", val: "✗ Unlisted", state: "miss" },
        ],
      },
      after: {
        score: 95,
        reply: "Ranchi Neuro Care near Bariatu provides outpatient EEG diagnostics, post-stroke neuro recovery & direct WhatsApp slot booking.",
        signalNote: "Condition FAQs + MedicalClinic schema extracted cleanly",
        engines: [
          { icon: "ico-chatgpt", name: "ChatGPT", val: "✓ Services", state: "ok" },
          { icon: "ico-gemini", name: "Gemini", val: "✓ Top Local", state: "ok" },
          { icon: "ico-aimode", name: "AI Mode", val: "✓ Highlight", state: "ok" },
          { icon: "ico-gmaps", name: "Overviews", val: "✓ Quoted", state: "ok" },
        ],
      },
    },
    {
      prompt: "“Ranchi Neuro Care OPD timings, doctor credentials & reviews”",
      before: {
        score: 40,
        reply: "Third-party aggregator snippet with incomplete clinic hours and outdated or missing consultation info.",
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
        reply: "Ranchi Neuro Care · Verified Bariatu OPD hours, specialist credentials, 4.9★ Google Business Profile reviews & instant booking link.",
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
      aiRingArc.setAttribute("stroke", aiMode === "before" ? "#FF6B6B" : "#38E1C6");
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

  // ── Slide 9: Monthly Retainer Improvement Data + 2 Free Blogs/Month ───
  const WATCH_PHASES = [
    {
      visitors: "180",
      visDelta: "M0 Launch Baseline",
      calls: "18",
      callDelta: "Initial OPD taps",
      maps: "35",
      share: "14%",
      delta: "M0 Baseline",
      note: "✓ M0 Launch: GA4 analytics installed + baseline across 25 Ranchi prompts",
      chatgpt: 12, gemini: 18, aio: 11, dash: 365, dotX: 36, dotY: 62,
      blogBadge: "BLOG QUEUE READY",
      blog1Title: "Blog #1: 5 Early Stroke Warning Signs Every Family Should Know",
      blog1Status: "Scheduled M1",
      blog2Title: "Blog #2: When Recurring Migraines Need an EEG Consultation",
      blog2Status: "Scheduled M1",
    },
    {
      visitors: "460",
      visDelta: "▲ +155% vs M0",
      calls: "52",
      callDelta: "▲ 2.8× patient taps",
      maps: "90",
      share: "29%",
      delta: "▲ +15% vs M0",
      note: "✓ M1 Report: 460 GA4 visitors · 52 WhatsApp/Call taps · 2 free blogs published",
      chatgpt: 28, gemini: 34, aio: 25, dash: 245, dotX: 152, dotY: 43,
      blogBadge: "2 FREE BLOGS PUBLISHED · M1",
      blog1Title: "Blog #1: 5 Early Stroke Warning Signs Every Family Should Know",
      blog1Status: "Published ✓",
      blog2Title: "Blog #2: When Recurring Migraines Need an EEG Consultation",
      blog2Status: "Published ✓",
    },
    {
      visitors: "890",
      visDelta: "▲ +394% vs M0",
      calls: "104",
      callDelta: "▲ 5.7× patient taps",
      maps: "175",
      share: "46%",
      delta: "▲ +32% vs M0",
      note: "✓ M2 Report: 890 GA4 visitors · 104 WhatsApp/Call taps · 4 free blogs live",
      chatgpt: 44, gemini: 52, aio: 42, dash: 122, dotX: 268, dotY: 23,
      blogBadge: "4 FREE BLOGS PUBLISHED · M2",
      blog1Title: "Blog #3: Epilepsy & Seizure First-Aid Guide for Ranchi Families",
      blog1Status: "Published ✓",
      blog2Title: "Blog #4: Cervical Spondylosis & Nerve Pain Treatment Options",
      blog2Status: "Published ✓",
    },
    {
      visitors: "1,420",
      visDelta: "▲ +688% vs M0",
      calls: "165",
      callDelta: "▲ 9.1× patient taps",
      maps: "280",
      share: "58%",
      delta: "▲ +44% vs M0",
      note: "✓ M3 Improvement Report: 1,420 GA4 visitors · 165 patient taps · 6 blogs live",
      chatgpt: 56, gemini: 64, aio: 54, dash: 0, dotX: 386, dotY: 12,
      blogBadge: "6 FREE BLOGS LIVE BY M3",
      blog1Title: "Blog #5: Post-Stroke Neuro Rehabilitation & Follow-Up Timeline",
      blog1Status: "SEO + AI Indexed ✓",
      blog2Title: "Blog #6: Vertigo vs. Neurological Dizziness — When to Visit OPD",
      blog2Status: "SEO + AI Indexed ✓",
    },
  ];

  let watchUserInteracted = false;
  const phaseBtns = document.querySelectorAll("[data-phase]");

  function setWatchPhase(idx) {
    const p = WATCH_PHASES[idx] || WATCH_PHASES[3];
    phaseBtns.forEach((b) => b.classList.toggle("is-active", Number(b.dataset.phase) === idx));

    const elVisitors = document.getElementById("watch-visitors");
    const elVisDelta = document.getElementById("watch-vis-delta");
    const elCalls = document.getElementById("watch-calls");
    const elCallDelta = document.getElementById("watch-call-delta");
    const elMaps = document.getElementById("watch-maps");
    const elShare = document.getElementById("watch-share");
    const elDelta = document.getElementById("watch-delta");
    const elNote = document.getElementById("watch-cycle-note");
    const curvePath = document.getElementById("watch-curve-path");
    const liveDot = document.getElementById("watch-live-dot");

    if (elVisitors) elVisitors.textContent = p.visitors;
    if (elVisDelta) elVisDelta.textContent = p.visDelta;
    if (elCalls) elCalls.textContent = p.calls;
    if (elCallDelta) elCallDelta.textContent = p.callDelta;
    if (elMaps) elMaps.textContent = p.maps;
    if (elShare) elShare.textContent = p.share;
    if (elDelta) elDelta.textContent = p.delta;
    if (elNote) elNote.textContent = p.note;

    const elBlogBadge = document.getElementById("blog-month-badge");
    const elBlogTitle1 = document.getElementById("blog-title-1");
    const elBlogStatus1 = document.getElementById("blog-status-1");
    const elBlogTitle2 = document.getElementById("blog-title-2");
    const elBlogStatus2 = document.getElementById("blog-status-2");
    const elBlogItem1 = document.getElementById("blog-item-1");
    const elBlogItem2 = document.getElementById("blog-item-2");

    if (elBlogBadge) elBlogBadge.textContent = p.blogBadge;
    if (elBlogTitle1) elBlogTitle1.textContent = p.blog1Title;
    if (elBlogStatus1) elBlogStatus1.textContent = p.blog1Status;
    if (elBlogTitle2) elBlogTitle2.textContent = p.blog2Title;
    if (elBlogStatus2) elBlogStatus2.textContent = p.blog2Status;
    if (elBlogItem1) elBlogItem1.classList.toggle("is-live", idx > 0);
    if (elBlogItem2) elBlogItem2.classList.toggle("is-live", idx > 0);

    if (curvePath && liveDot) {
      if (typeof gsap !== "undefined" && !motionPaused) {
        gsap.to(curvePath, { strokeDashoffset: p.dash, duration: 0.55, ease: "power2.out" });
        gsap.to(liveDot, { attr: { cx: p.dotX, cy: p.dotY }, duration: 0.55, ease: "power2.out" });
      } else {
        curvePath.style.strokeDashoffset = String(p.dash);
        liveDot.setAttribute("cx", String(p.dotX));
        liveDot.setAttribute("cy", String(p.dotY));
      }
    }

    [
      { id: "chatgpt", val: p.chatgpt },
      { id: "gemini", val: p.gemini },
      { id: "aio", val: p.aio },
    ].forEach((b) => {
      const pctEl = document.getElementById(`pct-${b.id}`);
      const barEl = document.getElementById(`bar-${b.id}`);
      if (pctEl) pctEl.textContent = `${b.val}%`;
      if (barEl) barEl.style.setProperty("--fill", (b.val / 100).toFixed(2));
    });
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
      ".eyebrow, .hero-title, .h2, .tagline, .lede, .quote-bar, .chip, .card, .p-step, .plat-card, .pill-mini, .story-stage, .ai-theatre, .art-frame, .gate-card, .intake-chip, .commercial, .tile"
    );
    gsap.set(all, { opacity: 1, clearProps: "transform" });
  }

  function runSlideStoryAnimations(slide, index) {
    killStoryAnimations();
    if (!slide || motionPaused || typeof gsap === "undefined") {
      if (index === 8) setWatchPhase(3);
      if (index === 9) slide?.querySelectorAll(".gate-card").forEach((c) => c.classList.add("lit"));
      return;
    }

    // Slide 1: Cover EEG Synaptic Pulse Draw
    if (index === 0) {
      const eeg = slide.querySelector("#cover-eeg-path");
      if (eeg) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.7 });
        activeLoopTl
          .fromTo(eeg, { strokeDashoffset: 480 }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.out" })
          .to(eeg, { opacity: 0.35, duration: 0.5, delay: 0.6 });
      }
    }

    // Slide 2: Animated 4-Step Ranchi Patient Funnel
    if (index === 1) {
      const steps = slide.querySelectorAll(".p-step");
      if (steps.length) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
        steps.forEach((step, idx) => {
          activeLoopTl
            .call(() => {
              steps.forEach((s, j) => s.classList.toggle("is-lit", j === idx));
            })
            .to({}, { duration: 1.05 });
        });
      }
    }

    // Slide 4: Mobile-Friendly Website Booking Cinema (Desktop + Mobile + WhatsApp + Email)
    if (index === 3) {
      const btn = slide.querySelector("#phone-submit-btn");
      const waPkt = slide.querySelector("#cinema-wa-pkt");
      const mailPkt = slide.querySelector("#cinema-mail-pkt");
      const badge = slide.querySelector("#inbox-badge");
      const badgeTxt = slide.querySelector("#inbox-badge-txt");

      if (btn && waPkt && mailPkt) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });
        activeLoopTl
          .call(() => {
            if (badge) badge.setAttribute("fill", "#F5C45E");
            if (badgeTxt) badgeTxt.textContent = "NEW BOOKING";
          })
          .to(btn, { opacity: 0.65, duration: 0.16, yoyo: true, repeat: 1 })
          .set(waPkt, { x: 336, y: 122, opacity: 1 })
          .set(mailPkt, { x: 336, y: 230, opacity: 1 })
          .to(waPkt, { x: 416, y: 78, duration: 0.95, ease: "power2.inOut" }, "send")
          .to(mailPkt, { x: 416, y: 260, duration: 0.95, ease: "power2.inOut" }, "send")
          .call(() => {
            if (badge) badge.setAttribute("fill", "#38E1C6");
            if (badgeTxt) badgeTxt.textContent = "ALERT SENT ✓";
          })
          .to([waPkt, mailPkt], { opacity: 0, duration: 0.3, delay: 0.65 });
      }
    }

    // Slide 5: Auto-flip Before -> After AI Recommendation
    if (index === 4) {
      if (!aiUserInteracted) {
        aiMode = "before";
        aiQueryIdx = 0;
        renderAiConsole(false);
        const tId = setTimeout(() => {
          if (!aiUserInteracted && Reveal.getIndices().h === 4 && !motionPaused) {
            aiMode = "after";
            renderAiConsole(true);
          }
        }, 1250);
        activeTimers.push(tId);
      }
    }

    // Slide 6: Google Business Profile Action Cycler + Glass-Wallet Ads Rupee Stream
    if (index === 5) {
      const r1 = slide.querySelector("#rupee-tok-1");
      const r2 = slide.querySelector("#rupee-tok-2");
      const gbpPills = slide.querySelectorAll("#gbp-actions .gbp-act-pill");
      let pillStep = 0;

      if (r1 && r2) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.45 });
        activeLoopTl
          .call(() => {
            if (gbpPills.length) {
              gbpPills.forEach((p, idx) => p.classList.toggle("is-pulsing", idx === pillStep % gbpPills.length));
              pillStep++;
            }
          })
          .fromTo(r1, { x: 134, opacity: 0 }, { x: 142, opacity: 1, duration: 0.55, ease: "power2.out" })
          .to(r1, { opacity: 0, duration: 0.2 })
          .fromTo(r2, { x: 296, opacity: 0 }, { x: 304, opacity: 1, duration: 0.55, ease: "power2.out" }, "-=0.2")
          .to(r2, { opacity: 0, duration: 0.2, delay: 0.35 });
      }
    }

    // Slide 7: Realistic 21x21 QR Laser Scan + Confetti Burst
    if (index === 6) {
      const beam = slide.querySelector("#qr-scan-beam");
      const starPkt = slide.querySelector("#qr-star-pkt");
      const privPkt = slide.querySelector("#qr-priv-pkt");
      confettiBurst(1430, 500);
      if (beam && starPkt && privPkt) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        activeLoopTl
          .fromTo(beam, { y: 0 }, { y: 116, duration: 0.65, yoyo: true, repeat: 1, ease: "sine.inOut" })
          .set(starPkt, { x: 242, y: 142, opacity: 1 })
          .set(privPkt, { x: 242, y: 198, opacity: 0.25 })
          .to(starPkt, { x: 428, y: 74, duration: 1.0, ease: "power2.inOut" })
          .to(starPkt, { opacity: 0.2, duration: 0.25 })
          .set(privPkt, { x: 242, y: 198, opacity: 1 })
          .to(privPkt, { x: 428, y: 264, duration: 1.0, ease: "power2.inOut" })
          .to(privPkt, { opacity: 0.2, duration: 0.25, delay: 0.45 });
      }
    }

    // Slide 9: Monthly Improvement Data + 2 Free Blogs/Month Stepper
    if (index === 8) {
      if (!watchUserInteracted) {
        setWatchPhase(0);
        [1, 2, 3].forEach((phaseIdx, step) => {
          const tId = setTimeout(() => {
            if (!watchUserInteracted && Reveal.getIndices().h === 8 && !motionPaused) {
              setWatchPhase(phaseIdx);
            }
          }, (step + 1) * 1100);
          activeTimers.push(tId);
        });
      }
    }

    // Slide 10: 4-Gate Medical Pulse Beacon (Horizontal Desktop / Vertical Mobile) + Celebration Confetti
    if (index === 9) {
      confettiBurst(170, 500);
      const beacon = slide.querySelector("#launch-beacon");
      const highway = slide.querySelector(".launch-highway");
      const gates = slide.querySelectorAll(".gate-card");
      if (beacon && highway && gates.length) {
        const mobileMode = isMobileViewport();
        const travelW = Math.max(200, highway.clientWidth - 34);
        const travelH = Math.max(200, highway.clientHeight - 30);

        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        activeLoopTl.call(() => gates.forEach((g) => g.classList.remove("lit")));

        if (mobileMode) {
          activeLoopTl.set(beacon, { x: 0, y: 0 });
          gates.forEach((gate, gi) => {
            const targetY = (gi / (gates.length - 1)) * travelH;
            activeLoopTl
              .to(beacon, { y: targetY, duration: 0.55, ease: "power2.inOut" })
              .call(() => gate.classList.add("lit"))
              .to({}, { duration: 0.35 });
          });
        } else {
          activeLoopTl.set(beacon, { x: 0, y: 0 });
          gates.forEach((gate, gi) => {
            const targetX = (gi / (gates.length - 1)) * travelW;
            activeLoopTl
              .to(beacon, { x: targetX, duration: 0.55, ease: "power2.inOut" })
              .call(() => gate.classList.add("lit"))
              .to({}, { duration: 0.35 });
          });
        }
      }
    }
  }

  // ── Stage Sync + Slide Activation ─────────────────────────────────────
  function updateStage(index) {
    const clamped = Math.max(0, Math.min(SLIDE_STAGE.length - 1, index));
    const cfg = SLIDE_STAGE[clamped];

    if (window.setBayerSlide) window.setBayerSlide(clamped, cfg.warm);
    setDoctorState(cfg.state);

    if (doctorWrap && doctorFlip) {
      if (!motionPaused && typeof gsap !== "undefined") {
        gsap.to(doctorWrap, { x: cfg.x, y: cfg.y, duration: 0.72, ease: "power3.out" });
        gsap.to(doctorFlip, { scaleX: cfg.flip, duration: 0.32, ease: "power2.out" });
      } else {
        doctorWrap.style.transform = `translate(${cfg.x}px, ${cfg.y}px)`;
        doctorFlip.style.transform = `scaleX(${cfg.flip})`;
      }
    }

    if (bubble && bubbleText) {
      bubble.style.setProperty("--tail", cfg.tail);
      bubble.style.left = cfg.bx + "px";
      bubble.style.top = cfg.by + "px";
      bubbleText.textContent = cfg.line;
      if (!motionPaused && typeof gsap !== "undefined") {
        gsap.killTweensOf(bubble);
        gsap.fromTo(
          bubble,
          { y: 12, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.42, delay: 0.2, ease: "back.out(1.4)", clearProps: "transform" }
        );
      } else {
        bubble.style.transform = "none";
        bubble.style.opacity = "1";
      }
    }

    if (mobileBubbleEl) mobileBubbleEl.textContent = cfg.line;
    if (mobileCountEl) {
      mobileCountEl.textContent = String(clamped + 1).padStart(2, "0") + "/" + SLIDE_STAGE.length;
    }

    const pct = (clamped / (SLIDE_STAGE.length - 1)) * 100;
    if (railToken) {
      if (!motionPaused && typeof gsap !== "undefined") {
        gsap.to(railToken, { left: pct + "%", duration: 0.55, ease: "power3.out" });
      } else {
        railToken.style.left = pct + "%";
      }
    }

    railDots.forEach((d, i) => d.classList.toggle("active", i === clamped));
    railLbls.forEach((l, i) => l.classList.toggle("active", i === clamped));
    mobileDotEls.forEach((d, i) => d.classList.toggle("active", i === clamped));
  }

  function onSlideActive(slide, index) {
    updateStage(index);
    runSlideStoryAnimations(slide, index);
    waveDoctor();

    if (!slide) return;
    forceSlideVisible(slide);
    if (motionPaused || typeof gsap === "undefined") return;

    const eyebrows = slide.querySelectorAll(".eyebrow");
    const headings = slide.querySelectorAll(".hero-title, .h2, .tagline, .lede, .quote-bar, .patient-flow-wrap");
    const cards = slide.querySelectorAll(
      ".chip, .card, .plat-card, .pill-mini, .story-stage, .ai-theatre, .art-frame, .gate-card, .intake-chip, .commercial"
    );

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
    onSlideActive(e.currentSlide, e.indexh || 0);
  });

  Reveal.on("slidechanged", (e) => {
    onSlideActive(e.currentSlide, e.indexh || 0);
  });
})();
