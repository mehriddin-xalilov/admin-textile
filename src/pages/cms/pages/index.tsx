import { Tag } from "antd";
import { Fields } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";
import config from "../../../../config";

/** Statik sahifalar: biz haqimizda, aloqa, yetkazib berish, oferta. Kontent — CKEditor (HTML), 3 tilda. */
const Pages = () => {
  const { t } = useHooks();
  const langs = config.API_LANGUAGES;
  return (
    <Dictionary
      resource="pages"
      title={t("Sayt sahifalari")}
      translatable={false}
      modalWidth={900}
      fields={[
        { name: "slug", label: t("Slug (URL: /page/slug)"), required: true, component: Fields.Input, props: { antdProps: { placeholder: "about" } } },
        ...langs.map((l) => ({ name: `title_${l.code}`, label: t("Sarlavha ({{code}})", { code: l.shortName }), required: l.code === "uz", component: Fields.Input })),
        ...langs.map((l) => ({ name: `content_${l.code}`, label: t("Kontent ({{code}})", { code: l.shortName }), component: Fields.Ckeditor })),
        { name: "in_footer", label: t("Footer'da ko'rsatish"), component: Fields.Switch },
      ]}
      columns={[
        { title: t("Slug"), dataIndex: "slug", render: (v: string) => <Tag>/page/{v}</Tag> },
        { title: t("Sarlavha"), dataIndex: "title_uz" },
        { title: t("Footer"), dataIndex: "in_footer", width: 80, render: (v: boolean) => (v ? "✓" : "—") },
      ]}
    />
  );
};

export default Pages;
