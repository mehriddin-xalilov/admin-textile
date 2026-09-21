
import { get } from "lodash";
import Form from "../../../modules/form.tsx";
import { Button, Fields, Modal, notification } from "../../../components";
import { useTranslation } from "react-i18next";
import config from "../../../../config.ts";
import { Field } from "formik";

function ModalData({ modalData, setModalData }: any) {
  const { t } = useTranslation();
  return (
    <Modal
      open={get(modalData, "isOpen")}
      onCancel={() => setModalData({ isOpen: false, data: null })}
      title={t("Ruxsatlar")}
    >
      <Form
        name={"permissions"}
        method={get(modalData, "data.id") ? "put" : "post"}
        url={
          get(modalData, "data.id")
            ? `permissions/${get(modalData, "data.id")}`
            : `permissions`
        }
        onSuccess={() => {
          setModalData({ isOpen: false, data: null });
          notification({
            type: "success",
            message: t("Muvaffaqiyatli saqlandi")
          });
        }}
        fields={[
          ...config.API_LANGUAGES.map((item) => ({
            name: `name_${get(item, "code")}`,
            value: get(modalData, `data.name_${get(item, "code")}`),
            required: true
          })),
          {
            name: 'name',
            value: get(modalData, 'data.name'),
            required: true
          },
          {
            name: "status",
            value: get(modalData, "data.status"),
            onSubmitValue: value => value === 'active' ? 'active' : 'inactive'
          }
        ]}
      >
        {({ isLoading }) => {
          return (
            <div className="flex flex-col gap-4">
              {config.API_LANGUAGES.map((item) => {
                return (
                  <Field
                    component={Fields.Input}
                    translate={true}
                    name={`name_${get(item, "code")}`}
                    label={t("Nomi ({{code}})", {
                      code: get(item, "shortName")
                    })}
                  />
                );
              })}
              <Field
                component={Fields.Input}
                name="name"
                label={t("Slug")}
                disabled={get(modalData, 'data.id')}
              />
              <Field
                component={Fields.Switch}
                name="status"
                label={t("Holati")}
              />
              <div className="flex justify-end gap-5">
                <Button
                  htmlType="button"
                  variant="filled"
                  color="default"
                  onClick={() => setModalData({ isOpen: false, data: null })}
                >
                  {t("Bekor qilish")}
                </Button>
                <Button loading={isLoading} htmlType="submit" type="primary">
                  {t("Saqlash")}
                </Button>
              </div>
            </div>
          );
        }}
      </Form>
    </Modal>
  );
}

export default ModalData;
