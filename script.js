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
      "Bais Express Logistics is a trusted and growing transport & logistics company based in Indore, Madhya Pradesh. We specialize in providing safe, timely, and cost-effective transportation solutions for businesses across India. With a strong network of verified drivers, modern vehicles, and experienced logistics professionals, we ensure smooth movement of goods for full truck load (FTL), part load (PTL), container transport, and heavy vehicle services. Our commitment to transparency, reliability, and customer satisfaction makes us a preferred logistics partner for many leading companies nationwide.",
      serviceText:
      " We provide reliable, fast, and cost-effective logistics solutions across India. Our wide range of transport services is designed to meet the needs of businesses of all sizes, ensuring safe and timely delivery of goods.", partnersTitle: "Our Associated Partners",

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
      "Bais Express Logistics इंदौर, मध्य प्रदेश स्थित एक विश्वसनीय और तेजी से बढ़ती हुई ट्रांसपोर्ट एवं लॉजिस्टिक्स कंपनी है। हम पूरे भारत में सुरक्षित, समय पर और किफायती परिवहन सेवाएं प्रदान करते हैं। हमारे पास सत्यापित ड्राइवरों का मजबूत नेटवर्क, आधुनिक वाहन और अनुभवी लॉजिस्टिक्स टीम है, जो फुल ट्रक लोड (FTL), पार्ट लोड (PTL), कंटेनर ट्रांसपोर्ट और हेवी व्हीकल सेवाओं के लिए माल की सुचारू डिलीवरी सुनिश्चित करती है। पारदर्शिता, भरोसे और ग्राहक संतुष्टि के प्रति हमारी प्रतिबद्धता हमें देशभर की कई प्रमुख कंपनियों का पसंदीदा लॉजिस्टिक्स पार्टनर बनाती है।",
      serviceText:
      "हम पूरे भारत में विश्वसनीय, तेज़ और किफायती लॉजिस्टिक्स समाधान प्रदान करते हैं। हमारी परिवहन सेवाओं की विस्तृत श्रृंखला सभी आकार के व्यवसायों की आवश्यकताओं को ध्यान में रखकर तैयार की गई है,जिससे माल की सुरक्षित और समय पर डिलीवरी सुनिश्चित होती है।",
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


