/**
 * Editable Clinic Proposal Configuration (V6 — Neurology & Neurosurgery Clinic in Ranchi)
 * Update clinicName, locality, or contact links below to customize the deck.
 * Zero docscale.io / docscale.in URLs; email is zeeshan.official@gmail.com.
 */
window.DECK_CONFIG = {
  clinicName: "Ranchi Neuro Care",
  clinicSpecialty: "Neurology & Neurosurgery Clinic · Ranchi, Jharkhand",
  proposalBadge: "DocScale × Digital Clinic Launch Proposal",
  partnerBrand: "DocScale",
  partnerAttribution: "Prepared with DocScale",
  partnerPhoneDisplay: "+91 62993 37816",
  partnerPhoneHref: "tel:+916299337816",
  partnerWhatsAppHref:
    "https://wa.me/916299337816?text=Hi%20Zeeshan%2C%20we%20would%20like%20to%20start%20the%20free%2048-hour%20website%20demo%20for%20our%20neuro%20clinic%20in%20Ranchi.",
  partnerEmail: "zeeshan.official@gmail.com",
  partnerEmailHref:
    "mailto:zeeshan.official@gmail.com?subject=Neuro%20Clinic%20Ranchi%20%E2%80%94%20Free%2048h%20Website%20Demo",
};

document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.DECK_CONFIG || {};
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const key = el.getAttribute("data-bind");
    if (key && cfg[key] !== undefined) {
      el.textContent = cfg[key];
    }
  });
  document.querySelectorAll("[data-bind-href]").forEach((el) => {
    const key = el.getAttribute("data-bind-href");
    if (key && cfg[key] !== undefined) {
      el.setAttribute("href", cfg[key]);
    }
  });
});
