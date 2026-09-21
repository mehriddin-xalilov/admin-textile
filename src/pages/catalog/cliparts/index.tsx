import { Image, Tag } from "antd";
import { get } from "lodash";
import { Fields } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";
import { CLIPART_CATEGORIES } from "../../../services/constants";

/** Tayyor logolar: bir rangli SVG yuklanadi, konstruktorda mijoz rangini tanlaydi. */
const Cliparts = () => {
  const { t } = useHooks();
  return (
    <Dictionary
      resource="cliparts"
      title={t("Tayyor logolar")}
      include="file"
      fields={[
        { name: "category", label: t("Kategoriya"), component: Fields.Select, props: { options: CLIPART_CATEGORIES } },
        { name: "file_id", valueFrom: "file", label: t("SVG fayl (bir rangli, shaffof fon)"), required: true, type: "object", component: Fields.UploadImg, props: { multiple: false }, onSubmitValue: (v: any) => get(v, "id", null) },
        { name: "recolorable", label: t("Rangi o'zgartiriladi"), component: Fields.Switch },
      ]}
      columns={[
        { title: t("Ko'rinish"), dataIndex: ["file", "src"], width: 70, render: (v: string) => v ? <span className="inline-block bg-gray-100 rounded p-1"><Image src={v} width={36} preview={false} /></span> : "—" },
        { title: t("Kategoriya"), dataIndex: "category", render: (v: string) => CLIPART_CATEGORIES.find((c) => c.value === v)?.label || v },
        { title: t("Rang"), dataIndex: "recolorable", width: 110, render: (v: boolean) => <Tag color={v ? "green" : "default"}>{v ? t("O'zgaradi") : t("Qat'iy")}</Tag> },
      ]}
    />
  );
};

export default Cliparts;
