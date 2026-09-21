import { Field, FieldArray } from "formik";
import { get } from "lodash";
import { Button, Fields, notification, Panel } from "../../../components";
import { useGet } from "../../../hooks";
import useHooks from "../../../hooks/useHooks";
import Form from "../../../modules/form";
import { useStore } from "../../../services";
import { COUNTRIES } from "../../../services/constants";
import { TrashBinTrashIcon } from "../../../assets/icon/components/solar-bold-duotone-icons";

/**
 * Partiya: har bir qatorda variant (mahsulot + rang + razmer) va miqdor.
 * Variant tanlash: /variants dan qidiruv (SKU bo'yicha).
 */
const BatchForm = () => {
  const { t, navigate, params } = useHooks();
  const { language } = useStore();
  const id = get(params, "id");
  const { data } = useGet({ url: `/inventory-batches/${id}`, name: "inventory-batches", queryOptions: { enabled: !!id } });
  const b = get(data, "data", {});

  const variantLabel = (v: any) =>
    `${get(v, `product.name_${language}`, get(v, "product.name"))} · ${get(v, `product_color.color.name_${language}`, get(v, "product_color.color.name"))} · ${get(v, "size.name")} (${get(v, "sku")})`;

  return (
    <Panel title={id ? t("Partiyani tahrirlash") : t("Yangi partiya")} hasButton={false}>
      <Form
        name="inventory-batches"
        method={id ? "put" : "post"}
        url={id ? `/inventory-batches/${id}` : "/inventory-batches"}
        fields={[
          { name: "supplier_country", value: get(b, "supplier_country", "TR"), required: true },
          { name: "supplier_name", value: get(b, "supplier_name") },
          { name: "arrived_at", value: get(b, "arrived_at"), type: "date" },
          { name: "note", value: get(b, "note") },
          {
            name: "items",
            type: "array",
            value: get(b, "items", []).map((i: any) => ({ variant: i.variant, quantity: i.quantity, unit_cost: i.unit_cost })),
            onSubmitValue: (rows: any[]) => rows.filter((r) => r.variant).map((r) => ({ product_variant_id: get(r, "variant.id"), quantity: Number(r.quantity), unit_cost: r.unit_cost || null })),
          },
        ]}
        onSuccess={(res) => {
          notification({ type: "success", message: t("Muvaffaqiyatli saqlandi") });
          navigate(`/inventory/batches/view/${get(res, "data.data.id", id)}`);
        }}
      >
        {({ isLoading, values }) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field component={Fields.Select} name="supplier_country" label={t("Davlat")} options={COUNTRIES} />
              <Field component={Fields.Input} name="supplier_name" label={t("Yetkazuvchi")} />
              <Field component={Fields.Datepicker} name="arrived_at" label={t("Kelgan sana")} />
            </div>
            <Field component={Fields.TextArea} name="note" label={t("Izoh")} />

            <FieldArray name="items">
              {({ push, remove }) => (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t("Mahsulotlar")}</span>
                    <Button onClick={() => push({ variant: null, quantity: 1, unit_cost: undefined })}>{t("Qator qo'shish")}</Button>
                  </div>
                  {(values.items || []).map((_: any, i: number) => (
                    <div key={i} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-7">
                        <Field
                          component={Fields.AsyncSelect}
                          name={`items.${i}.variant`}
                          url="/variants"
                          label={t("Variant (SKU)")}
                          optionLabel={variantLabel}
                          loadOptionsParams={(search: string) => ({ filter: { sku: search }, limit: 30 })}
                        />
                      </div>
                      <div className="col-span-2"><Field component={Fields.Input} name={`items.${i}.quantity`} label={t("Miqdor")} antdProps={{ type: "number", min: 1 }} /></div>
                      <div className="col-span-2"><Field component={Fields.InputPrice} name={`items.${i}.unit_cost`} label={t("Tannarx")} /></div>
                      <div className="col-span-1 pb-1"><Button danger onClick={() => remove(i)} icon={<TrashBinTrashIcon />} /></div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            <div className="flex justify-end gap-3">
              <Button onClick={() => navigate(-1)}>{t("Bekor qilish")}</Button>
              <Button loading={isLoading} htmlType="submit" type="primary">{t("Saqlash")}</Button>
            </div>
          </div>
        )}
      </Form>
    </Panel>
  );
};

export default BatchForm;
