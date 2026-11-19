# Neuro Clinic Digital Launch & AI Visibility Proposal Deck (V6)

Interactive 10-slide HTML/CSS/JS presentation deck for an upcoming **Neurology & Neurosurgery Clinic in Ranchi, Jharkhand** (`Ranchi Neuro Care`), built in the **Warm Editorial Forest-Slate & Champagne Gold** theme using **Reveal.js (1600×900)**, **GSAP 3**, an **8×8 Bayer-dithered WebGL horizon-ridge & starry-sky backdrop**, an animated **Medical Care Van** (`#van` on the route rail, `#bigvan` driving across the stage on transitions, `#roadvan` driving the Slide 10 winding highway, and `#m-van` on the mobile rail), evolving guide **Dr. Mira**, the actual **DocScale logo**, realistic **QR code**, and official platform emblems (**Google Business Profile, Google Maps, Google Ads, Google Analytics GA4, ChatGPT, Google Gemini, Google AI Mode, WhatsApp**).

## Updating Clinic Branding & Contact Details

Edit `/js/config.js` (`window.DECK_CONFIG`) to customize:
- `clinicName` (default: `Ranchi Neuro Care` — editable sample clinic name)
- `clinicSpecialty` / `proposalBadge`
- `partnerPhoneDisplay`, `partnerPhoneHref`, `partnerWhatsAppHref`
- `partnerEmail` (`zeeshan.official@gmail.com`) and `partnerEmailHref`

Matching fallback copy lives in `index.html` with cache-busted asset query params (`?v=6`).

## Local Preview

```bash
python3 -m http.server 4175
```

- Presentation: `http://localhost:4175/`
