import { Image } from "antd";
import { get } from "lodash";
import { Fields } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";
import config from "../../../../config";

/** Bosh sahifa bannerlari: sarlavha/matn/tugma (3 tilda), havola, fon rasmi, tartib, faol. */
const Banners = () => {
  const { t } = useHooks();
  const langs = config.API_LANGUAGES;
  return (
    <Dictionary
      resource="banners"
      title={t("Bosh sahifa bannerlari")}
      translatable={false}
      include="image"
      modalWidth={760}
      fields={[
        ...langs.map((l) => ({ name: `title_${l.code}`, label: t("Sarlavha ({{code}})", { code: l.shortName }), required: l.code === "uz", component: Fields.Input })),
        ...langs.map((l) => ({ name: `subtitle_${l.code}`, label: t("Matn ({{code}})", { code: l.shortName }), component: Fields.TextArea })),
        ...langs.map((l) => ({ name: `button_text_${l.code}`, label: t("Tugma ({{code}})", { code: l.shortName }), component: Fields.Input })),
        { name: "link", label: t("Havola (/studio, /product/polo-classic, https://...)"), component: Fields.Input },
        { name: "image_id", valueFrom: "image", label: t("Fon rasmi"), type: "object", component: Fields.UploadImg, props: { multiple: false }, onSubmitValue: (v: any) => get(v, "id", null) },
      ]}
      columns={[
        { title: t("Rasm"), dataIndex: ["image", "src"], width: 90, render: (v: string) => v ? <Image src={v} width={64} className="rounded" /> : "—" },
        { title: t("Sarlavha"), dataIndex: "title_uz" },
        { title: t("Havola"), dataIndex: "link" },
      ]}
    />
  );
};

export default Banners;
