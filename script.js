// =====================================
// LANGUAGE SWITCH – FINAL (PRODUCTION)
// =====================================

// All translations
const translations = {
  en: {
    // NAV
    navHome: "Home",
    navAbout: "About",
    navServices: "Services",
    navContact: "Contact",
    navLogin: "Dashboard",

    // HERO
    heroTitle: "Trusted Transport & Logistics Services Across India",
    heroSub: "📍 Indore, Madhya Pradesh | ✓ Verified Transporter",

    // ABOUT
    aboutTitle: "About Bais Express Logistics",
    aboutText:
      "Bais Express Logistics is a trusted transport company based in Indore, providing reliable logistics services across India.",
    partnersTitle: "Our Associated Partners",

    // SERVICES
    servicesTitle: "Our Services",

    // CONTACT
    contactTitle: "Contact Us",
    requestBtn: "Request Call",

    // LOCATIONS
    locationsTitle: "ONLINE TRUCK BOOKING IN",

    // FOOTER
    footerText: "© 2019 Bais Express Logistics | All Rights Reserved"
  },

  hi: {
    // NAV
    navHome: "होम",
    navAbout: "हमारे बारे में",
    navServices: "सेवाएं",
    navContact: "संपर्क करें",
    navLogin: "डैशबोर्ड",

    // HERO
    heroTitle: "पूरे भारत में विश्वसनीय परिवहन और लॉजिस्टिक्स सेवाएं",
    heroSub: "📍 इंदौर, मध्य प्रदेश | ✓ सत्यापित ट्रांसपोर्टर",

    // ABOUT
    aboutTitle: "Bais Express Logistics के बारे में",
    aboutText:
      "Bais Express Logistics इंदौर स्थित एक विश्वसनीय परिवहन कंपनी है, जो पूरे भारत में लॉजिस्टिक्स सेवाएं प्रदान करती है।",
    partnersTitle: "हमारे सहयोगी भागीदार",

    // SERVICES
    servicesTitle: "हमारी सेवाएं",

    // CONTACT
    contactTitle: "संपर्क करें",
    requestBtn: "कॉल का अनुरोध करें",

    // LOCATIONS
    locationsTitle: "ऑनलाइन ट्रक बुकिंग",

    // FOOTER
    footerText: "© 2019 Bais Express Logistics | सर्वाधिकार सुरक्षित"
  }
};

// ===============================
// APPLY SAVED LANGUAGE ON LOAD
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("siteLanguage") || "en";
  applyLanguage(savedLang);
});

// ===============================
// CHANGE LANGUAGE
// ===============================
function setLanguage(lang) {
  localStorage.setItem("siteLanguage", lang);
  applyLanguage(lang);
}

// ===============================
// APPLY LANGUAGE TO PAGE
// ===============================
function applyLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");

    // Safe fallback (never blank text)
    el.innerText =
      translations[lang]?.[key] ||
      translations["en"]?.[key] ||
      el.innerText;
  });
}
