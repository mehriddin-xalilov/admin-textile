const genders = [
    {
        label: "Erkak",
        value: "male"
    },
    {
        label: "Ayol",
        value: "female"
    }
];

const socials = [
    { label: "VK", value: "vk" },
    { label: "Facebook", value: "fb" },
    { label: "Instagram", value: "instagram" },
    { label: "Twitter", value: "twitter" },
    { label: "Youtube", value: "youtube" },
    { label: "Telegram", value: "telegram" },
    { label: "Whatsapp", value: "whatsapp" },
    { label: "Linkedin", value: "linkedin" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" }
];

const currencyCodes: Record<string, string> = {
    "860": "UZS",  // O'zbek so'mi
    "840": "USD",  // AQSH dollari
    "978": "EUR",  // Yevro
    "643": "RUB",  // Rossiya rubli
    "826": "GBP",  // Britaniya funti
    "756": "CHF",  // Shveytsariya franki
    "392": "JPY",  // Yaponiya iyenasi
    "156": "CNY",  // Xitoy yuani
    "398": "KZT",  // Qozog'iston tengesi
    "417": "KGS",  // Qirg'iziston somi
    "972": "TJS",  // Tojikiston somoniysi
    "934": "TMT",  // Turkmaniston manati
    "949": "TRY",  // Turkiya lirasi
    "784": "AED",  // BAA dirhami
    "356": "INR",  // Hindiston rupiyasi
    "410": "KRW",  // Janubiy Koreya voni
    "036": "AUD",  // Avstraliya dollari
    "124": "CAD",  // Kanada dollari
    "702": "SGD",  // Singapur dollari
    "344": "HKD",  // Gonkong dollari
    "458": "MYR",  // Malayziya ringgiti
    "764": "THB",  // Tailand bati
    "704": "VND",  // Vetnam dongi
    "818": "EGP",  // Misr funti
    "682": "SAR",  // Saudiya Arabistoni riyoli
    "364": "IRR",  // Eron riyoli
    "586": "PKR",  // Pokiston rupiyasi
    "050": "BDT",  // Bangladesh takasi
    "944": "AZN",  // Ozarbayjon manati
    "981": "GEL",  // Gruziya larisi
    "933": "BYN",  // Belarus rubli
    "980": "UAH",  // Ukraina grivnasi
    "985": "PLN",  // Polsha zlotiysi
    "203": "CZK",  // Chexiya kronasi
    "348": "HUF",  // Vengriya forinti
    "946": "RON",  // Ruminiya leyi
    "975": "BGN",  // Bolgariya levi
    "941": "RSD",  // Serbiya dinori
    "051": "AMD",  // Armaniston drami
};

const weekDays = [
    { label: "Dushanba", value: 'monday' },
    { label: "Seshanba", value: 'tuesday' },
    { label: "Chorshanba", value: 'wednesday' },
    { label: "Payshanba", value: 'thursday' },
    { label: "Juma", value: 'friday' },
    { label: "Shanba", value: 'saturday' },
    { label: "Yakshanba", value: 'sunday' },
];

const months = [
    { label: "Yan", value: 0 },
    { label: "Fev", value: 1 },
    { label: "Mar", value: 2 },
    { label: "Apr", value: 3 },
    { label: "May", value: 4 },
    { label: "Iyun", value: 5 },
    { label: "Iyul", value: 6 },
    { label: "Avg", value: 7 },
    { label: "Sen", value: 8 },
    { label: "Okt", value: 9 },
    { label: "Noy", value: 10 },
    { label: "Dek", value: 11 },
];

const groupTypes = [
    { label: "Oflayn", value: 'offline', color: 'blue' },
    { label: "Onlayn", value: 'online', color: 'purple' },
    { label: "Gibrid", value: 'hybrid', color: 'green' },
];

const scheduleTypes = [
    { label: "Toq kunlar", value: 'odd' },
    { label: "Juft kunlar", value: 'even' },
    { label: "Boshqa", value: 'custom' },
];

const groupStatuses = [
    { label: "Faol", value: 'active' },
    { label: "Yakunlangan", value: 'inactive' },
];

const discountTypes = [
    { label: "Foiz (%)", value: 'percentage' },
    { label: "Summa (fixed)", value: 'fixed' },
];

const discountScopes = [
    { label: "Barcha o'quvchilar", value: 'all' },
    { label: "O'quvchilar soni bo'yicha", value: 'by_count' },
];

const lessonStatuses = [
    { label: "Rejalashtirilgan", value: 'scheduled' },
    { label: "O'tildi", value: 'completed' },
    { label: "Bekor qilindi", value: 'cancelled' },
];

const salaryTypes = [
    { label: "O'zgarmas summa", value: "fixed" },
    { label: "Foiz (%)", value: "percentage" },
    { label: "Dars uchun", value: "per_lesson" },
]

const teacherTypes = [
    { label: "Asosiy", value: "main", color: "blue" },
    { label: "Mentor", value: "mentor", color: "purple" },

]

const assessmentTypes = [
    { label: 'Quiz', value: 'quiz', color: 'blue' },
    { label: 'Imtihon', value: 'exam', color: 'red' },
    { label: 'Kirish imtihoni', value: 'entrance', color: 'purple' },
    { label: 'Mashq', value: 'practice', color: 'green' },
    { label: 'Uy vazifasi tekshiruvi', value: 'homework_check', color: 'orange' },
];

const assessmentScoringTypes = [
    { label: 'Oddiy (Fixed)', value: 'fixed' },
    { label: 'Modul Rush', value: 'module_rush' },
    { label: 'Rasch (Milliy Sertifikat)', value: 'rasch' },
];

const assessmentAccessTypes = [
    { label: "Shaxsiy (guruh/o'quvchi)", value: 'private' },
    { label: 'Ochiq (bepul)', value: 'public_free' },
    { label: "Ochiq (to'lovli)", value: 'public_paid' },
];

const assessmentShowResultsOptions = [
    { label: 'Darhol', value: 'immediately' },
    { label: "Muddat o'tgandan keyin", value: 'after_deadline' },
    { label: "Qo'lda (o'qituvchi tomonidan)", value: 'manual' },
];

const assessmentStatuses = [
    { label: 'Qoralama', value: 'draft', color: 'default' },
    { label: 'Nashr etilgan', value: 'published', color: 'green' },
    { label: 'Yopilgan', value: 'closed', color: 'red' },
];

const questionTypes = [
    { label: "Bitta to’g’ri variant", value: "single_choice" },
    { label: "Bir nechta to’g’ri variant", value: "multi_choice" },
    { label: "Bo’sh joy to’ldirish", value: "fill_blank" },
    { label: "Moslashtirish", value: "matching" },
    { label: "Tartibga solish", value: "ordering" },
    { label: "Insho", value: "essay" },
    { label: "Yozma ish", value: "writing" },
    { label: "Gapirish", value: "speaking" },
    { label: "Eshitish", value: "listening" },
    { label: "O'qish", value: "reading" }
];

const billingTypes = [
    {
        label: "Oylik",
        value: "monthly"
    },
    {
        label: "Dars uchun",
        value: "per_lesson"
    },
    {
        label: "Bir martalik (to'liq kurs)",
        value: "one_time"
    }
]

const statuses = [
    { label: 'Qoralama', value: 'draft', color: 'default' },
    { label: 'Nashr etilgan', value: 'published', color: 'green' },
    { label: 'Yopilgan', value: 'closed', color: 'red' },
];

const currencies = [
    { label: 'UZS', value: 'UZS' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'RUB', value: 'RUB' },
    // { label: 'GBP', value: 'GBP' },
    // { label: 'CHF', value: 'CHF' },
    // { label: 'JPY', value: 'JPY' },
    // { label: 'CNY', value: 'CNY' },
    // { label: 'KZT', value: 'KZT' },
    // { label: 'KGS', value: 'KGS' },
    // { label: 'TJS', value: 'TJS' },
    // { label: 'TMT', value: 'TMT' },
    // { label: 'TRY', value: 'TRY' },
    // { label: 'AED', value: 'AED' },
    // { label: 'INR', value: 'INR' },
    // { label: 'KRW', value: 'KRW' },
    // { label: 'AUD', value: 'AUD' },
    // { label: 'CAD', value: 'CAD' },
    // { label: 'SGD', value: 'SGD' },
    // { label: 'HKD', value: 'HKD' },
    // { label: 'MYR', value: 'MYR' },
    // { label: 'THB', value: 'THB' },
    // { label: 'VND', value: 'VND' },
    // { label: 'EGP', value: 'EGP' },
    // { label: 'SAR', value: 'SAR' },
    // { label: 'IRR', value: 'IRR' },
    // { label: 'PKR', value: 'PKR' },
    // { label: 'BDT', value: 'BDT' },
    // { label: 'AZN', value: 'AZN' },
    // { label: 'GEL', value: 'GEL' },
    // { label: 'BYN', value: 'BYN' },
    // { label: 'UAH', value: 'UAH' },
    // { label: 'PLN', value: 'PLN' },
    // { label: 'CZK', value: 'CZK' },
    // { label: 'HUF', value: 'HUF' },
    // { label: 'RON', value: 'RON' },
    // { label: 'BGN', value: 'BGN' },
    // { label: 'RSD', value: 'RSD' },
    // { label: 'AMD', value: 'AMD' },
]

const platforms = [
    { value: "youtube", label: "YouTube", color: "red" },
    { value: "instagram", label: "Instagram", color: "purple" },
    { value: "telegram", label: "Telegram", color: "blue" },
    { value: "facebook", label: "Facebook", color: "geekblue" },
    { value: "tiktok", label: "TikTok", color: "volcano" },
    { value: "other", label: "Boshqa", color: "default" },
];

const preferredTimes = [
    { label: "Ertalab", value: "morning" },
    { label: "Tushdan keyin", value: "afternoon" },
    { label: "Kechqurun", value: "evening" },
];

const linkStatuses = [
    { label: "Faol", value: "active", color: "green" },
    { label: "Nofaol", value: "inactive", color: "red" },
];

const lidStatuses = [
    { value: "new", label: "Yangi", color: "blue" },
    { value: "contacted", label: "Bog'lanildi", color: "orange" },
    { value: "interested", label: "Qiziqish bildirdi", color: "green" },
    { value: "enrolled", label: "O'quvchi bo'ldi", color: "green" },
    { value: "rejected", label: "Rad etildi", color: "red" },
];

const colorPalette = [
    "#1e50e7", "#10b981", "#ef4444", "#f59e0b", "#3b82f6",
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b",
    "#06b6d4", "#84cc16", "#e11d48", "#7c3aed", "#0ea5e9",
    "#d97706", "#059669", "#dc2626", "#9333ea", "#0284c7",
];

export default {
    colorPalette,
    platforms,
    preferredTimes,
    linkStatuses,
    lidStatuses,
    currencies,
    statuses,
    socials,
    genders,
    currencyCodes,
    weekDays,
    months,
    groupTypes,
    scheduleTypes,
    billingTypes,
    groupStatuses,
    discountTypes,
    discountScopes,
    lessonStatuses,
    salaryTypes,
    teacherTypes,
    assessmentTypes,
    assessmentScoringTypes,
    assessmentAccessTypes,
    assessmentShowResultsOptions,
    assessmentStatuses,
    questionTypes,
};
