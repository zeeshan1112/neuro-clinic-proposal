# Neuro Clinic Digital Launch & AI Visibility Proposal Deck

Interactive 10-slide HTML/CSS/JS presentation deck built with **Reveal.js (1600×900, `?print-pdf` ready)**, **GSAP 3**, and a **pixelated WebGL 4×4 Bayer-dithered topographical backdrop** (`image-rendering: pixelated`).

## Updating Clinic Branding & Contact Details

Edit `/js/config.js` (`window.DECK_CONFIG`) to customize:
- `clinicName` (default: `Ranchi Neuro Care`)
- `doctorName` / `credentials` / `clinicMeta`
- `locality` / `city`
- `partnerPhoneDisplay`, `partnerPhoneHref`, `partnerWhatsAppHref`, `partnerEmail`, `partnerEmailHref`

Matching fallback copy also lives in `index.html` so `?print-pdf` and static exports render cleanly even without waiting on JavaScript hydration.

## Local Preview & PDF Export

```bash
python3 -m http.server 4173
```

- Presentation: `http://localhost:4173/`
- PDF Export View: `http://localhost:4173/?print-pdf`
