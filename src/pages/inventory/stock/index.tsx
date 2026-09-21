import { Input, Tag } from "antd";
import { Field } from "formik";
import { get } from "lodash";
import React from "react";
import { Button, Fields, Modal, notification, Pagination, Panel, Table } from "../../../components";
import useHooks from "../../../hooks/useHooks";
import Form from "../../../modules/form";
import Get from "../../../modules/get";
import { useStore } from "../../../services";

/** Ombor qoldiqlari variant kesimida. Qo'lda tuzatish: POST /variants/{id}/adjust {quantity: ±n}. */
const Stock = () => {
  const { t, query, navigate, qs } = useHooks();
  const { user, language } = useStore();
  const canAdjust = get(user, "data.permissions", []).includes("inventory.adjust");
  const [modal, setModal] = React.useState<{ isOpen: boolean; data: any }>({ isOpen: false, data: null });
  const close = () => setModal({ isOpen: false, data: null });

  return (
    <>
      <Get name="variants" url="/variants" params={{ page: get(query, "page", 1), limit: get(query, "limit", 50), filter: { sku: get(query, "sku"), low_stock: get(query, "low_stock"), in_stock: get(query, "in_stock") } }}>
        {({ items, isLoading, meta }) => (
          <Panel
            title={t("Ombor qoldiqlari")}
            meta={meta}
            hasButton={false}
            headerRight={
              <div className="flex gap-2">
                <Button type={get(query, "low_stock") ? "primary" : "default"} onClick={() => navigate({ search: qs.stringify({ ...query, low_stock: get(query, "low_stock") ? undefined : 5, page: 1 }) })}>{t("Kam qolgan")}</Button>
                <Input.Search allowClear placeholder="SKU" defaultValue={get(query, "sku")} onSearch={(sku: string) => navigate({ search: qs.stringify({ ...query, sku: sku || undefined, page: 1 }) })} />
              </div>
            }
          >
            <Table
              items={items}
              isLoading={isLoading}
              size="small"
              name="variants"
              hasEdit={canAdjust}
              editAction={(item) => setModal({ isOpen: true, data: item })}
              columns={[
                { title: "SKU", dataIndex: "sku" },
                { title: t("Mahsulot"), render: (_, r) => get(r, `product.name_${language}`, get(r, "product.name")) },
                { title: t("Rang"), render: (_, r) => <span className="inline-flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-gray-300" style={{ background: get(r, "product_color.color.hex") }} />{get(r, `product_color.color.name_${language}`, get(r, "product_color.color.name"))}</span> },
                { title: t("Razmer"), dataIndex: ["size", "name"], width: 90 },
                { title: t("Omborda"), dataIndex: "quantity", width: 90 },
                { title: t("Band"), dataIndex: "reserved", width: 90 },
                { title: t("Mavjud"), dataIndex: "available", width: 90, render: (v) => <Tag color={v > 5 ? "green" : v > 0 ? "orange" : "red"}>{v}</Tag> },
              ]}
            />
            <Pagination meta={meta} rootClassName="!mt-4" align="end" />
          </Panel>
        )}
      </Get>

      <Modal open={modal.isOpen} onCancel={close} title={`${t("Qoldiqni tuzatish")}: ${get(modal, "data.sku", "")}`}>
        <Form
          name="variants"
          method="post"
          url={`/variants/${get(modal, "data.id")}/adjust`}
          onSuccess={() => { close(); notification({ type: "success", message: t("Saqlandi") }); }}
          fields={[{ name: "quantity", value: undefined, required: true, type: "number" }, { name: "comment", value: undefined }]}
        >
          {({ isLoading }) => (
            <div className="flex flex-col gap-4">
              <Field component={Fields.Input} name="quantity" label={t("O'zgarish (+5 kirim, -3 chiqim)")} antdProps={{ type: "number" }} />
              <Field component={Fields.Input} name="comment" label={t("Izoh")} />
              <div className="flex justify-end gap-3">
                <Button htmlType="button" onClick={close}>{t("Bekor qilish")}</Button>
                <Button loading={isLoading} htmlType="submit" type="primary">{t("Saqlash")}</Button>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Stock;
