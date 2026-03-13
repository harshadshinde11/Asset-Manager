export type Language = "en" | "hi" | "mr" | "ta" | "ml" | "bn" | "kn" | "te";

export const LANGUAGES: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  ta: "தமிழ்",
  ml: "മലയാളം",
  bn: "বাংলা",
  kn: "ಕನ್ನಡ",
  te: "తెలుగు",
};

const T: Record<string, Partial<Record<Language, string>>> = {
  app_name: { en: "KrishiCopilot AI", hi: "कृषि कोपायलट AI", mr: "कृषी कोपायलट AI", ta: "கிருஷி கோபைலட் AI" },
  tagline: { en: "The Intelligent Farming Decision Assistant", hi: "बुद्धिमान कृषि निर्णय सहायक", mr: "बुद्धिमान शेती निर्णय सहाय्यक", ta: "புத்திசாலி விவசாய முடிவு உதவியாளர்" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड", ta: "டாஷ்போர்டு", ml: "ഡാഷ്ബോർഡ്", bn: "ড্যাশবোর্ড", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", te: "డాష్‌బోర్డ్" },
  crops: { en: "Crops", hi: "फसलें", mr: "पिके", ta: "பயிர்கள்", ml: "വിളകൾ", bn: "ফসল", kn: "ಬೆಳೆಗಳು", te: "పంటలు" },
  market: { en: "Market", hi: "बाजार", mr: "बाजार", ta: "சந்தை", ml: "മാർക്കറ്റ്", bn: "বাজার", kn: "ಮಾರುಕಟ್ಟೆ", te: "మార్కెట్" },
  weather: { en: "Weather", hi: "मौसम", mr: "हवामान", ta: "வானிலை", ml: "കാലാവസ്ഥ", bn: "আবহাওয়া", kn: "ಹವಾಮಾನ", te: "వాతావరణం" },
  chatbot: { en: "Chatbot", hi: "चैटबॉट", mr: "चॅटबॉट", ta: "சாட்போட்", ml: "ചാറ്റ്ബോട്ട്", bn: "চ্যাটবট", kn: "ಚಾಟ್‌ಬಾಟ್", te: "చాట్‌బాట్" },
  voice: { en: "Voice Assistant", hi: "वॉइस असिस्टेंट", mr: "व्हॉइस असिस्टंट", ta: "குரல் உதவியாளர்", ml: "വോയ്‌സ് അസിസ്റ്റന്റ്", bn: "ভয়েস অ্যাসিস্ট্যান্ট", kn: "ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್", te: "వాయిస్ అసిస్టెంట్" },
  pest: { en: "Pest Detection", hi: "कीट पहचान", mr: "कीड ओळख", ta: "பூச்சி கண்டறிதல்", ml: "കീടനിർണ്ണയം", bn: "কীট সনাক্তকরণ", kn: "ಕೀಟ ಪತ್ತೆ", te: "పురుగు గుర్తింపు" },
  news: { en: "Agri News", hi: "कृषि समाचार", mr: "कृषी बातम्या", ta: "விவசாய செய்தி", ml: "കാർഷിക വാർത്ത", bn: "কৃষি সংবাদ", kn: "ಕೃಷಿ ಸುದ್ದಿ", te: "వ్యవసాయ వార్తలు" },
  farmer_market: { en: "Farmer Market", hi: "किसान बाजार", mr: "शेतकरी बाजार", ta: "விவசாயி சந்தை", ml: "കർഷക മാർക്കറ്റ്", bn: "কৃষক বাজার", kn: "ರೈತ ಮಾರ್ಕೆಟ್", te: "రైతు మార్కెట్" },
  land: { en: "Land Market", hi: "जमीन बाजार", mr: "जमीन बाजार", ta: "நில சந்தை", ml: "ഭൂമി മാർക്കറ്റ്", bn: "জমি বাজার", kn: "ಭೂ ಮಾರ್ಕೆಟ್", te: "భూమి మార్కెట్" },
  shops: { en: "Nearby Shops", hi: "पास की दुकानें", mr: "जवळील दुकाने", ta: "அருகிலுள்ள கடைகள்", ml: "സമீപ കടകൾ", bn: "কাছাকাছি দোকান", kn: "ಹತ್ತಿರದ ಅಂಗಡಿಗಳು", te: "దగ్గర దుకాణాలు" },
  simulate: { en: "Simulate", hi: "सिमुलेशन", mr: "सिम्युलेशन", ta: "உருமாதிரி", ml: "സിമുലേഷൻ", bn: "সিমুলেশন", kn: "ಸಿಮ್ಯುಲೇಶನ್", te: "సిమ్యులేషన్" },
  biofertilizer: { en: "Biofertilizer Guide", hi: "जैव उर्वरक गाइड", mr: "जैव खत मार्गदर्शिका", ta: "உயிர் உரம் வழிகாட்டி", ml: "ജൈവ വളം ഗൈഡ്", bn: "জৈব সার গাইড", kn: "ಜೈವ ರಸಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ", te: "జీవ ఎరువు గైడ్" },
  get_started: { en: "Get Started", hi: "शुरू करें", mr: "सुरू करा", ta: "தொடங்கு", ml: "ആരംഭിക്കുക", bn: "শুরু করুন", kn: "ಪ್ರಾರಂಭಿಸಿ", te: "ప్రారంభించండి" },
  submit: { en: "Submit", hi: "सबमिट करें", mr: "सबमिट करा", ta: "சமர்ப்பி", ml: "സമർപ്പിക്കുക", bn: "জমা দিন", kn: "ಸಲ್ಲಿಸಿ", te: "సమర్పించు" },
  analyze: { en: "Analyze Market", hi: "बाजार विश्लेषण", mr: "बाजार विश्लेषण", ta: "சந்தை பகுப்பாய்வு" },
  send: { en: "Send", hi: "भेजें", mr: "पाठवा", ta: "அனுப்பு", ml: "അയക്കുക", bn: "পাঠান", kn: "ಕಳುಹಿಸು", te: "పంపు" },
  clear: { en: "Clear Chat", hi: "चैट साफ करें", mr: "चॅट साफ करा", ta: "அரட்டையை அழி" },
  detect_pest: { en: "Detect Pest", hi: "कीट पहचानें", mr: "कीड ओळखा", ta: "பூச்சியை கண்டறி" },
  search: { en: "Search", hi: "खोज", mr: "शोध", ta: "தேடு", ml: "തിരയുക", bn: "অনুসন্ধান", kn: "ಹುಡುಕು", te: "వెతుకు" },
  add_listing: { en: "Add Listing", hi: "लिस्टिंग जोड़ें", mr: "नोंदणी जोडा", ta: "பட்டியல் சேர்" },
  call_farmer: { en: "Call Farmer", hi: "किसान को कॉल करें", mr: "शेतकऱ्याला कॉल करा", ta: "விவசாயியை அழைக்க" },
  whatsapp: { en: "WhatsApp", hi: "व्हाट्सएप", mr: "व्हाट्सएप", ta: "வாட்ஸாப்" },
  fertilizer_shops: { en: "Fertilizer Shops", hi: "उर्वरक दुकानें", mr: "खत दुकाने", ta: "உரக்கடைகள்" },
  scheme: { en: "Government Schemes", hi: "सरकारी योजनाएं", mr: "सरकारी योजना", ta: "அரசாங்க திட்டங்கள்" },
  apply_now: { en: "Apply Now", hi: "अभी आवेदन करें", mr: "आता अर्ज करा", ta: "இப்போது விண்ணப்பிக்கவும்" },
};

export function translate(key: string, lang: Language): string {
  const entry = T[key];
  if (!entry) return key;
  return entry[lang] || entry["en"] || key;
}
