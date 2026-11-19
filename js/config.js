/**
 * Editable Clinic Proposal Configuration (V2 — DocScale Midnight Clinical Theme)
 * Update clinicName, locality, or contact links below to customize the entire deck.
 * Zero docscale.io / docscale.in URLs; email is zeeshan.official@gmail.com.
 */
window.DECK_CONFIG = {
  clinicName: "Ranchi Neuro Care",
  doctorName: "Dr. Ananya Sinha",
  clinicMeta: "Sample Neurology Clinic · Bariatu Road, Ranchi",
  proposalBadge: "DocScale · Sample Clinic Launch Blueprint",
  partnerBrand: "DocScale",
  partnerAttribution: "Prepared with DocScale",
  partnerPhoneDisplay: "+91 62993 37816",
  partnerPhoneHref: "tel:+916299337816",
  partnerWhatsAppHref:
    "https://wa.me/916299337816?text=Hi%20Zeeshan%2C%20I%27d%20like%20to%20start%20my%20free%20neuro%20clinic%20demo%20website.",
  partnerEmail: "zeeshan.official@gmail.com",
  partnerEmailHref:
    "mailto:zeeshan.official@gmail.com?subject=Neuro%20Clinic%20Digital%20Launch%20Demo",
  /*
   * Optional explicit pricing fields (omitted from first proposal until 48h demo review):
   * launchFee: "₹15,000 – ₹20,000 one-time",
   * watchRetainer: "₹1,500 – ₹6,000 / month",
   * adsManagement: "Flat fee + direct Google spend"
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
