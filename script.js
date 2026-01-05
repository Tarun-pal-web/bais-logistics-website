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
    
  en: {
    aboutTitle: "About Bais Express Logistics",
    aboutText: "Bais Express Logistics is a trusted and growing transport & logistics company based in Indore, providing reliable, fast, and cost-effective logistics solutions across India. We specialize in safe and timely transportation solutions for businesses of all sizes. With a strong network of verified drivers, modern vehicles, and experienced logistics professionals, we ensure smooth movement of goods for Full Truck Load (FTL), Part Load (PTL), and container transport services. Our commitment to transparency, reliability, and customer satisfaction makes us a preferred logistics partner nationwide.",
    servicesDesc: "We provide reliable, fast, and cost-effective logistics solutions across India. Our wide range of transport services is designed to meet the needs of businesses of all sizes, ensuring safe and timely delivery of goods."
  },

  hi: {
    aboutTitle: "Bais Express Logistics के बारे में",
    aboutText: "Bais Express Logistics इंदौर में स्थित एक विश्वसनीय और तेजी से बढ़ती ट्रांसपोर्ट एवं लॉजिस्टिक्स कंपनी है, जो पूरे भारत में सुरक्षित, तेज़ और किफायती लॉजिस्टिक्स सेवाएं प्रदान करती है। हम सभी आकार के व्यवसायों के लिए समय पर और सुरक्षित परिवहन समाधान प्रदान करते हैं। अनुभवी ड्राइवरों, आधुनिक वाहनों और मजबूत नेटवर्क के साथ, हम फुल ट्रक लोड (FTL), पार्ट लोड (PTL) और कंटेनर ट्रांसपोर्ट सेवाएं उपलब्ध कराते हैं। हमारी विश्वसनीयता, पारदर्शिता और ग्राहक संतुष्टि हमें देशभर में एक पसंदीदा लॉजिस्टिक्स पार्टनर बनाती है।",
    servicesDesc: "हम पूरे भारत में भरोसेमंद, तेज़ और किफायती लॉजिस्टिक्स समाधान प्रदान करते हैं। हमारी सेवाएं सभी प्रकार के व्यवसायों की जरूरतों को ध्यान में रखकर डिजाइन की गई हैं, जिससे सामान सुरक्षित और समय पर डिलीवर किया जा सके।"
  },
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


