import { Field } from "formik";
import { get } from "lodash";
import { Button, Fields, notification, Panel } from "../../../components";
import { useGet } from "../../../hooks";
import useHooks from "../../../hooks/useHooks";
import Form from "../../../modules/form";

const FIELDS: { key: string; label: string; area?: boolean }[] = [
  { key: "phone", label: "Telefon" }, { key: "telegram", label: "Telegram (havola)" }, { key: "instagram", label: "Instagram (havola)" }, { key: "email", label: "Email" },
  { key: "address_uz", label: "Manzil (uz)" }, { key: "address_ru", label: "Manzil (ru)" }, { key: "address_en", label: "Manzil (en)" },
  { key: "work_hours", label: "Ish vaqti" }, { key: "map_url", label: "Xarita havolasi" },
  { key: "delivery_text_uz", label: "Yetkazib berish (uz)", area: true }, { key: "delivery_text_ru", label: "Yetkazib berish (ru)", area: true }, { key: "delivery_text_en", label: "Yetkazib berish (en)", area: true },
];

/** Sayt aloqa ma'lumotlari (footer, aloqa sahifasi). GET/PUT /settings */
const Contacts = () => {
  const { t } = useHooks();
  const { data } = useGet({ url: "/settings", name: "settings" });
  const values = get(data, "data", {});
  return (
    <Panel title={t("Aloqa ma'lumotlari")} hasButton={false}>
      <Form
        name="settings"
        method="put"
        url="/settings"
        fields={[{ name: "settings", type: "object", value: FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: get(values, f.key) || "" }), {}) }]}
        onSuccess={() => notification({ type: "success", message: t("Saqlandi") })}
      >
        {({ isLoading }) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map((f) => <Field key={f.key} component={f.area ? Fields.TextArea : Fields.Input} name={`settings.${f.key}`} label={t(f.label)} />)}
            <div className="md:col-span-2 flex justify-end"><Button loading={isLoading} htmlType="submit" type="primary">{t("Saqlash")}</Button></div>
          </div>
        )}
      </Form>
    </Panel>
  );
};

export default Contacts;
