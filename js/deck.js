/**
 * Reveal.js (1600x900) + GSAP Story Animations + Interactive AI Watch Telemetry
 * Keeps every element visible in CSS so ?print-pdf and prefers-reduced-motion
 * always render cleanly without hidden elements.
 */
(function initDeck() {
  const isPrint = window.location.search.includes("print-pdf");
  if (isPrint) {
    document.documentElement.classList.add("print-pdf");
  }

  const isMobileViewport = () => window.innerWidth <= 900;
  let lastMobileState = isMobileViewport();

  const CHAPTERS = [
    { label: "01 · Cover", short: "01 Intro" },
    { label: "02 · Scope", short: "02 Scope" },
    { label: "03 · Discovery", short: "03 Journey" },
    { label: "04 · Website", short: "04 Website" },
    { label: "05 · SEO · AEO · GEO", short: "05 AEO·GEO" },
    { label: "06 · AI Watch", short: "06 AI Watch" },
    { label: "07 · QR Reviews", short: "07 Reviews" },
    { label: "08 · Maps & Ads", short: "08 Maps/Ads" },
    { label: "09 · Launch Plan", short: "09 Roadmap" },
    { label: "10 · Next Steps", short: "10 Start" },
  ];

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

  window.addEventListener("resize", () => {
    const mobileNow = isMobileViewport();
    if (mobileNow !== lastMobileState) {
      lastMobileState = mobileNow;
      Reveal.configure({ disableLayout: mobileNow });
      const idx = Reveal.getIndices().h || 0;
      runSlideStoryAnimations(Reveal.getCurrentSlide(), idx);
    }
  });

  // ── Build Navigation Rails (Desktop + Mobile) ─────────────────────────
  const railEl = document.getElementById("rail");
  const railToken = document.getElementById("rail-token");
  const railDots = [];
  const railLbls = [];

  if (railEl) {
    CHAPTERS.forEach((ch, i) => {
      const pct = (i / (CHAPTERS.length - 1)) * 100;
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.style.left = pct + "%";
      dot.title = ch.label;
      dot.setAttribute("aria-label", ch.label);
      dot.addEventListener("click", () => Reveal.slide(i));
      railEl.appendChild(dot);
      railDots.push(dot);

      const lbl = document.createElement("span");
      lbl.className = "lbl" + (i === 0 ? " active" : "");
      lbl.style.left = pct + "%";
      lbl.textContent = ch.short;
      railEl.appendChild(lbl);
      railLbls.push(lbl);
    });
  }

  const mobileChapterEl = document.getElementById("mobile-chapter");
  const mobileCountEl = document.getElementById("mobile-count");
  const mobileDotsWrap = document.getElementById("mobile-dots");
  const mobilePrevBtn = document.getElementById("mobile-prev");
  const mobileNextBtn = document.getElementById("mobile-next");
  const mobileDotEls = [];

  if (mobileDotsWrap) {
    CHAPTERS.forEach((ch, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = i === 0 ? "active" : "";
      btn.setAttribute("aria-label", ch.label);
      btn.addEventListener("click", () => Reveal.slide(i));
      mobileDotsWrap.appendChild(btn);
      mobileDotEls.push(btn);
    });
  }

  if (mobilePrevBtn) mobilePrevBtn.addEventListener("click", () => Reveal.prev());
  if (mobileNextBtn) mobileNextBtn.addEventListener("click", () => Reveal.next());

  // ── Slide 5: Interactive AI Verdict Console ───────────────────────────
  const AI_SCENARIOS = [
    {
      prompt: "“Who is the best neurologist for migraine and epilepsy treatment in Ranchi?”",
      before: {
        score: 36,
        engines: [
          { name: "ChatGPT", val: "✗ 3 rivals named", state: "miss" },
          { name: "Google Gemini", val: "✗ Not listed", state: "miss" },
          { name: "AI Overviews", val: "⚠ Directory only", state: "warn" },
          { name: "Perplexity", val: "✗ No clinic data", state: "miss" },
        ],
        signals: [
          { label: "Physician & FAQ Schema", val: "✗ Missing", state: "miss" },
          { label: "AI Crawler & llms.txt", val: "⚠ Unconfigured", state: "warn" },
          { label: "Bing & OpenAI Business Hubs", val: "✗ Unclaimed", state: "miss" },
        ],
      },
      after: {
        score: 92,
        engines: [
          { name: "ChatGPT", val: "✓ Cited #1–#2", state: "ok" },
          { name: "Google Gemini", val: "✓ Recommended", state: "ok" },
          { name: "AI Overviews", val: "✓ Clinic & Map", state: "ok" },
          { name: "Perplexity", val: "✓ Source Linked", state: "ok" },
        ],
        signals: [
          { label: "Physician & FAQ Schema", val: "✓ Verified", state: "ok" },
          { label: "AI Crawler & llms.txt", val: "✓ Allowed", state: "ok" },
          { label: "Bing & OpenAI Business Hubs", val: "✓ Synced", state: "ok" },
        ],
      },
    },
    {
      prompt: "“Which clinic near Bariatu Ranchi offers EEG & stroke recovery follow-up?”",
      before: {
        score: 31,
        engines: [
          { name: "ChatGPT", val: "✗ Hospital chains", state: "miss" },
          { name: "Google Gemini", val: "⚠ No service page", state: "warn" },
          { name: "AI Overviews", val: "✗ Skipped", state: "miss" },
          { name: "Perplexity", val: "✗ Outdated info", state: "miss" },
        ],
        signals: [
          { label: "Physician & FAQ Schema", val: "✗ Missing", state: "miss" },
          { label: "AI Crawler & llms.txt", val: "⚠ Unconfigured", state: "warn" },
          { label: "Bing & OpenAI Business Hubs", val: "✗ Unclaimed", state: "miss" },
        ],
      },
      after: {
        score: 94,
        engines: [
          { name: "ChatGPT", val: "✓ Services Cited", state: "ok" },
          { name: "Google Gemini", val: "✓ Top Local Pick", state: "ok" },
          { name: "AI Overviews", val: "✓ Highlighted", state: "ok" },
          { name: "Perplexity", val: "✓ FAQ Quoted", state: "ok" },
        ],
        signals: [
          { label: "Physician & FAQ Schema", val: "✓ Verified", state: "ok" },
          { label: "AI Crawler & llms.txt", val: "✓ Allowed", state: "ok" },
          { label: "Bing & OpenAI Business Hubs", val: "✓ Synced", state: "ok" },
        ],
      },
    },
    {
      prompt: "“Ranchi Neuro Care OPD timings, doctor qualifications & patient reviews”",
      before: {
        score: 42,
        engines: [
          { name: "ChatGPT", val: "⚠ Thin summary", state: "warn" },
          { name: "Google Gemini", val: "⚠ Wrong hours", state: "warn" },
          { name: "AI Overviews", val: "✗ Few reviews", state: "miss" },
          { name: "Perplexity", val: "⚠ Third-party", state: "warn" },
        ],
        signals: [
          { label: "Physician & FAQ Schema", val: "✗ Missing", state: "miss" },
          { label: "AI Crawler & llms.txt", val: "⚠ Unconfigured", state: "warn" },
          { label: "Bing & OpenAI Business Hubs", val: "✗ Unclaimed", state: "miss" },
        ],
      },
      after: {
        score: 96,
        engines: [
          { name: "ChatGPT", val: "✓ Exact OPD Bio", state: "ok" },
          { name: "Google Gemini", val: "✓ 4.9★ & Hours", state: "ok" },
          { name: "AI Overviews", val: "✓ Direct Booking", state: "ok" },
          { name: "Perplexity", val: "✓ Official Site", state: "ok" },
        ],
        signals: [
          { label: "Physician & FAQ Schema", val: "✓ Verified", state: "ok" },
          { label: "AI Crawler & llms.txt", val: "✓ Allowed", state: "ok" },
          { label: "Bing & OpenAI Business Hubs", val: "✓ Synced", state: "ok" },
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
  const aiGridEl = document.getElementById("ai-engine-grid");
  const aiSignalsEl = document.getElementById("ai-signal-rows");
  const aiScoreValEl = document.getElementById("ai-score-val");
  const aiRingArc = document.getElementById("ai-ring-arc");

  function renderAiConsole(animateRing = true) {
    const scenario = AI_SCENARIOS[aiQueryIdx] || AI_SCENARIOS[0];
    const data = scenario[aiMode];
    const cfg = window.DECK_CONFIG || {};
    const clinicName = cfg.clinicName || "Ranchi Neuro Care";

    if (aiPromptEl) {
      aiPromptEl.textContent = scenario.prompt.replace("Ranchi Neuro Care", clinicName);
    }

    aiModeBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.aiMode === aiMode));
    aiQBtns.forEach((b) => b.classList.toggle("is-active", Number(b.dataset.aiQ) === aiQueryIdx));

    if (aiGridEl) {
      aiGridEl.innerHTML = data.engines
        .map(
          (e) => `
          <div class="engine-cell">
            <span class="engine-name">${e.name}</span>
            <span class="verdict-pill is-${e.state}">${e.val}</span>
          </div>`
        )
        .join("");
    }

    if (aiSignalsEl) {
      aiSignalsEl.innerHTML = data.signals
        .map(
          (s) => `
          <div class="signal-row">
            <span>${s.label}</span>
            <span class="verdict-pill is-${s.state}">${s.val}</span>
          </div>`
        )
        .join("");
    }

    const circumference = 182.2;
    const offset = circumference - (data.score / 100) * circumference;
    if (aiRingArc && aiScoreValEl) {
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

  aiModeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      aiUserInteracted = true;
      aiMode = btn.dataset.aiMode || "after";
      renderAiConsole(true);
    });
  });

  aiQBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      aiUserInteracted = true;
      aiQueryIdx = Number(btn.dataset.aiQ) || 0;
      renderAiConsole(true);
    });
  });

  // ── Slide 6: Interactive Monthly Watch Stepper ────────────────────────
  const WATCH_PHASES = [
    {
      share: "14%",
      delta: "Baseline Month 0",
      accuracy: "62%",
      fixTitle: "Initial 25-Prompt Audit & Competitor Map",
      fixTag: "Baseline Benchmark",
      note: "✓ Baseline logged across ChatGPT, Gemini, AI Overviews & Perplexity",
      chatgpt: 12,
      gemini: 18,
      aio: 11,
      perp: 15,
    },
    {
      share: "29%",
      delta: "▲ +15% after Week 2",
      accuracy: "100%",
      fixTitle: "Physician + Clinic JSON-LD & Bing/OpenAI Sync",
      fixTag: "Cycle #01 Shipped Fix",
      note: "✓ Validated structured schema + official AI business hubs live",
      chatgpt: 28,
      gemini: 34,
      aio: 25,
      perp: 29,
    },
    {
      share: "46%",
      delta: "▲ +32% vs Baseline",
      accuracy: "100%",
      fixTitle: "Migraine, Epilepsy & Stroke Answer Pages",
      fixTag: "Cycle #02 Shipped Fix",
      note: "✓ Local Ranchi condition FAQs built to be quoted verbatim by AI",
      chatgpt: 44,
      gemini: 52,
      aio: 42,
      perp: 46,
    },
    {
      share: "58%",
      delta: "▲ +44% vs Baseline",
      accuracy: "100%",
      fixTitle: "Migraine & Stroke FAQ + Bing AI Sync",
      fixTag: "Live Monthly Deliverable",
      note: "✓ Includes monthly PDF diff report + implemented content & schema fix",
      chatgpt: 56,
      gemini: 64,
      aio: 54,
      perp: 58,
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
    const elTitle = document.getElementById("watch-fix-title");
    const elTag = document.getElementById("watch-fix-tag");
    const elNote = document.getElementById("watch-cycle-note");

    if (elShare) elShare.textContent = p.share;
    if (elDelta) elDelta.textContent = p.delta;
    if (elAcc) elAcc.textContent = p.accuracy;
    if (elTitle) elTitle.textContent = p.fixTitle;
    if (elTag) elTag.textContent = p.fixTag;
    if (elNote) elNote.textContent = p.note;

    const bars = [
      { id: "chatgpt", val: p.chatgpt },
      { id: "gemini", val: p.gemini },
      { id: "aio", val: p.aio },
      { id: "perp", val: p.perp },
    ];
    bars.forEach((b) => {
      const pctEl = document.getElementById(`pct-${b.id}`);
      const barEl = document.getElementById(`bar-${b.id}`);
      if (pctEl) pctEl.textContent = `${b.val}%`;
      if (barEl) barEl.style.setProperty("--fill", (b.val / 100).toFixed(2));
    });
  }

  phaseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      watchUserInteracted = true;
      setWatchPhase(Number(btn.dataset.phase) || 0);
    });
  });

  // ── Motion State & Reduced-Motion Control ─────────────────────────────
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let motionPaused = prefersReduced || isPrint;
  const motionToggleBtn = document.getElementById("motion-toggle");

  function syncMotionButton() {
    if (motionToggleBtn) {
      motionToggleBtn.textContent = motionPaused ? "Play Motion" : "Pause Motion";
    }
  }
  syncMotionButton();

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

  function runSlideStoryAnimations(slide, index) {
    killStoryAnimations();
    if (!slide || isPrint || motionPaused || typeof gsap === "undefined") {
      // Ensure static states look crisp and completed when motion is paused or printing
      if (index === 5) setWatchPhase(3);
      if (index === 8) {
        slide?.querySelectorAll(".gate-card").forEach((c) => c.classList.add("lit"));
      }
      return;
    }

    // Slide 3: Discovery Barrier Story
    if (index === 2) {
      const pkt = slide.querySelector("#query-packet");
      const barrier = slide.querySelector("#discovery-barrier");
      const stackPill = slide.querySelector("#launch-stack-pill rect");
      const stackTxt = slide.querySelector("#launch-stack-pill text");
      const cap = slide.querySelector("#discovery-caption");

      if (pkt && barrier) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });
        activeLoopTl
          .call(() => {
            if (cap) cap.textContent = "1. Without a site, patient queries deflect to rivals";
            if (stackPill) stackPill.setAttribute("stroke", "#C5D3E0");
            if (stackTxt) stackTxt.setAttribute("fill", "#4D6277");
          })
          .set(pkt, { x: 152, y: 128, opacity: 1 })
          .set(barrier, { y: 0, opacity: 1 })
          .to(pkt, { x: 200, duration: 0.75, ease: "power2.out" })
          .to(pkt, { x: 295, y: 215, duration: 0.85, ease: "power2.in" })
          .to(pkt, { opacity: 0.35, duration: 0.3 })
          .call(() => {
            if (cap) cap.textContent = "2. Launch Stack lifts the barrier → Booked OPD ✓";
            if (stackPill) stackPill.setAttribute("stroke", "#186A4D");
            if (stackTxt) stackTxt.setAttribute("fill", "#186A4D");
          })
          .to(barrier, { y: -46, opacity: 0.2, duration: 0.55, ease: "power2.out" })
          .set(pkt, { x: 152, y: 128, opacity: 1 })
          .to(pkt, { x: 296, y: 128, duration: 1.0, ease: "power2.inOut" })
          .to({}, { duration: 1.0 });
      }
    }

    // Slide 4: Dual-Lane Booking Router
    if (index === 3) {
      const waPkt = slide.querySelector("#wa-packet");
      const mailPkt = slide.querySelector("#mail-packet");
      const btn = slide.querySelector("#phone-cta-btn");
      const mailBadge = slide.querySelector("#mail-badge");
      if (waPkt && mailPkt) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        activeLoopTl
          .call(() => {
            if (mailBadge) mailBadge.textContent = "Name · Slot · Symptom";
          })
          .to(btn, { opacity: 0.6, duration: 0.16, yoyo: true, repeat: 1 })
          .set(waPkt, { x: 152, y: 92, opacity: 1 })
          .set(mailPkt, { x: 152, y: 140, opacity: 1 })
          .to(waPkt, { x: 274, y: 54, duration: 1.05, ease: "power2.inOut" }, "fly")
          .to(mailPkt, { x: 274, y: 170, duration: 1.05, ease: "power2.inOut" }, "fly")
          .call(() => {
            if (mailBadge) mailBadge.textContent = "Instant Alert Sent ✓";
          })
          .to([waPkt, mailPkt], { opacity: 0, duration: 0.35, delay: 0.65 });
      }
    }

    // Slide 5: Auto-flip Before -> After AI Simulation unless user interacted
    if (index === 4) {
      if (!aiUserInteracted) {
        aiMode = "before";
        aiQueryIdx = 0;
        renderAiConsole(false);
        const t1 = setTimeout(() => {
          if (!aiUserInteracted && Reveal.getIndices().h === 4 && !motionPaused) {
            aiMode = "after";
            renderAiConsole(true);
          }
        }, 1200);
        activeTimers.push(t1);
      }
    }

    // Slide 6: Auto-step Monthly Watch phases unless user interacted
    if (index === 5) {
      if (!watchUserInteracted) {
        setWatchPhase(0);
        [1, 2, 3].forEach((phaseIdx, step) => {
          const tId = setTimeout(() => {
            if (!watchUserInteracted && Reveal.getIndices().h === 5 && !motionPaused) {
              setWatchPhase(phaseIdx);
            }
          }, (step + 1) * 1150);
          activeTimers.push(tId);
        });
      }
    }

    // Slide 7: Smart QR Review Router
    if (index === 6) {
      const starPkt = slide.querySelector("#star-packet");
      const privPkt = slide.querySelector("#priv-packet");
      const qrNode = slide.querySelector("#qr-node");
      if (starPkt && privPkt) {
        activeLoopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        activeLoopTl
          .to(qrNode, { scale: 1.03, transformOrigin: "73px 165px", duration: 0.2, yoyo: true, repeat: 1 })
          .set(starPkt, { x: 140, y: 136, opacity: 1 })
          .set(privPkt, { x: 140, y: 170, opacity: 0.35 })
          .to(starPkt, { x: 258, y: 62, duration: 1.1, ease: "power2.inOut" })
          .to(starPkt, { opacity: 0.2, duration: 0.25 })
          .set(privPkt, { x: 140, y: 170, opacity: 1 })
          .to(privPkt, { x: 258, y: 234, duration: 1.1, ease: "power2.inOut" })
          .to(privPkt, { opacity: 0.2, duration: 0.25, delay: 0.45 });
      }
    }

    // Slide 9: 4-Gate Launch Beacon (Horizontal on Desktop, Vertical Rail on Mobile)
    if (index === 8) {
      const beacon = slide.querySelector("#launch-beacon");
      const highway = slide.querySelector(".launch-highway");
      const gates = slide.querySelectorAll(".gate-card");
      if (beacon && highway && gates.length) {
        const mobileMode = isMobileViewport();
        const travelW = Math.max(200, highway.clientWidth - 36);
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

  function updateChrome(index) {
    const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, index));
    if (window.setBayerSlide) window.setBayerSlide(clamped);

    const pct = (clamped / (CHAPTERS.length - 1)) * 100;
    if (railToken) {
      if (typeof gsap !== "undefined" && !motionPaused && !isPrint) {
        gsap.to(railToken, { left: pct + "%", duration: 0.5, ease: "power3.out" });
      } else {
        railToken.style.left = pct + "%";
      }
    }

    railDots.forEach((d, i) => d.classList.toggle("active", i === clamped));
    railLbls.forEach((l, i) => l.classList.toggle("active", i === clamped));
    mobileDotEls.forEach((d, i) => d.classList.toggle("active", i === clamped));

    if (mobileChapterEl) mobileChapterEl.textContent = CHAPTERS[clamped].label;
    if (mobileCountEl) {
      mobileCountEl.textContent = String(clamped + 1).padStart(2, "0") + "/" + CHAPTERS.length;
    }
  }

  function onSlideActive(slide, index) {
    updateChrome(index);
    runSlideStoryAnimations(slide, index);

    if (isPrint || motionPaused || typeof gsap === "undefined" || !slide) return;

    const eyebrows = slide.querySelectorAll(".eyebrow");
    const headings = slide.querySelectorAll(".hero-title, .h2, .tagline, .lede");
    const cards = slide.querySelectorAll(".chip, .card, .proof-item, .metric-box, .ai-console, .watch-board, .story-stage, .illus-frame, .photo-banner, .gate-card");

    gsap.killTweensOf([...eyebrows, ...headings, ...cards]);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (eyebrows.length) {
      tl.fromTo(eyebrows, { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.32 });
    }
    if (headings.length) {
      tl.fromTo(headings, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.44, stagger: 0.06 }, "-=0.2");
    }
    if (cards.length) {
      tl.fromTo(cards, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, stagger: 0.05 }, "-=0.25");
    }
  }

  if (motionToggleBtn) {
    motionToggleBtn.addEventListener("click", () => {
      motionPaused = !motionPaused;
      syncMotionButton();

      if (motionPaused) {
        if (window.bayerBg) window.bayerBg.pause();
        if (typeof gsap !== "undefined") gsap.globalTimeline.pause();
        killStoryAnimations();
      } else {
        if (window.bayerBg) window.bayerBg.resume();
        if (typeof gsap !== "undefined") gsap.globalTimeline.resume();
        const idx = Reveal.getIndices().h || 0;
        runSlideStoryAnimations(Reveal.getCurrentSlide(), idx);
      }
    });
  }

  Reveal.on("ready", (e) => {
    renderAiConsole(false);
    setWatchPhase(3);
    onSlideActive(e.currentSlide, e.indexh || 0);
  });

  Reveal.on("slidechanged", (e) => {
    onSlideActive(e.currentSlide, e.indexh || 0);
  });
})();
