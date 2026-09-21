import { get } from "lodash";
import { Fields } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Dictionary from "../../../modules/dictionary";
import { useStore } from "../../../services";

const Categories = () => {
  const { t } = useHooks();
  const { language } = useStore();
  return (
    <Dictionary
      resource="categories"
      include="parent,image"
      title={t("Kategoriyalar")}
      modalWidth={640}
      fields={[
        { name: "slug", label: t("Slug (bo'sh qolsa avtomatik)"), component: Fields.Input },
        {
          name: "parent_id", valueFrom: "parent", label: t("Ota kategoriya"), type: "object",
          component: Fields.AsyncSelect,
          props: { url: "/categories", optionLabel: (o: any) => get(o, `name_${language}`, o.name_uz), loadOptionsParams: (search: string) => ({ filter: { search } }), isClearable: true },
          onSubmitValue: (v: any) => get(v, "id", null),
        },
        { name: "image_id", valueFrom: "image", label: t("Rasm"), type: "object", component: Fields.UploadImg, props: { multiple: false }, onSubmitValue: (v: any) => get(v, "id", null) },
      ]}
      columns={[
        { title: t("Slug"), dataIndex: "slug" },
        { title: t("Mahsulotlar"), dataIndex: "products_count", width: 110 },
      ]}
    />
  );
};

export default Categories;
