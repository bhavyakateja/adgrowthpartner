"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const LOCALES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ur", label: "Urdu", native: "اردو", rtl: true },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "mai", label: "Maithili", native: "मैथिली" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्" },
  { code: "kok", label: "Konkani", native: "कोंकणी" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
  { code: "ks", label: "Kashmiri", native: "کٲشُر", rtl: true },
  { code: "sd", label: "Sindhi", native: "سنڌي", rtl: true },
  { code: "mni", label: "Manipuri", native: "মৈতৈলোন্" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

const en = {
  "nav.home": "Home",
  "nav.solutions": "Solutions",
  "nav.work": "Work",
  "nav.insights": "Insights",
  "nav.who": "Who We Are",
  "nav.careers": "Careers",
  "nav.contact": "Contact",
  "nav.language": "Language",
  "nav.menu": "Menu",
  "nav.close": "Close menu",
  "cta.start": "Start a Conversation",
  "cta.work": "Explore Our Work",
  "footer.navigate": "Navigate",
  "footer.policies": "Policies",
  "footer.connect": "Connect",
  "footer.sitemap": "Sitemap",
  "footer.credit": "Crafted & engineered by",
} as const;

export type TranslationKey = keyof typeof en;

type Dictionary = Partial<Record<TranslationKey, string>>;

const dictionaries: Partial<Record<LocaleCode, Dictionary>> = {
  en,

  hi: {
    "nav.home": "होम",
    "nav.solutions": "समाधान",
    "nav.work": "काम",
    "nav.insights": "विचार",
    "nav.who": "हम कौन हैं",
    "nav.careers": "करियर",
    "nav.contact": "संपर्क",
    "nav.language": "भाषा",
    "nav.menu": "मेन्यू",
    "cta.start": "बातचीत शुरू करें",
    "cta.work": "हमारा काम देखें",
    "footer.navigate": "नेविगेट",
    "footer.policies": "नीतियाँ",
    "footer.connect": "जुड़ें",
    "footer.sitemap": "साइटमैप",
  },

  mr: {
    "nav.home": "मुख्यपृष्ठ",
    "nav.solutions": "उपाय",
    "nav.work": "कार्य",
    "nav.insights": "अंतर्दृष्टी",
    "nav.who": "आम्ही कोण",
    "nav.careers": "करिअर",
    "nav.contact": "संपर्क",
    "cta.start": "संवाद सुरू करा",
    "cta.work": "आमचे काम पहा",
  },

  ta: {
    "nav.home": "முகப்பு",
    "nav.solutions": "தீர்வுகள்",
    "nav.work": "பணிகள்",
    "nav.insights": "நுண்ணறிவு",
    "nav.who": "நாங்கள் யார்",
    "nav.careers": "பணிவாய்ப்பு",
    "nav.contact": "தொடர்பு",
    "cta.start": "உரையாடலைத் தொடங்குங்கள்",
    "cta.work": "எங்கள் பணியைப் பாருங்கள்",
  },
};

const STORAGE_KEY = "agp.locale";

function isSupported(code: string): code is LocaleCode {
  return LOCALES.some((locale) => locale.code === code);
}

function detectLocale(): LocaleCode {
  if (typeof window === "undefined") return "en";

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored && isSupported(stored)) {
    return stored;
  }

  const preferred =
    window.navigator.languages ?? [window.navigator.language];

  for (const tag of preferred) {
    const base = tag.split("-")[0]?.toLowerCase();

    if (base && isSupported(base)) {
      return base;
    }
  }

  return "en";
}

type I18nValue = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<LocaleCode>("en");

  useEffect(() => {
    const detected = detectLocale();

    if (detected !== "en") {
      setLocaleState(detected);
    }
  }, []);

  useEffect(() => {
    const meta = LOCALES.find((item) => item.code === locale);

    document.documentElement.lang = locale;
    document.documentElement.dir =
      meta && "rtl" in meta && meta.rtl ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
    window.localStorage.setItem(STORAGE_KEY, code);
    setLocaleState(code);
  }, []);

  const t = useCallback(
    (key: TranslationKey) =>
      dictionaries[locale]?.[key] ?? en[key],
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error(
      "useI18n must be used inside I18nProvider",
    );
  }

  return ctx;
}