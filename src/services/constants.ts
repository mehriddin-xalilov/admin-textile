/** Textile domeniga oid lug'atlar. Backend App\Enums bilan bir xil qiymatlar. */

export const ORDER_STATUSES: Record<string, { label: string; color: string }> = {
  new: { label: "Yangi", color: "blue" },
  confirmed: { label: "Tasdiqlangan", color: "cyan" },
  printing: { label: "Bosilmoqda", color: "purple" },
  sewing: { label: "Tikilmoqda", color: "geekblue" },
  ready: { label: "Tayyor", color: "gold" },
  shipped: { label: "Jo'natildi", color: "orange" },
  delivered: { label: "Yetkazildi", color: "green" },
  cancelled: { label: "Bekor qilindi", color: "red" },
};

export const PAYMENT_STATUSES: Record<string, { label: string; color: string }> = {
  unpaid: { label: "To'lanmagan", color: "red" },
  paid: { label: "To'langan", color: "green" },
  refunded: { label: "Qaytarilgan", color: "orange" },
};

export const PAYMENT_METHODS = [
  { value: "cash", label: "Naqd" },
  { value: "payme", label: "Payme" },
  { value: "click", label: "Click" },
  { value: "uzum", label: "Uzum" },
];

export const COUNTRIES = [
  { value: "CN", label: "Xitoy" },
  { value: "TR", label: "Turkiya" },
];

export const GENDERS = [
  { value: "unisex", label: "Uniseks" },
  { value: "male", label: "Erkaklar" },
  { value: "female", label: "Ayollar" },
  { value: "kids", label: "Bolalar" },
];

export const PRODUCT_SIDES = [
  { value: "front", label: "Old" },
  { value: "back", label: "Orqa" },
  { value: "left_sleeve", label: "Chap yeng" },
  { value: "right_sleeve", label: "O'ng yeng" },
];

export const BATCH_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: "Qoralama", color: "default" },
  received: { label: "Qabul qilingan", color: "green" },
};

export const DESIGN_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: "Qoralama", color: "default" },
  ready: { label: "Tayyor", color: "green" },
  archived: { label: "Arxiv", color: "red" },
};

export const CLIPART_CATEGORIES = [
  { value: "shapes", label: "Shakllar" }, { value: "sport", label: "Sport" }, { value: "brand", label: "Brend" },
  { value: "nature", label: "Tabiat" }, { value: "street", label: "Street" }, { value: "uzbek", label: "O'zbekiston" }, { value: "merch", label: "Merch belgilari" }, { value: "general", label: "Umumiy" },
];

export const PHRASE_CATEGORIES = [
  { value: "trend", label: "Trend" }, { value: "motivation", label: "Motivatsiya" }, { value: "humor", label: "Hazil" },
  { value: "love", label: "Sevgi / oila" }, { value: "uzbek", label: "O'zbekiston" }, { value: "sport", label: "Sport" }, { value: "merch", label: "Merch (minimal)" },
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Faol" },
  { value: "inactive", label: "Faol emas" },
];

type StatusMap = Record<string, { label: string; color: string }>;
/** Tag rangi: noma'lum kalit uchun 'default'. */
export const statusColor = (map: StatusMap, key?: string): string => map[key ?? ""]?.color ?? "default";
/** Ko'rsatiladigan nom: noma'lum kalit uchun kalitning o'zi. */
export const statusLabel = (map: StatusMap, key?: string): string => map[key ?? ""]?.label ?? (key ?? "");
