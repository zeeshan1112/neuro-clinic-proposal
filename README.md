# Neuro Clinic Digital Launch & AI Visibility Proposal Deck (V2)

Interactive 10-slide HTML/CSS/JS presentation deck built on a custom **DocScale Midnight Clinical Editorial** theme using **Reveal.js (1600×900, `?print-pdf` ready)**, **GSAP 3**, an **8×8 Bayer-dithered WebGL neural-wave backdrop** (`image-rendering: pixelated`), and an evolving animated Neurologist guide (**Dr. Mira**).

## Updating Clinic Branding & Contact Details

Edit `/js/config.js` (`window.DECK_CONFIG`) to customize:
- `clinicName` (default: `Ranchi Neuro Care`)
- `clinicMeta` / `proposalBadge`
- `partnerPhoneDisplay`, `partnerPhoneHref`, `partnerWhatsAppHref`
- `partnerEmail` (`zeeshan.official@gmail.com`) and `partnerEmailHref`

Matching fallback copy also lives in `index.html` so `?print-pdf` and static exports render cleanly even without waiting on JavaScript hydration.

## Local Preview & PDF Export

```bash
python3 -m http.server 4174
```

- Presentation: `http://localhost:4174/`
- PDF Export View: `http://localhost:4174/?print-pdf`
