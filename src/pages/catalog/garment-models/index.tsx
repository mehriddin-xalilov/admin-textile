import { Tag } from "antd";
import { get } from "lodash";
import { Fields } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";

/**
 * 3D kiyim modellari (GLB). Konstruktor mahsulotga bog'langan modelni yuklaydi.
 * Zonalar — bosma joylari (decal): {"front":{"position":[0,0.04,0.15],"rotation":[0,0,0],"scale":0.26}, "back":..., "sleeve_left":..., "sleeve_right":...}
 */
const ZONES_PLACEHOLDER = '{"front":{"position":[0,0.04,0.15],"rotation":[0,0,0],"scale":0.26},"back":{"position":[0,0.04,-0.15],"rotation":[0,3.1416,0],"scale":0.26}}';

const GarmentModels = () => {
  const { t } = useHooks();
  return (
    <Dictionary
      resource="garment-models"
      title={t("3D modellar")}
      include="file,thumbnail"
      modalWidth={680}
      fields={[
        { name: "file_id", valueFrom: "file", label: t("GLB fayl (3D model, 60 MB gacha)"), required: true, type: "object", component: Fields.Upload, props: { accept: ".glb" }, onSubmitValue: (v: any) => get(v, "id", null) },
        { name: "thumbnail_id", valueFrom: "thumbnail", label: t("Rasm (ro'yxat uchun)"), type: "object", component: Fields.UploadImg, props: { multiple: false }, onSubmitValue: (v: any) => get(v, "id", null) },
        { name: "author", label: t("Muallif / litsenziya (CC-BY bo'lsa majburiy)"), component: Fields.Input },
        { name: "zones", label: t("Bosma zonalar (JSON, bo'sh qolsa standart)"), component: Fields.TextArea, valueTransform: (v: any) => (v && typeof v === "object" ? JSON.stringify(v) : v || ""), props: { antdProps: { placeholder: ZONES_PLACEHOLDER, rows: 4 } }, onSubmitValue: (v: any) => (typeof v === "string" ? (v.trim() ? JSON.parse(v) : null) : v) },
      ]}
      columns={[
        { title: t("Rasm"), dataIndex: ["thumbnail", "src"], width: 70, render: (v: string) => v ? <img src={v} className="w-10 h-10 rounded object-cover" alt="" /> : "—" },
        { title: t("Fayl"), dataIndex: ["file", "original_name"], render: (v: string, r: any) => <a href={get(r, "file.src")} target="_blank" rel="noreferrer">{v}</a> },
        { title: t("Hajmi"), dataIndex: ["file", "size"], width: 90, render: (v: number) => v ? `${(v / 1048576).toFixed(1)} MB` : "—" },
        { title: t("Mahsulotlar"), dataIndex: "products_count", width: 110, render: (v: number) => <Tag color={v ? "blue" : "default"}>{v || 0}</Tag> },
        { title: t("Muallif"), dataIndex: "author", render: (v: string) => v || "—" },
      ]}
    />
  );
};

export default GarmentModels;
