import { Tag } from "antd";
import { Fields } from "../../../components";
import { useGet } from "../../../hooks";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";
import { PHRASE_CATEGORIES } from "../../../services/constants";

/**
 * Trend so'zlar / gaplar: konstruktorda bir bosishda tayyor uslubdagi yozuv sifatida tushadi.
 * Kontentni yangilab turish — marketing jamoasi vazifasi (eski so'zlarni "Faol emas" qiling).
 */
const Phrases = () => {
  const { t } = useHooks();
  const { data } = useGet({ url: "/fonts", name: "fonts" });
  const fonts = ((data as any)?.data || []).map((f: any) => ({ value: f.family, label: f.family }));

  return (
    <Dictionary
      resource="phrases"
      title={t("Trend so'zlar")}
      translatable={false}
      modalWidth={640}
      fields={[
        { name: "text", label: t("Matn"), required: true, component: Fields.Input },
        { name: "category", label: t("Kategoriya"), component: Fields.Select, props: { options: PHRASE_CATEGORIES } },
        { name: "font_family", label: t("Shrift"), required: true, component: Fields.Select, props: { options: fonts } },
        { name: "font_weight", label: t("Og'irlik"), component: Fields.Select, props: { options: [{ value: "400", label: "Oddiy" }, { value: "700", label: "Qalin" }, { value: "900", label: "Juda qalin" }] } },
        { name: "font_style", label: t("Uslub"), component: Fields.Select, props: { options: [{ value: "normal", label: "Oddiy" }, { value: "italic", label: "Italic" }] } },
        { name: "fill", label: t("Rang (HEX)"), component: Fields.Input, props: { antdProps: { placeholder: "#111111" } } },
      ]}
      columns={[
        { title: t("Matn"), dataIndex: "text", render: (v: string, r: any) => <span style={{ fontFamily: r.font_family, fontWeight: r.font_weight, fontStyle: r.font_style, color: r.fill, fontSize: 18 }}>{v}</span> },
        { title: t("Kategoriya"), dataIndex: "category", render: (v: string) => <Tag>{PHRASE_CATEGORIES.find((c) => c.value === v)?.label || v}</Tag> },
        { title: t("Shrift"), dataIndex: "font_family", render: (v: string, r: any) => `${v} ${r.font_weight}${r.font_style === "italic" ? " italic" : ""}` },
      ]}
    />
  );
};

export default Phrases;
