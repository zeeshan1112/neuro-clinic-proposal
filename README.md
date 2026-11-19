# Neuro Clinic Digital Launch & AI Visibility Proposal Deck (V3)

Interactive 10-slide HTML/CSS/JS presentation deck tailored for **Dr. Shiwangi Kashyap** (starting a neuro care clinic in Ranchi, Jharkhand), built on the **DocScale Midnight Clinical Editorial** theme using **Reveal.js (1600×900, `?print-pdf` ready)**, **GSAP 3**, an **8×8 Bayer-dithered WebGL neural-wave backdrop**, evolving Doctor guide **Dr. Mira**, and authentic platform emblems (**Google Business Profile, Google Maps, Google Ads, Google Analytics GA4, ChatGPT, Google Gemini, Google AI Mode, WhatsApp**).

## Updating Clinic Branding & Contact Details

Edit `/js/config.js` (`window.DECK_CONFIG`) to customize:
- `doctorRecipient` (default: `Dr. Shiwangi Kashyap`)
- `clinicName` (default: `Ranchi Neuro Care` — editable sample clinic name)
- `clinicMeta` / `proposalBadge`
- `partnerPhoneDisplay`, `partnerPhoneHref`, `partnerWhatsAppHref`
- `partnerEmail` (`zeeshan.official@gmail.com`) and `partnerEmailHref`

Matching fallback copy lives in `index.html` with cache-busted asset query params (`?v=3`).

## Local Preview & PDF Export

```bash
python3 -m http.server 4175
```

- Presentation: `http://localhost:4175/`
- PDF Export View: `http://localhost:4175/?print-pdf`
