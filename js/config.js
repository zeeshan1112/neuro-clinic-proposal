/**
 * Editable Clinic Proposal Configuration (V3 — Personalized for Dr. Shiwangi Kashyap)
 * Update doctorRecipient, clinicName, locality, or contact links below to customize
 * the entire deck in seconds. Zero docscale.io / docscale.in URLs; email is zeeshan.official@gmail.com.
 */
window.DECK_CONFIG = {
  doctorRecipient: "Dr. Shiwangi Kashyap",
  clinicName: "Ranchi Neuro Care",
  clinicMeta: "Prepared for Dr. Shiwangi Kashyap · Starting a Neuro Care Clinic in Ranchi, Jharkhand",
  proposalBadge: "DocScale · Digital Clinic Launch Proposal",
  partnerBrand: "DocScale",
  partnerAttribution: "Prepared with DocScale",
  partnerPhoneDisplay: "+91 62993 37816",
  partnerPhoneHref: "tel:+916299337816",
  partnerWhatsAppHref:
    "https://wa.me/916299337816?text=Hi%20Zeeshan%2C%20this%20is%20Dr.%20Shiwangi%20Kashyap.%20Let%27s%20start%20my%20free%20neuro%20clinic%20demo%20website.",
  partnerEmail: "zeeshan.official@gmail.com",
  partnerEmailHref:
    "mailto:zeeshan.official@gmail.com?subject=Neuro%20Care%20Clinic%20Ranchi%20%E2%80%94%20Free%20Demo%20Request",
  /*
   * Optional explicit pricing fields (omitted until custom 48h demo approval):
   * oneTimeLaunchFee: "₹15,000 – ₹20,000 one-time",
   * monthlyCareWatch: "₹1,500 – ₹6,000 / month",
   * adsManagementFee: "Flat monthly fee + direct Google ad spend"
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
