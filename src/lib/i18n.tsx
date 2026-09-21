import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'hi' | 'mr'

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
]

// Farmer-friendly wording — technical ML terms are deliberately softened rather
// than translated literally.
const DICT: Record<string, Record<Lang, string>> = {
  'nav.home': { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  'nav.myFarm': { en: 'My Farm', hi: 'मेरा खेत', mr: 'माझं शेत' },
  'nav.predict': { en: 'Predict Carbon', hi: 'कार्बन अनुमान', mr: 'कार्बन अंदाज' },
  'nav.recommendations': { en: 'Recommendations', hi: 'सुझाव', mr: 'शिफारशी' },
  'nav.maps': { en: 'Maps & Insights', hi: 'नक्शा और जानकारी', mr: 'नकाशे व माहिती' },
  'nav.learn': { en: 'Learn', hi: 'सीखें', mr: 'शिका' },
  'nav.settings': { en: 'Settings', hi: 'सेटिंग्स', mr: 'सेटिंग्ज' },
  'nav.research': { en: 'Research View', hi: 'शोध दृश्य', mr: 'संशोधन दृश्य' },

  'brand.motto1': { en: 'Soil Today', hi: 'आज की मिट्टी', mr: 'आजची माती' },
  'brand.motto2': { en: 'A Better Tomorrow', hi: 'बेहतर कल', mr: 'उज्ज्वल उद्या' },

  'common.learnMore': { en: 'Learn More', hi: 'और जानें', mr: 'अधिक जाणून घ्या' },
  'common.viewRecommendations': {
    en: 'View Recommendations',
    hi: 'सुझाव देखें',
    mr: 'शिफारशी पहा',
  },

  'greeting.hello': { en: 'Hello, Farmer!', hi: 'नमस्ते, किसान!', mr: 'नमस्कार, शेतकरी!' },
  'greeting.sub': {
    en: 'Healthy soil stores carbon, supports crops, and builds a better future.',
    hi: 'स्वस्थ मिट्टी कार्बन रखती है, फसल को सहारा देती है और बेहतर भविष्य बनाती है।',
    mr: 'निरोगी माती कार्बन साठवते, पिकांना आधार देते आणि उज्ज्वल भविष्य घडवते.',
  },

  'metric.predictedSoc': {
    en: 'Predicted Soil Carbon',
    hi: 'अनुमानित मृदा कार्बन',
    mr: 'अंदाजित मृदा कार्बन',
  },
  'metric.potential': {
    en: 'Carbon Sequestration Potential',
    hi: 'कार्बन संचय क्षमता',
    mr: 'कार्बन साठवण क्षमता',
  },
  'metric.temperature': { en: 'Average Temperature', hi: 'औसत तापमान', mr: 'सरासरी तापमान' },
  'metric.rainfall': { en: 'Rainfall', hi: 'वर्षा', mr: 'पाऊस' },
}

interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('sc.lang') : null
    return (saved as Lang) || 'en'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('sc.lang', l)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback(
    (key: string, fallback?: string) => DICT[key]?.[lang] ?? fallback ?? key,
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
