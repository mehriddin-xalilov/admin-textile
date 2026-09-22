import ruIcon from './src/assets/icon/ru-icon.svg'
import uzIcon from './src/assets/icon/uz-icon.svg'
import enIcon from './src/assets/icon/eng-icon.svg'


const API_LANGUAGES = [
  {
    id: 1,
    name: "O'zbek",
    shortName: "o'zb",
    code: 'uz',
    icon: uzIcon
  },

  {
    id: 2,
    name: 'Русский',
    shortName: 'рус',
    code: 'ru',
    icon: ruIcon
  },
  {
    id: 3,
    name: 'English',
    shortName: 'eng',
    code: 'en',
    icon: enIcon
  },
];


/** Admin API: .../api/v1/admin. Client API (sayt/mobil) — /admin siz. */
const rawRoot = (import.meta.env.VITE_API_ROOT as string) || ''
const API_V1_ROOT = rawRoot.replace(/\/admin\/?$/, '')

const config = {
  DEFAULT_LANGUAGE: 'uz',
  API_ROOT: import.meta.env.VITE_API_ROOT,
  /** `.../api/v1` — o'z-o'zidan balans to'ldirish (v1/payment/...) */
  API_V1_ROOT,
  API_LANGUAGES: API_LANGUAGES,
  FONT_SIZE: 14,
  FONT_FAMILY: 'GT Walsheim Pro',
  SIDEBAR_IMAGE: 'none',
  BORDER_RADIUS: 12,
  SIDEBAR_GRADIENT: 'none',
  BODY_BG: 'none',
  COLOR: '#2563EB',
  THEME: 'light'
};

export default config;
