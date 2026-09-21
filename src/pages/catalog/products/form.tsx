import { Field } from "formik";
import { get } from "lodash";
import { Button, Fields, notification, Panel } from "../../../components";
import { useGet } from "../../../hooks";
import useHooks from "../../../hooks/useHooks";
import Form from "../../../modules/form";
import { useStore } from "../../../services";
import { COUNTRIES, GENDERS, STATUS_OPTIONS } from "../../../services/constants";
import config from "../../../../config";

const ProductForm = () => {
  const { t, navigate, params } = useHooks();
  const { language } = useStore();
  const id = get(params, "id");
  const { data } = useGet({ url: `/products/${id}`, name: "products", queryOptions: { enabled: !!id } });
  const p = get(data, "data", {});

  return (
    <Panel title={id ? t("Mahsulotni tahrirlash") : t("Yangi mahsulot")} hasButton={false}>
      <Form
        name="products"
        method={id ? "put" : "post"}
        url={id ? `/products/${id}` : "/products"}
        fields={[
          ...config.API_LANGUAGES.map((l) => ({ name: `name_${l.code}`, value: get(p, `name_${l.code}`), required: l.code === "uz" })),
          ...config.API_LANGUAGES.map((l) => ({ name: `description_${l.code}`, value: get(p, `description_${l.code}`) })),
          { name: "category_id", type: "object", value: get(p, "category", null), required: true, onSubmitValue: (v: any) => get(v, "id") },
          { name: "slug", value: get(p, "slug") },
          { name: "fabric", value: get(p, "fabric") },
          { name: "origin_country", value: get(p, "origin_country", "TR") },
          { name: "gender", value: get(p, "gender", "unisex") },
          { name: "type", value: get(p, "type", "blank") },
          { name: "garment_model_id", type: "object", value: get(p, "garment_model", null), onSubmitValue: (v: any) => get(v, "id", null) },
          { name: "base_price", value: get(p, "base_price"), required: true, type: "number" },
          { name: "print_price", value: get(p, "print_price", 0), type: "number" },
          { name: "status", value: get(p, "status", "active") },
        ]}
        onSuccess={(res) => {
          notification({ type: "success", message: t("Muvaffaqiyatli saqlandi") });
          navigate(`/products/view/${get(res, "data.data.id", id)}`);
        }}
      >
        {({ isLoading }) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.API_LANGUAGES.map((l) => (
              <Field key={l.code} component={Fields.Input} name={`name_${l.code}`} label={t("Nomi ({{code}})", { code: l.shortName })} />
            ))}
            <Field component={Fields.AsyncSelect} name="category_id" url="/categories" label={t("Kategoriya")} optionLabel={(o: any) => get(o, `name_${language}`, o.name_uz)} loadOptionsParams={(search: string) => ({ filter: { search } })} />
            <Field component={Fields.Input} name="slug" label={t("Slug (bo'sh qolsa avtomatik)")} />
            <Field component={Fields.Input} name="fabric" label={t("Mato")} antdProps={{ placeholder: "100% paxta, 180 gsm" }} />
            <Field component={Fields.Select} name="origin_country" label={t("Kelgan davlat")} options={COUNTRIES} />
            <Field component={Fields.Select} name="gender" label={t("Jins")} options={GENDERS} />
            <Field component={Fields.Select} name="type" label={t("Turi")} options={[{ value: "blank", label: t("Logosiz (mijoz dizayn qiladi)") }, { value: "finished", label: t("Tayyor mahsulot") }]} />
            <Field component={Fields.Select} name="status" label={t("Holati")} options={STATUS_OPTIONS} />
            <Field component={Fields.AsyncSelect} name="garment_model_id" url="/garment-models" label={t("3D model (konstruktor)")} optionLabel={(o: any) => get(o, `name_${language}`, o.name_uz)} loadOptionsParams={(search: string) => ({ filter: { search, status: "active" } })} isClearable />
            <Field component={Fields.InputPrice} name="base_price" label={t("Bazaviy narx (UZS)")} />
            <Field component={Fields.InputPrice} name="print_price" label={t("Logo bosish narxi (UZS)")} />
            {config.API_LANGUAGES.map((l) => (
              <Field key={l.code} component={Fields.TextArea} name={`description_${l.code}`} label={t("Tavsif ({{code}})", { code: l.shortName })} />
            ))}
            <div className="md:col-span-2 flex justify-end gap-3">
              <Button onClick={() => navigate(-1)}>{t("Bekor qilish")}</Button>
              <Button loading={isLoading} htmlType="submit" type="primary">{t("Saqlash")}</Button>
            </div>
          </div>
        )}
      </Form>
    </Panel>
  );
};

export default ProductForm;
