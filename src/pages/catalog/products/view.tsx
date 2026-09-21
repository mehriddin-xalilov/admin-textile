import { Descriptions, Image, Table as AntTable, Tag } from "antd";
import { Field } from "formik";
import { get } from "lodash";
import React from "react";
import { Button, Fields, Modal, notification, Panel, Spin, Table, Tabs, ViewLayout } from "../../../components";
import { useGet } from "../../../hooks";
import useAccess from "../../../hooks/useAccess";
import useHooks from "../../../hooks/useHooks";
import Form from "../../../modules/form";
import { helpers, useStore } from "../../../services";
import { COUNTRIES, PRODUCT_SIDES } from "../../../services/constants";

/** Mahsulot rangi: mockup rasmlari + razmer bo'yicha variantlar (SKU, qoldiq). */
const ColorsTab = ({ productId, canEdit }: { productId: string; canEdit: boolean }) => {
  const { t, queryClient } = useHooks();
  const { language } = useStore();
  const [modal, setModal] = React.useState<{ isOpen: boolean; data: any }>({ isOpen: false, data: null });
  const close = () => setModal({ isOpen: false, data: null });
  const { data, isLoading } = useGet({ url: `/products/${productId}/colors`, name: `product-colors-${productId}` });
  const items = get(data, "data", []);

  return (
    <>
      <Panel title={t("Ranglar va qoldiqlar")} hasButton={canEdit} onClick={() => setModal({ isOpen: true, data: null })}>
        <Table
          items={items}
          isLoading={isLoading}
          size="small"
          name={`product-colors-${productId}`}
          url={`/products/${productId}/colors`}
          hasEdit={canEdit}
          hasDelete={canEdit}
          editAction={(item) => setModal({ isOpen: true, data: item })}
          expandable={{
            expandedRowRender: (row: any) => (
              <AntTable
                size="small"
                pagination={false}
                rowKey="id"
                dataSource={get(row, "variants", [])}
                columns={[
                  { title: t("Razmer"), dataIndex: ["size", "name"], width: 90 },
                  { title: "SKU", dataIndex: "sku" },
                  { title: t("Omborda"), dataIndex: "quantity", width: 90 },
                  { title: t("Band"), dataIndex: "reserved", width: 90 },
                  { title: t("Mavjud"), dataIndex: "available", width: 90, render: (v) => <Tag color={v > 0 ? "green" : "red"}>{v}</Tag> },
                ]}
              />
            ),
          }}
          columns={[
            { title: t("Rang"), render: (_, row) => <span className="inline-flex items-center gap-2"><span className="w-5 h-5 rounded-full border border-gray-300" style={{ background: get(row, "color.hex") }} />{get(row, `color.name_${language}`, get(row, "color.name"))}</span> },
            { title: t("Old"), dataIndex: ["front_image", "src"], width: 80, render: (v) => v ? <Image src={v} width={48} className="rounded" /> : "—" },
            { title: t("Orqa"), dataIndex: ["back_image", "src"], width: 80, render: (v) => v ? <Image src={v} width={48} className="rounded" /> : "—" },
            { title: t("Yon"), width: 80, render: (_, row) => get(row, "left_image.src") || get(row, "right_image.src") ? <Image src={get(row, "left_image.src") || get(row, "right_image.src")} width={48} className="rounded" /> : "—" },
            { title: t("Narx"), dataIndex: "price", render: (v) => v ? `${helpers.beatifyPrice(v)} UZS` : t("Bazaviy") },
            { title: t("Jami mavjud"), render: (_, row) => get(row, "variants", []).reduce((s: number, v: any) => s + get(v, "available", 0), 0) },
            { title: t("Holati"), dataIndex: "status", width: 90, render: (v) => <Tag color={v === "active" ? "green" : "red"}>{v}</Tag> },
          ]}
        />
      </Panel>

      <Modal open={modal.isOpen} onCancel={close} title={t("Mahsulot rangi")} width={640}>
        <Form
          name={`product-colors-${productId}`}
          method={get(modal, "data.id") ? "put" : "post"}
          url={get(modal, "data.id") ? `/products/${productId}/colors/${get(modal, "data.id")}` : `/products/${productId}/colors`}
          onSuccess={() => { close(); queryClient.invalidateQueries({ queryKey: ["products"] }); notification({ type: "success", message: t("Muvaffaqiyatli saqlandi") }); }}
          fields={[
            { name: "color_id", type: "object", value: get(modal, "data.color", null), required: true, onSubmitValue: (v: any) => get(v, "id") },
            { name: "price", value: get(modal, "data.price"), type: "number" },
            { name: "front_image_id", type: "object", value: get(modal, "data.front_image", null), onSubmitValue: (v: any) => get(v, "id", null) },
            { name: "back_image_id", type: "object", value: get(modal, "data.back_image", null), onSubmitValue: (v: any) => get(v, "id", null) },
            { name: "left_image_id", type: "object", value: get(modal, "data.left_image", null), onSubmitValue: (v: any) => get(v, "id", null) },
            { name: "right_image_id", type: "object", value: get(modal, "data.right_image", null), onSubmitValue: (v: any) => get(v, "id", null) },
            { name: "status", value: get(modal, "data.status", "active"), onSubmitValue: (v: any) => (v === "active" || v === true ? "active" : "inactive") },
          ]}
        >
          {({ isLoading }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field component={Fields.AsyncSelect} name="color_id" url="/colors" label={t("Rang")} optionLabel={(o: any) => get(o, `name_${language}`, o.name_uz)} loadOptionsParams={(search: string) => ({ filter: { search } })} />
              <Field component={Fields.InputPrice} name="price" label={t("Narx (bo'sh — bazaviy)")} />
              <Field component={Fields.UploadImg} name="front_image_id" label={t("Old mockup")} multiple={false} />
              <Field component={Fields.UploadImg} name="back_image_id" label={t("Orqa mockup")} multiple={false} />
              <Field component={Fields.UploadImg} name="left_image_id" label={t("Chap yon mockup")} multiple={false} />
              <Field component={Fields.UploadImg} name="right_image_id" label={t("O'ng yon mockup")} multiple={false} />
              <Field component={Fields.Switch} name="status" label={t("Holati")} />
              <div className="md:col-span-2 flex justify-end gap-3">
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

/** Bosma joylari: konstruktorda logo qo'yish mumkin bo'lgan zonalar (foizda). */
const PrintAreasTab = ({ productId, canEdit }: { productId: string; canEdit: boolean }) => {
  const { t } = useHooks();
  const [modal, setModal] = React.useState<{ isOpen: boolean; data: any }>({ isOpen: false, data: null });
  const close = () => setModal({ isOpen: false, data: null });
  const name = `print-areas-${productId}`;
  const { data, isLoading } = useGet({ url: `/products/${productId}/print-areas`, name });

  return (
    <>
      <Panel title={t("Bosma joylari")} hasButton={canEdit} onClick={() => setModal({ isOpen: true, data: null })}>
        <Table
          items={get(data, "data", [])}
          isLoading={isLoading}
          size="small"
          name={name}
          url={`/products/${productId}/print-areas`}
          hasEdit={canEdit}
          hasDelete={canEdit}
          editAction={(item) => setModal({ isOpen: true, data: item })}
          columns={[
            { title: t("Tomon"), dataIndex: "side", render: (v) => PRODUCT_SIDES.find((s) => s.value === v)?.label || v },
            { title: t("Nomi"), dataIndex: "name" },
            { title: "X %", dataIndex: "x", width: 70 }, { title: "Y %", dataIndex: "y", width: 70 },
            { title: t("Eni %"), dataIndex: "width", width: 80 }, { title: t("Bo'yi %"), dataIndex: "height", width: 80 },
            { title: t("Maks. sm"), render: (_, r) => `${r.max_width_cm ?? "—"} × ${r.max_height_cm ?? "—"}` },
          ]}
        />
      </Panel>
      <Modal open={modal.isOpen} onCancel={close} title={t("Bosma joyi")} width={640}>
        <Form
          name={name}
          method={get(modal, "data.id") ? "put" : "post"}
          url={get(modal, "data.id") ? `/products/${productId}/print-areas/${get(modal, "data.id")}` : `/products/${productId}/print-areas`}
          onSuccess={() => { close(); notification({ type: "success", message: t("Muvaffaqiyatli saqlandi") }); }}
          fields={[
            { name: "side", value: get(modal, "data.side", "front"), required: true },
            { name: "name", value: get(modal, "data.name"), required: true },
            { name: "x", value: get(modal, "data.x", 30), required: true, type: "number" },
            { name: "y", value: get(modal, "data.y", 25), required: true, type: "number" },
            { name: "width", value: get(modal, "data.width", 40), required: true, type: "number" },
            { name: "height", value: get(modal, "data.height", 40), required: true, type: "number" },
            { name: "max_width_cm", value: get(modal, "data.max_width_cm"), type: "number" },
            { name: "max_height_cm", value: get(modal, "data.max_height_cm"), type: "number" },
          ]}
        >
          {({ isLoading }) => (
            <div className="grid grid-cols-2 gap-4">
              <Field component={Fields.Select} name="side" label={t("Tomon")} options={PRODUCT_SIDES} />
              <Field component={Fields.Input} name="name" label={t("Nomi")} />
              <Field component={Fields.Input} name="x" label="X (%)" antdProps={{ type: "number" }} />
              <Field component={Fields.Input} name="y" label="Y (%)" antdProps={{ type: "number" }} />
              <Field component={Fields.Input} name="width" label={t("Eni (%)")} antdProps={{ type: "number" }} />
              <Field component={Fields.Input} name="height" label={t("Bo'yi (%)")} antdProps={{ type: "number" }} />
              <Field component={Fields.Input} name="max_width_cm" label={t("Maks. eni (sm)")} antdProps={{ type: "number" }} />
              <Field component={Fields.Input} name="max_height_cm" label={t("Maks. bo'yi (sm)")} antdProps={{ type: "number" }} />
              <div className="col-span-2 flex justify-end gap-3">
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

const ProductView = () => {
  const { t, params, navigate, query } = useHooks();
  const { isUpdate } = useAccess("products");
  const id = get(params, "id") as string;
  const tab = get(query, "tab", "colors");
  const { data, isLoading } = useGet({ url: `/products/${id}`, name: "products", queryOptions: { enabled: !!id } });
  const p = get(data, "data", {});

  return (
    <Spin spinning={isLoading}>
      <ViewLayout
        header={{
          title: get(p, "name"),
          subtitle: get(p, "category.name"),
          extra: isUpdate && <Button type="primary" onClick={() => navigate(`/products/update/${id}`)}>{t("Tahrirlash")}</Button>,
        }}
        left={
          <Panel header={false}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("Slug")}>{get(p, "slug")}</Descriptions.Item>
              <Descriptions.Item label={t("Mato")}>{get(p, "fabric") || "—"}</Descriptions.Item>
              <Descriptions.Item label={t("Davlat")}>{COUNTRIES.find((c) => c.value === get(p, "origin_country"))?.label || "—"}</Descriptions.Item>
              <Descriptions.Item label={t("Jins")}>{get(p, "gender")}</Descriptions.Item>
              <Descriptions.Item label={t("Bazaviy narx")}>{helpers.beatifyPrice(get(p, "base_price", 0))} UZS</Descriptions.Item>
              <Descriptions.Item label={t("Logo bosish")}>{helpers.beatifyPrice(get(p, "print_price", 0))} UZS</Descriptions.Item>
              <Descriptions.Item label={t("Mavjud qoldiq")}><Tag color={get(p, "available_stock", 0) > 0 ? "green" : "red"}>{get(p, "available_stock", 0)}</Tag></Descriptions.Item>
              <Descriptions.Item label={t("Holati")}><Tag color={get(p, "status") === "active" ? "green" : "red"}>{get(p, "status")}</Tag></Descriptions.Item>
              <Descriptions.Item label={t("Tavsif")}>{get(p, "description") || "—"}</Descriptions.Item>
            </Descriptions>
          </Panel>
        }
        right={
          <div className="flex flex-col gap-4">
            <Tabs options={[{ label: t("Ranglar va qoldiqlar"), value: "colors" }, { label: t("Bosma joylari"), value: "print-areas" }]} defaultValue="colors" />
            {tab === "print-areas" ? <PrintAreasTab productId={id} canEdit={isUpdate} /> : <ColorsTab productId={id} canEdit={isUpdate} />}
          </div>
        }
      />
    </Spin>
  );
};

export default ProductView;
