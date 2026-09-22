import { Image, Tag } from "antd";
import { get } from "lodash";
import { Fields } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";
import config from "../../../../config";

const money = (v: any) => Number(v || 0).toLocaleString("uz-UZ") + " so'm";

/**
 * Tayyor mahsulotlar: allaqachon bosilgan, rasm bilan kiritiladigan mahsulotlar.
 * Konstruktor (3D model, dizayn) bilan aloqasi yo'q — buyurtma to'g'ridan-to'g'ri shu yerdan.
 */
const ReadyProducts = () => {
  const { t } = useHooks();
  const langs = config.API_LANGUAGES;

  return (
    <Dictionary
      resource="ready-products"
      title={t("Tayyor mahsulotlar")}
      translatable={false}
      modalWidth={860}
      fields={[
        ...langs.map((l) => ({
          name: `name_${l.code}`,
          label: t("Nomi ({{code}})", { code: l.shortName }),
          required: l.code === "uz",
          component: Fields.Input,
        })),
        { name: "description_uz", label: t("Tavsif / turkum (masalan: Futbolkalar)"), component: Fields.Input },
        { name: "price", label: t("Narxi"), required: true, component: Fields.InputPrice },
        { name: "old_price", label: t("Eski narxi (chegirma uchun)"), component: Fields.InputPrice },
        { name: "color_name", label: t("Rang nomi"), component: Fields.Input },
        { name: "color_hex", label: t("Rang kodi (#111827)"), component: Fields.Input },
        { name: "sizes", label: t("Razmerlar"), component: Fields.Tags, props: { placeholder: t("S, M, L — Enter bilan qo'shing") } },
        { name: "specs", label: t("Xususiyatlar"), type: "array", component: Fields.KeyValue },
        { name: "quantity", label: t("Qoldiq (0 = cheksiz)"), component: Fields.InputPrice },
        { name: "sold_count", label: t("Sotilgan soni (ko'rsatish uchun)"), component: Fields.InputPrice },
        { name: "sort", label: t("Tartib"), component: Fields.InputPrice },
        {
          name: "image_ids",
          valueFrom: "images",
          label: t("Rasmlar"),
          type: "object",
          component: Fields.UploadImgs,
          onSubmitValue: (v: any) => (Array.isArray(v) ? v.map((x: any) => x.id) : []),
        },
      ]}
      columns={[
        {
          title: t("Rasm"),
          width: 90,
          render: (_: unknown, r: any) => {
            const src = get(r, "images[0].src");
            return src ? <Image src={src} width={56} className="rounded" /> : "—";
          },
        },
        { title: t("Nomi"), dataIndex: "name_uz" },
        { title: t("Turkum"), dataIndex: "description_uz" },
        { title: t("Narxi"), dataIndex: "price", render: money },
        {
          title: t("Razmerlar"),
          dataIndex: "sizes",
          render: (v: string[]) => (v || []).map((s) => <Tag key={s}>{s}</Tag>),
        },
        { title: t("Qoldiq"), dataIndex: "quantity" },
      ]}
    />
  );
};

export default ReadyProducts;
