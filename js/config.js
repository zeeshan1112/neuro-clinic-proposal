/**
 * Editable Clinic Proposal Configuration
 * Update clinicName, doctorName, locality, or contact links below to customize
 * the entire deck in seconds. Matching fallback text lives in index.html so
 * ?print-pdf and no-JS snapshots render identically.
 */
window.DECK_CONFIG = {
  clinicName: "Ranchi Neuro Care",
  doctorName: "Dr. Ananya Sinha",
  credentials: "MD, DM (Neurology)",
  doctorFull: "Dr. Ananya Sinha, MD, DM (Neurology)",
  locality: "Bariatu Road, Ranchi",
  city: "Ranchi",
  clinicMeta: "Dr. Ananya Sinha, MD, DM (Neurology) · Bariatu Road, Ranchi",
  proposalBadge: "Sample Clinic Proposal · Ranchi",
  partnerBrand: "DocScale",
  partnerPhoneDisplay: "+91 62993 37816",
  partnerPhoneHref: "tel:+916299337816",
  partnerWhatsAppHref:
    "https://wa.me/916299337816?text=Hi%20Zeeshan%2C%20I%27d%20like%20to%20start%20my%20free%20neuro%20clinic%20demo%20website.",
  partnerEmail: "contact@docscale.in",
  partnerEmailHref:
    "mailto:contact@docscale.in?subject=Neuro%20Clinic%20Digital%20Launch%20Demo",
  partnerSite: "https://docscale.io",
  partnerSiteLabel: "docscale.io",
  /*
   * Optional future pricing fields (kept omitted on first proposal):
   * launchFee: "₹18,000 one-time",
   * watchRetainer: "₹2,500 – ₹6,000 / month",
   * adsManagement: "₹5,000 / month + direct ad spend"
   */
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
