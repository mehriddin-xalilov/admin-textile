import React from "react";
import { get } from "lodash";
import { Field } from "formik";
import { Button, Fields, Modal, notification, Pagination, Panel, Table } from "../components";
import useAccess from "../hooks/useAccess";
import useHooks from "../hooks/useHooks";
import Form from "./form";
import Get from "./get";
import config from "../../config";

type FieldDef = {
  name: string;
  label: string;
  required?: boolean;
  component?: any;
  props?: Record<string, any>;
  onSubmitValue?: (v: any) => any;
  type?: any;
  /** Edit rejimida qiymat qaysi kalitdan olinadi (masalan parent_id → parent obyekti) */
  valueFrom?: string;
  /** Edit rejimida qiymatni formaga moslash (masalan obyekt → JSON matn) */
  valueTransform?: (v: any) => any;
};

type Props = {
  /** API resurs: 'colors' → /colors, permission 'colors.*' */
  resource: string;
  title: string;
  translatable?: boolean;      // name_uz/ru/en maydonlarini avtomatik qo'shadi
  fields?: FieldDef[];         // qo'shimcha maydonlar
  columns?: any[];             // qo'shimcha ustunlar
  modalWidth?: number;
  hasDrag?: boolean;
  include?: string;
};

/**
 * Oddiy lug'atlar (rang, razmer, kategoriya) uchun jadval + modal forma.
 * Backend: GET /{resource}, POST /{resource}, PUT /{resource}/{id}, DELETE, PUT /{resource}/sort.
 */
const Dictionary: React.FC<Props> = ({ resource, title, translatable = true, fields = [], columns = [], modalWidth = 560, hasDrag = true, include }) => {
  const { t, query } = useHooks();
  const { isCreate, isUpdate, isDelete } = useAccess(resource);
  const [modal, setModal] = React.useState<{ isOpen: boolean; data: any }>({ isOpen: false, data: null });
  const close = () => setModal({ isOpen: false, data: null });

  const langFields: FieldDef[] = translatable
    ? config.API_LANGUAGES.map((l) => ({ name: `name_${l.code}`, label: t("Nomi ({{code}})", { code: l.shortName }), required: l.code === "uz" }))
    : [];
  const allFields = [...langFields, ...fields];

  return (
    <>
      <Get name={resource} url={`/${resource}`} params={{ include, page: get(query, "page", 1), limit: get(query, "limit", 50), sort: "sort" }}>
        {({ items, isLoading, meta }) => (
          <Panel title={title} meta={meta} hasButton={isCreate} onClick={() => setModal({ isOpen: true, data: null })}>
            <Table
              url={`/${resource}`}
              name={resource}
              items={items}
              isLoading={isLoading}
              size="small"
              hasEdit={isUpdate}
              hasDelete={isDelete}
              hasSwitch={isUpdate}
              hasDrag={hasDrag && isUpdate}
              editAction={(item) => setModal({ isOpen: true, data: item })}
              columns={[
                { title: t("ID"), dataIndex: "id", width: 60 },
                ...(translatable ? config.API_LANGUAGES.map((l) => ({ title: t("Nomi ({{code}})", { code: l.shortName }), dataIndex: `name_${l.code}` })) : []),
                ...columns,
                { type: "switch", title: t("Holati"), dataIndex: "status", width: 90 },
              ]}
            />
            <Pagination meta={meta} rootClassName="!mt-4" align="end" />
          </Panel>
        )}
      </Get>

      <Modal open={modal.isOpen} onCancel={close} title={title} width={modalWidth}>
        <Form
          name={resource}
          method={get(modal, "data.id") ? "put" : "post"}
          url={get(modal, "data.id") ? `/${resource}/${get(modal, "data.id")}` : `/${resource}`}
          onSuccess={() => { close(); notification({ type: "success", message: t("Muvaffaqiyatli saqlandi") }); }}
          fields={[
            ...allFields.map((f) => ({ name: f.name, value: f.valueTransform ? f.valueTransform(get(modal, `data.${f.valueFrom || f.name}`)) : get(modal, `data.${f.valueFrom || f.name}`), required: f.required, type: f.type, onSubmitValue: f.onSubmitValue })),
            { name: "status", value: get(modal, "data.status", "active"), onSubmitValue: (v: any) => (v === "active" || v === true ? "active" : "inactive") },
          ]}
        >
          {({ isLoading }) => (
            <div className="flex flex-col gap-4">
              {allFields.map((f) => (
                <Field key={f.name} component={f.component || Fields.Input} name={f.name} label={f.label} {...(f.props || {})} />
              ))}
              <Field component={Fields.Switch} name="status" label={t("Holati")} />
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

export default Dictionary;
