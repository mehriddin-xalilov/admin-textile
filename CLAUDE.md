# Textile Admin — CLAUDE.md

Senior developer guide. Har bir yangi feature yoki bugfix oldidan o'qi. Umumiy qoidalar: [../CLAUDE.md](../CLAUDE.md), backend: [../api/CLAUDE.md](../api/CLAUDE.md).

---

## Loyiha haqida

**Textile Admin** — React 18 + TypeScript + Vite + Ant Design. `makon/admin` asosida, ta'limga oid sahifalar olib tashlangan.

- **API:** `VITE_API_ROOT` (`.env.local`: `http://127.0.0.1:8200/api/v1/admin`)
- **Tillar:** uz, ru, en (i18next, tarjimalar `POST /translations/{lng}` dan yuklanadi, yo'q kalit avtomatik qo'shiladi)
- **Auth:** Passport Bearer token + refresh token (localStorage, refresh eski tokenni bekor qiladi — interceptor navbatni boshqaradi)
- **Ruxsat:** `user.data.permissions: ["orders.update", ...]` → `useAccess('orders')`

---

## Texnologiyalar

| Soha | Texnologiya |
|------|-------------|
| UI | Ant Design 5 (prefixCls `textile`), Tailwind CSS 4 |
| State (server) | TanStack React Query 4 |
| State (client) | Zustand 5 (persist, key `"textile"`) |
| Forms | Formik 2 + Yup |
| Routing | React Router 7 |
| HTTP | Axios (token inject + 401 refresh) |
| Icons | Solar Icons |

---

## Papka tuzilmasi

```
src/
├── components/        Button, Fields.*, Table, Panel, Modal, Tabs, ViewLayout, Pagination, notification...
├── hooks/             useHooks, useGet, usePost, useAccess
├── modules/
│   ├── get.tsx        list sahifalar (items, meta)
│   ├── form.tsx       create/edit (fields[] + onSubmitValue)
│   └── dictionary.tsx oddiy lug'atlar uchun jadval + modal CRUD (ranglar, razmerlar, kategoriyalar)
├── pages/
│   ├── dashboard/     GET /dashboard
│   ├── orders/        index (status segment, qidiruv), view (pozitsiyalar, tarix, holat tugmalari, to'lov)
│   ├── designs/       index, view (preview, canvas JSON, print fayl)
│   ├── catalog/       products (index/form/view: ranglar+variantlar, bosma joylari), categories, colors, sizes
│   ├── inventory/     batches (index/form/view + "Omborga qabul qilish"), stock (variantlar, ±tuzatish)
│   ├── users/         index/form/view (roles, buyurtmalar/dizaynlar tab)
│   ├── settings/      roles (+permissions sync), permissions
│   └── auth, profile, not-found
├── routes/            index.tsx (sidebar + routes + permissions), settings.tsx
└── services/          api, store, storage, helpers, utils, constants.ts (statuslar ↔ backend enum), queryBuilder
```

### Sahifa → API → permission

| Sahifa | API | Permission |
|--------|-----|------------|
| /orders, /orders/view/:id | GET /orders, /orders/{id}, POST /orders/{id}/status, /payment | orders.list/view/update |
| /designs | GET /designs | designs.list/view |
| /products (+view) | /products, /products/{id}/colors, /print-areas | products.* |
| /categories, /colors, /sizes | Dictionary moduli, PUT /{resource}/sort | categories.* colors.* sizes.* |
| /inventory/batches | /inventory-batches, POST .../receive | inventory-batches.* (receive alohida) |
| /inventory/stock | GET /variants, POST /variants/{id}/adjust | inventory.list / inventory.adjust |
| /users | /users (filter[q], include=roles) | users.* |
| /settings/roles | /roles, /roles/{id}/permissions | roles.* |

### Statuslar
`src/services/constants.ts` — `ORDER_STATUSES`, `PAYMENT_STATUSES`, `BATCH_STATUSES`, `DESIGN_STATUSES` + `statusColor()/statusLabel()`.
Backend `App\Enums` bilan sinxron saqla.

### Yangi lug'at sahifasi (2 daqiqa)
```tsx
<Dictionary resource="materials" title={t("Matolar")} fields={[{ name: "gsm", label: "GSM", component: Fields.Input }]} />
```
Backend: CRUD + `status` ustuni + `sort` bo'lsa yetarli.

### Muhim
- Jadval switch faqat `{status}` yuboradi — backend PUT'da `sometimes` (ApiFormRequest). Yangi FormRequest'larda `[...$this->required(), ...]` ishlat.
- `UploadImg` `files[0..]` multipart yuboradi, javob `{data: [file]}` — `onSubmitValue: v => v?.id`.
- Telefon maskasi `+` belgisiz yuboradi — backend `Phone::normalize` qiladi, frontendda qayta ishlash shart emas.
- `npx tsc -b`: `src/components/fields/*` va header/modal'dagi eski TS6133 ogohlantirishlar makon'dan meros; **yangi fayllarda 0 xato bo'lsin**. `npm run build` (vite) ularni to'xtatmaydi.

---

## Muhim hooklardan foydalanish

### `useHooks` — asosiy utility hook

Barcha page/component'larda birinchi navbatda ishlatiladigan hook.

```typescript
const { t, query, navigate, params, queryClient, get, ...lodash } = useHooks();
// query    → URL query string (qs.parse orqali)
// params   → URL path params (:id kabi)
// navigate → react-router navigate
// t        → i18n tarjima
// ...lodash → lodash metodlari to'g'ridan-to'g'ri spread qilingan
```

> MUHIM: `useLocation`, `useNavigate`, `useParams`, `useTranslation`, `useQueryClient` larni alohida import qilma — hammasi `useHooks` dan keladi.

---

### `useGet` — server ma'lumot olish

```typescript
const { data, isLoading } = useGet({
  name: 'users',          // React Query cache key
  url: '/users',          // API endpoint
  params: {               // TParams — queryBuilder ga uzatiladi
    include: 'roles,avatar',
    page: 1,
    limit: 50,
    filter: { status: 1 },
    sort: '-created_at',
  },
  queryOptions: {
    enabled: !!id,        // shartli fetch
  },
  onSuccess: (data) => {},
  onError: (error) => {},
});
// data.data — javob (array yoki object)
```

---

### `usePost` — ma'lumot yaratish/o'zgartirish/o'chirish

```typescript
const {mutate, isLoading} = usePost();
mutate({
  url: '/users',
  method: 'post',    // 'post' | 'put' | 'delete' | 'get'
  data: { ... },
  params: { ... },
}, {
  onSuccess: (data) => {},
  onError: (error) => {},
});
```

---

### `useAccess` — permission tekshirish

```typescript
const { isCreate, isDelete, isUpdate, isList, isView } = useAccess('users');
// yoki namespace'd:
const { isCreate } = useAccess('inventory-batches');
// Permission format: 'users.create', 'users.list', 'branches.update' va h.k.
```

> Permission yo'q bo'lsa — button/link ko'rsatma, route'ga ruxsat berma.

---

## Modullar

### `Get` moduli — list sahifalar uchun

Yangi list sahifasi yozganda `useGet` ni to'g'ridan-to'g'ri emas, `Get` modulini ishlatasan:

```typescript
import Get from '../../modules/get.tsx';

<Get
  name="users"
  url="/users"
  params={{ include: 'roles', page: get(query, 'page', 1), limit: get(query, 'limit', 50) }}
>
  {({ items, meta, isLoading, isDataEmpty }) => (
    <Panel title={t("Foydalanuvchilar")} meta={meta} hasButton={isCreate} onClick={() => navigate('/users/create')}>
      <Table items={items} isLoading={isLoading} ... />
      <Pagination meta={meta} align="end" rootClassName="!mt-4" />
    </Panel>
  )}
</Get>
```

**Qaytariladigan qiymatlar:**
- `items` — ma'lumotlar massivi
- `meta` — `{ current_page, count, per_page, page, total }`
- `isLoading`, `isDataEmpty`, `isDataSuccess`
- `queryOption` — to'liq React Query natijasi

---

### `Form` moduli — create/edit sahifalar uchun

```typescript
import Form from '../../modules/form.tsx';

<Form
  name="users"                          // queryClient.invalidateQueries uchun
  method={id ? 'put' : 'post'}
  url={id ? `/users/${id}` : '/users'}
  fields={[
    { name: 'first_name', value: get(data, 'data.first_name'), required: true, type: 'string' },
    { name: 'last_name',  value: get(data, 'data.last_name'),  required: true },
    {
      name: 'category_id',
      type: 'object',
      value: get(data, 'data.category', null),
      onSubmitValue: (val) => get(val, 'id'),   // API ga faqat ID yuboriladi
    },
    {
      name: 'role_ids',
      type: 'array',
      value: get(data, 'data.roles', []),
      onSubmitValue: (val) => val.map((item: any) => get(item, 'id')),
    },
  ]}
  onSuccess={(data, resetForm, queryClient) => {
    notification({ type: 'success', message: t('Muvaffaqiyatli saqlandi') });
    navigate(`/users/view/${get(data, 'data.id')}`);
  }}
>
  {({ isLoading, setFieldValue, values, errors }) => (
    <div className="flex flex-col gap-4">
      <Field component={Fields.Input} name="first_name" label={t("Ism")} />
      <Button loading={isLoading} htmlType="submit" type="primary">{t("Saqlash")}</Button>
    </div>
  )}
</Form>
```

**`fields` array qoidalari:**
- `value` — edit rejimida `get(data, 'data.fieldName')` dan olish, create'da `undefined` yoki default
- `required: true` → Yup validatsiya avtomatik
- `type` → validatsiya turi: `'string' | 'number' | 'array' | 'object' | 'boolean' | 'date' | 'email' | 'url'`
- `onSubmitValue` → API ga yuborishdan oldin qiymatni transform qilish (object → id)
- `onSubmitKey` → transform qilingan qiymatni boshqa kalit bilan yuborish
- `disabled` → `boolean` yoki `(values) => boolean` — disabled field submit'da o'chiriladi

---

## Komponentlar

### `Panel`

Har bir sahifaning asosiy wrapper'i:

```typescript
<Panel
  title={t("Foydalanuvchilar")}
  meta={meta}                          // jadval meta (total count ko'rsatadi)
  hasButton={isCreate}                 // permission bo'lsa Add tugma ko'rsatiladi
  onClick={() => navigate('/users/create')}
>
  {/* content */}
</Panel>
```

---

### `Table`

```typescript
<Table
  items={items}
  isLoading={isLoading}
  hasEdit={isUpdate}        // permission
  hasDelete={isDelete}      // permission
  name="users"              // React Query invalidate uchun
  url="/users"              // delete API URL
  size="small"
  onRow={(item) => ({
    onClick: () => navigate(`/users/view/${get(item, 'id')}`),
    className: 'cursor-pointer'
  })}
  columns={[
    { title: t("ID"), dataIndex: "id", width: 40 },
    { title: t("Ismi"), dataIndex: "first_name" },
    { title: t("..."), render: (_, row) => <>{get(row, 'relation.name')}</> },
  ]}
/>
```

---

### Form Fields (`Fields.*`)

Barcha fieldlar `Field` va `Fields.*` bilan ishlatiladi:

```typescript
import { Field } from 'formik';
import { Fields } from '../../components';

// Oddiy matn
<Field component={Fields.Input} name="name" label={t("Nomi")} />

// Narx
<Field component={Fields.InputPrice} name="price" label={t("Narx")} />

// Telefon raqam
<Field component={Fields.InputMask} mask='+998 ## ### ## ##' name="phone_number" label={t("Telefon")} />

// Select (statik)
<Field component={Fields.Select} name="gender" label={t("Jinsi")} options={utils.genders} />

// Select (async — API dan)
<Field
  component={Fields.AsyncSelect}
  name="category_id"
  url="/categories"
  label={t("Lavozim")}
  optionLabel={(item: any) => get(item, `name_${language}`)}
  loadOptionsParams={(search: any) => ({ search })}
/>

// Ko'p tanlov (isMulti)
<Field component={Fields.AsyncSelect} name="role_ids" url="/roles" isMulti={true} optionLabel={`name_${language}`} ... />

// Sana
<Field component={Fields.Datepicker} name="birth_date" label={t("Tug'ilgan sana")} />

// Fayl yuklash
<Field component={Fields.Upload} name="file_id" label={t("Fayl")} />

// Rasm yuklash
<Field component={Fields.UploadImg} name="avatar_id" label={t("Rasm")} multiple={false} />

// Switch
<Field component={Fields.Switch} name="status" label={t("Holati")} />

// TextArea
<Field component={Fields.TextArea} name="description" label={t("Tavsif")} />

```

---

### `notification`

```typescript
import { notification } from '../../components';

notification({ type: 'success', message: t('Muvaffaqiyatli') });
notification({ type: 'error',   message: t('Xatolik yuz berdi') });
notification({ type: 'warning', message: t('Diqqat!') });
```

---

### `ViewLayout`

View (ko'rish) sahifalar uchun:

```typescript
import { ViewLayout } from '../../components';

<ViewLayout
  header={{ title: 'Ism Familiya', subtitle: 'Admin', extra: <Button>...</Button> }}
  left={<div>/* Chap panel */</div>}
  right={<div>/* Asosiy kontent */</div>}
/>
```

---

## Services

### `useStore` — Zustand global store

```typescript
import { useStore } from '../../services';

const { user, language, theme, setUser, setLogout } = useStore();
// user.data        → foydalanuvchi ma'lumoti (permissions, roles, avatar)
// user.isAuth      → autentifikatsiya holati
// user.token       → JWT token
// language         → 'uz' | 'ru' | 'en' | 'oz'
```

---

### `storage` — localStorage wrapper

```typescript
import { storage } from '../../services';

storage.set('key', value);
const val = storage.get('key');
storage.remove('key');
```

---

### `helpers` — foydali funksiyalar

```typescript
import { helpers } from '../../services';

helpers.formatInputPhoneNumber('+998901234567')  // → "+998 90 123 45 67"
helpers.beatifyPrice(1500000)                    // → "1 500 000"
helpers.formatCurrencyAmount(1500000, 860)       // → "1 500 000 UZS"
helpers.filterRoutesByPermissions(routes, user)  // → faqat ruxsat berilgan route'lar
```

---

### `utils` — konstantalar

```typescript
import { utils } from '../../services';

utils.genders          // [{ value: 'male', label: 'Erkak' }, ...]
utils.weekDays         // [{ value: 1, label: 'Dushanba' }, ...]
utils.months           // [{ value: 1, label: 'Yanvar' }, ...]
// Textile statuslari: src/services/constants.ts (ORDER_STATUSES, PAYMENT_STATUSES, ...)
utils.currencyCodes    // { 860: 'UZS', 840: 'USD', ... }
```

---

### `api` — Axios instance

To'g'ridan-to'g'ri `api` ni faqat maxsus holatlarda ishlatasan — odatda `useGet`/`usePost` orqali.

```typescript
import { api } from '../../services';

const res = await api.get('/endpoint');
const res = await api.post('/endpoint', data);
```

---

### `queryBuilder` — query string yasash

```typescript
import { queryBuilder } from '../../services';

queryBuilder('/users', {
  include: 'roles,avatar',
  limit: 50,
  page: 1,
  filter: { status: 1 },
  sort: '-created_at',
  extra: { search: 'Ali' },
});
// → "/users?include=roles&per_page=50&page=1&filter[status]=1&sort=-created_at&search=Ali"
```

---

## Permissions tizimi

**Format:** `resurs.amal` — masalan: `users.list`, `users.create`, `branches.update`

**Standart amallar:** `list`, `view`, `create`, `update`, `delete`

```typescript
// Har bir sahifada permission tekshir:
const { isCreate, isDelete, isUpdate, isList, isView } = useAccess('users');

// Panel'da:
<Panel hasButton={isCreate} ...>

// Table'da:
<Table hasEdit={isUpdate} hasDelete={isDelete} ...>

// Shartli render:
{isCreate && <Button onClick={...}>Qo'shish</Button>}
```

---

## Routes tuzilmasi

`src/routes/index.tsx` da ikkita array: `routes` (full pages) va `sidebarRoutes` (nav).

**Har bir route'da permission qo'shish:**

```typescript
{
  path: '/resource',
  element: <ResourceIndex />,
  permission: 'resource.list',       // isList tekshiradi
},
{
  path: '/resource/create',
  element: <ResourceForm />,
  permission: 'resource.create',
},
{
  path: '/resource/update/:id',
  element: <ResourceForm />,
  permission: 'resource.update',
},
{
  path: '/resource/view/:id',
  element: <ResourceView />,
  permission: 'resource.view',
},
```

**Standart CRUD route pattern:**
- `/resource` → Index (list)
- `/resource/create` → Form (create)
- `/resource/update/:id` → Form (edit)
- `/resource/view/:id` → View (detail)

---

## TParams — API so'rov parametrlari

```typescript
type TParams = {
  fields?: object[];
  include?: string | string[];     // Munosabatlar: 'roles,avatar'
  append?: string | string[];
  limit?: number | string;         // per_page → sahifadagi yozuvlar soni
  sort?: string | null;            // '-created_at' (minus = DESC)
  filter?: { [key: string]: any }; // filter[status]=1
  page?: number;
  extra?: { [key: string]: any };  // qo'shimcha query paramlar
};
```

---

## Assets — Iconlar

Solar Icons kutubxonasidan foydalanamiz:

```typescript
import { SolarIcon } from '../../assets/icon';
// yoki alohida import
import UserIcon from '../../assets/icon/solar-icon-name';

<SolarIcon name="user-bold-duotone" size={24} color="#1e50e7" />
```

> Yangi icon kerak bo'lsa — avval `src/assets/icon/` papkasini tekshir.

---

## Kod takrorlanishini oldini olish — asosiy qoidalar

### 1. CRUD sahifalar uchun standart pattern

**Index (list):**
```typescript
const { t, query, navigate } = useHooks();
const { isCreate, isUpdate, isDelete } = useAccess('resource');

<Get name="resource" url="/resource" params={{ page: get(query, 'page', 1), limit: get(query, 'limit', 50) }}>
  {({ items, isLoading, meta }) => (
    <Panel title={t("...")} meta={meta} hasButton={isCreate} onClick={() => navigate('/resource/create')}>
      <Table items={items} isLoading={isLoading} hasEdit={isUpdate} hasDelete={isDelete} name="resource" url="/resource" columns={[...]} />
      <Pagination meta={meta} align="end" rootClassName="!mt-4" />
    </Panel>
  )}
</Get>
```

**Form (create/edit):**
```typescript
const { id } = useParams();
const { t, navigate } = useHooks();

const { data } = useGet({
  url: `/resource/${id}`,
  name: 'resource',
  queryOptions: { enabled: !!id }
});

<Form
  name="resource"
  method={id ? 'put' : 'post'}
  url={id ? `/resource/${id}` : '/resource'}
  fields={[ /* fields */ ]}
  onSuccess={(data) => {
    notification({ type: 'success', message: t('Muvaffaqiyatli saqlandi') });
    navigate(`/resource/view/${get(data, 'data.id')}`);
  }}
>
  {({ isLoading }) => (
    <>
      {/* Fields */}
      <Button loading={isLoading} htmlType="submit" type="primary">{t("Saqlash")}</Button>
    </>
  )}
</Form>
```

### 2. Takroriy narsalarni import qilma

Quyidagilarni alohida import qilma — ular allaqachon abstractlangan:

| QILMA | QIL |
|-------|-----|
| `useLocation()`, `useNavigate()`, `useParams()` | `useHooks()` ishlatilsin |
| `useTranslation()` | `useHooks()` → `t` |
| `useQueryClient()` | `useHooks()` → `queryClient` |
| `import get from 'lodash/get'` | `useHooks()` → `...lodash` |
| `api.get()` to'g'ridan | `useGet` / `Get` moduli |
| `api.post()` to'g'ridan | `usePost` / `Form` moduli |

### 3. Tilga bog'liq label'lar

```typescript
// QILMA:
item.name_uz || item.name

// QIL:
const { language } = useStore();
get(item, `name_${language}`) || get(item, 'name_uz')
```

### 4. Telefon raqam formatlash

```typescript
// QILMA: qo'lda format qilma
// QIL:
helpers.formatInputPhoneNumber(phone_number)
```

### 5. Narx formatlash

```typescript
helpers.beatifyPrice(amount)               // "1 500 000"
helpers.formatCurrencyAmount(amount, code) // "1 500 000 UZS"
```

### 6. Conditional permission rendering

```typescript
// QILMA:
{user.data.permissions.includes('users.create') && <Button>...</Button>}

// QIL:
const { isCreate } = useAccess('users');
{isCreate && <Button>...</Button>}
```

### 7. Query invalidation

```typescript
// Form moduli avtomatik invalidate qiladi (name prop orqali)
// Qo'shimcha invalidate kerak bo'lsa:
const { queryClient } = useHooks();
queryClient.invalidateQueries({ queryKey: ['resource'] });
```

---

## API Response formatlari

**Ro'yxat:**
```json
{ "data": [...], "current_page": 1, "per_page": 50, "total": 100, "to": 50 }
```

**Bitta yozuv:**
```json
{ "data": { "id": 1, ... } }
```

**Validatsiya xatosi (422):**
```json
{ "data": { "field_name": "Xato matni" } }
```

> Form moduli 422 xatolarini avtomatik Formik field error sifatida ko'rsatadi.

---

## Auth oqimi

1. `/login` → `POST /auth/login` → `{ token, refresh_token }` → localStorage
2. App start → `GET /get-me?include=roles.permissions,permissions`
3. 401 → `POST /auth/refresh` → yangi token
4. Refresh fail → `setLogout()` → `/login`ga redirect
5. Route'lar faqat `user.data.permissions` ga qarab filtrlanadi

---

## Tillar

```typescript
// Translation
const { t } = useHooks();
t("Uzbek matni")  // → API'dan tegishli tilga tarjima

// Til o'zgartirish
const { language } = useStore();
// 'uz' | 'ru' | 'en' | 'oz'

// Ko'p tilli field'lar
get(item, `name_${language}`, get(item, 'name_uz'))
```

---

## TypeScript

**Asosiy typlar** (`src/services/types/index.ts`):
- `TParams` — API so'rov parametrlari
- `TMeta` — pagination meta
- `IMethod` — HTTP metod: `'post' | 'put' | 'delete' | 'get' | 'patch'`

**Qoidalar:**
- `@ts-nocheck` va `@ts-ignore` ni minimallashtirilsin
- `any` ni faqat zarur holatlarda ishlatilsin
- Yangi entity uchun interface `src/services/types/` ga qo'shilsin

---

## Muhim eslatmalar

- **Env:** `import.meta.env.VITE_API_ROOT` orqali API URL olish
- **`config.ts`** (loyiha root) — default theme, font, colors konstantalari
- **React Query cache:** `cacheTime: 0`, `staleTime: 0` — har safar fresh data
- **Zustand persist key:** `"textile"` — localStorage
- **Drag-drop:** Table `@dnd-kit` orqali — sortOrder o'zgarsa API ga `patch` yuboriladi
- **Form `enableReinitialize: true`** — `fields[].value` o'zgarganda form qayta yuklanadi (edit uchun muhim)
