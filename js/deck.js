/**
 * V3 Story-Driven Deck Engine
 * - Reveal.js 5.1.0 (1600x900) + GSAP 3.12.5
 * - Never leaves elements at opacity: 0 (uses clearProps + instant reset)
 * - Evolving Dr. Mira guide + TripVan-inspired confetti bursts + 4-platform icons
 */
(function initDeckV3() {
  const isPrint = window.location.search.includes("print-pdf");
  if (isPrint) {
    document.documentElement.classList.add("print-pdf");
  }

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
    pdfSeparateFragments: false,
  });

  const SLIDE_STAGE = [
    {
      label: "01 Intro",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "planning", warm: 0.10,
      line: "Welcome Dr. Shiwangi! Let’s map how we help launch your Ranchi neuro clinic.",
    },
    {
      label: "02 How We Help",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "planning", warm: 0.08,
      line: "You focus on neurology and patient care; we build your entire digital patient funnel.",
    },
    {
      label: "03 Offerings",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "planning", warm: 0.16,
      line: "Clear menu: One-Time Clinic Launch upfront, plus optional Monthly AI Watch & Analytics.",
    },
    {
      label: "04 Website",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "connected", warm: 0.14,
      line: "One mobile tap opens pre-filled WhatsApp chat AND emails full patient details to you.",
    },
    {
      label: "05 AI Search",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "illuminated", warm: 0.22,
      line: "Structured Physician schema + hubs teach ChatGPT, Gemini & Google AI Mode to recommend you.",
    },
    {
      label: "06 GBP & Ads",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "leading", warm: 0.36,
      line: "GBP puts you on Maps free; Google Ads spend comes from your own card with full review access.",
    },
    {
      label: "07 QR Reviews",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "celebrating", warm: 0.62,
      line: "Happy patients boost your 5★ Maps rating; 1–3★ alerts stay private so you fix issues fast!",
    },
    {
      label: "08 One-Time",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "leading", warm: 0.28,
      line: "Everything in your One-Time Launch Setup—with ₹0 charged until your 48h demo is approved.",
    },
    {
      label: "09 Monthly",
      x: 1315, y: 472, flip: 1, bx: 1272, by: 298, tail: "64%",
      state: "illuminated", warm: 0.30,
      line: "Monthly Retainer pairs weekly 4-engine AI monitoring with Google Site Analytics & ongoing care.",
    },
    {
      label: "10 Start",
      x: 52, y: 472, flip: -1, bx: 32, by: 298, tail: "32%",
      state: "inviting", warm: 0.68,
      line: "Share 5 quick details on WhatsApp and review your custom preview before paying a rupee!",
    },
  ];

  const BONUS_TIPS = [
    "85%+ of Tier-2 clinic searches happen on 4G mobile—fast sites double WhatsApp consultations.",
    "Getting your first 20–30 five-star Maps reviews is the fastest Day-1 ranking lever in Ranchi.",
    "Google Analytics (GA4) lets you see exact visitor counts, Maps clicks & WhatsApp taps monthly.",
    "Schema JSON-LD + Bing/OpenAI hubs prevent AI tools from quoting outdated hospital hours.",
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
  let motionPaused = prefersReduced || isPrint;
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
  }

  function confettiBurst(cx, cy) {
    if (!stageEl || isPrint || motionPaused || typeof gsap === "undefined" || isMobileViewport()) return;
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
    if (isPrint || motionPaused || typeof gsap === "undefined") return;

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
    if (isPrint || motionPaused || typeof gsap === "undefined") return;
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
        reply: "Ranchi Neuro Care · Verified Bariatu OPD hours, specialist credentials, 4.9★ Google reviews & instant booking link.",
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
      if (animateRing && typeof gsap !== "undefined" && !motionPaused && !isPrint) {
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

  // ── Slide 9: Monthly Watch Control Room ───────────────────────────────
  const WATCH_PHASES = [
    {
      share: "14%", delta: "M0 Baseline", accuracy: "62%",
      note: "✓ Baseline logged across 25 Ranchi prompts × 4 AI engines",
      chatgpt: 12, gemini: 18, aio: 11, dash: 290, dotX: 36, dotY: 66,
    },
    {
      share: "29%", delta: "▲ +15% vs M0", accuracy: "100%",
      note: "✓ Shipped M1: Physician JSON-LD + Bing AI & OpenAI Hubs",
      chatgpt: 28, gemini: 34, aio: 25, dash: 195, dotX: 152, dotY: 46,
    },
    {
      share: "46%", delta: "▲ +32% vs M0", accuracy: "100%",
      note: "✓ Shipped M2: Migraine, Epilepsy & Stroke FAQ pages",
      chatgpt: 44, gemini: 52, aio: 42, dash: 95, dotX: 268, dotY: 25,
    },
    {
      share: "58%", delta: "▲ +44% vs M0", accuracy: "100%",
      note: "✓ Monthly PDF report + shipped content & schema fix",
      chatgpt: 56, gemini: 64, aio: 54, dash: 0, dotX: 386, dotY: 14,
    },
  ];

  let watchUserInteracted = false;
  const phaseBtns = document.querySelectorAll("[data-phase]");

  function setWatchPhase(idx) {
    const p = WATCH_PHASES[idx] || WATCH_PHASES[3];
    phaseBtns.forEach((b) => b.classList.toggle("is-active", Number(b.dataset.phase) === idx));

    const elShare = document.getElementById("watch-share");
    const elDelta = document.getElementById("watch-delta");
    const elAcc = document.getElementById("watch-accuracy");
    const elNote = document.getElementById("watch-cycle-note");
    const curvePath = document.getElementById("watch-curve-path");
    const liveDot = document.getElementById("watch-live-dot");

    if (elShare) elShare.textContent = p.share;
    if (elDelta) elDelta.textContent = p.delta;
    if (elAcc) elAcc.textContent = p.accuracy;
    if (elNote) elNote.textContent = p.note;

    if (curvePath && liveDot) {
      if (typeof gsap !== "undefined" && !motionPaused && !isPrint) {
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
      ".eyebrow, .hero-title, .h2, .tagline, .lede, .quote-bar, .chip, .card, .pipe-pill, .plat-card, .pill-mini, .story-stage, .ai-theatre, .art-frame, .gate-card, .intake-chip, .commercial, .tile"
    );
    gsap.set(all, { opacity: 1, clearProps: "transform" });
  }

  function runSlideStoryAnimations(slide, index) {
    killStoryAnimations();
    if (!slide || isPrint || motionPaused || typeof gsap === "undefined") {
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

    // Slide 4: Website Booking Cinema (WhatsApp + Email)
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
          .set(waPkt, { x: 274, y: 122, opacity: 1 })
          .set(mailPkt, { x: 274, y: 230, opacity: 1 })
          .to(waPkt, { x: 406, y: 78, duration: 0.95, ease: "power2.inOut" }, "send")
          .to(mailPkt, { x: 406, y: 260, duration: 0.95, ease: "power2.inOut" }, "send")
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

    // Slide 6: Glass-Wallet Ads Rupee Stream (Cleanly between card borders)
    if (index === 5) {
      const r1 = slide.querySelector("#rupee-tok-1");
      const r2 = slide.querySelector("#rupee-tok-2");
      if (r1 && r2) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.45 });
        activeLoopTl
          .fromTo(r1, { x: 134, opacity: 0 }, { x: 142, opacity: 1, duration: 0.55, ease: "power2.out" })
          .to(r1, { opacity: 0, duration: 0.2 })
          .fromTo(r2, { x: 296, opacity: 0 }, { x: 304, opacity: 1, duration: 0.55, ease: "power2.out" }, "-=0.2")
          .to(r2, { opacity: 0, duration: 0.2, delay: 0.35 });
      }
    }

    // Slide 7: Smart QR Laser Scan + Confetti Burst
    if (index === 6) {
      const beam = slide.querySelector("#qr-scan-beam");
      const starPkt = slide.querySelector("#qr-star-pkt");
      const privPkt = slide.querySelector("#qr-priv-pkt");
      confettiBurst(1430, 500);
      if (beam && starPkt && privPkt) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        activeLoopTl
          .fromTo(beam, { y: 0 }, { y: 108, duration: 0.65, yoyo: true, repeat: 1, ease: "sine.inOut" })
          .set(starPkt, { x: 240, y: 146, opacity: 1 })
          .set(privPkt, { x: 240, y: 198, opacity: 0.25 })
          .to(starPkt, { x: 428, y: 74, duration: 1.0, ease: "power2.inOut" })
          .to(starPkt, { opacity: 0.2, duration: 0.25 })
          .set(privPkt, { x: 240, y: 198, opacity: 1 })
          .to(privPkt, { x: 428, y: 264, duration: 1.0, ease: "power2.inOut" })
          .to(privPkt, { opacity: 0.2, duration: 0.25, delay: 0.45 });
      }
    }

    // Slide 9: Monthly AI Watch Trajectory Stepper
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
      if (!motionPaused && !isPrint && typeof gsap !== "undefined") {
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
      if (!motionPaused && !isPrint && typeof gsap !== "undefined") {
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
      if (!motionPaused && !isPrint && typeof gsap !== "undefined") {
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
    if (isPrint || motionPaused || typeof gsap === "undefined") return;

    const eyebrows = slide.querySelectorAll(".eyebrow");
    const headings = slide.querySelectorAll(".hero-title, .h2, .tagline, .lede, .quote-bar");
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
