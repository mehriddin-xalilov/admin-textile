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


/**
 * Admin API: .../api/v1/admin. Client API (sayt/mobil) — /admin siz.
 *
 * Manzil ish vaqtida aniqlanadi: panel qaysi domenda ochilgan bo'lsa, API ham
 * o'sha domenning `api.` subdomenidan olinadi. Domen o'zgarsa qayta build shart emas.
 */
function resolveApiRoot(): string {
  const injected = typeof window !== 'undefined' ? (window as any).__API_ROOT : undefined
  if (injected) return String(injected).replace(/\/$/, '')

  const fromEnv = (import.meta.env.VITE_API_ROOT as string) || ''
  const host = typeof window !== 'undefined' ? window.location.hostname : ''
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(host)

  if (!isLocal && host) {
    // admin.motex.uz → api.motex.uz | admin-textile.<ip>.nip.io → api-textile.<ip>.nip.io
    const apiHost = /\.nip\.io$/.test(host)
      ? host.replace(/^admin-textile\./, 'api-textile.')
      : `api.${host.replace(/^admin\./, '')}`

    return `${window.location.protocol}//${apiHost}/api/v1/admin`
  }

  return (fromEnv || 'http://127.0.0.1:8200/api/v1/admin').replace(/\/$/, '')
}

const rawRoot = resolveApiRoot()
const API_V1_ROOT = rawRoot.replace(/\/admin\/?$/, '')

const config = {
  DEFAULT_LANGUAGE: 'uz',
  API_ROOT: rawRoot,
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
