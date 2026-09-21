
import { get } from "lodash";
import Form from "../../../modules/form.tsx";
import { Button, Fields, notification, Panel, Spin } from "../../../components";
import { useTranslation } from "react-i18next";
import config from "../../../../config.ts";
import { Field } from "formik";
import { useParams } from "react-router-dom";
import { useGet } from "../../../hooks/index.tsx";
import { Typography, Checkbox } from "antd";
import Get from "../../../modules/get.tsx";
import { useStore } from "../../../services/index.ts";

function RolesModalData() {
  const { id } = useParams()
  const { t } = useTranslation();
  const { language } = useStore();
  const { data } = useGet({
    name: 'roles',
    url: `/roles/${id}`,
    queryOptions: {
      enabled: !!id
    }
  })
  return (
    <>
      <Panel>
        <Form
          name={"roles"}
          method={get(data, "data.id") ? "put" : "post"}
          url={
            get(data, "data.id")
              ? `/roles/${get(data, "data.id")}`
              : `/roles`
          }
          onSuccess={() => {
            notification({
              type: "success",
              message: t("Muvaffaqiyatli saqlandi")
            });
          }}
          fields={[
            ...config.API_LANGUAGES.map((item) => ({
              name: `name_${get(item, "code")}`,
              value: get(data, `data.name_${get(item, "code")}`),
              required: true
            })),
            {
              name: "name",
              value: get(data, "data.name"),
              required: true
            },
            {
              name: "status",
              value: get(data, "data.status"),
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
                  disabled={get(data, 'data.id')}
                />
                <Field
                  component={Fields.Switch}
                  name="status"
                  label={t("Holati")}
                />
                <div className="flex justify-end gap-5">
                  <Button loading={isLoading} htmlType="submit" type="primary">
                    {t("Saqlash")}
                  </Button>
                </div>
              </div>
            );
          }}
        </Form>

      </Panel>
      {id ? <Panel className="mt-5" header={false}>
        <Get
          name={'permissions'}
          url={`/roles/${id}/permissions`}
        // params={{
        //   limit: 500
        // }}
        >
          {({ items }) => {
            return (
              <Form
                name="permissions"
                method="post"
                url={`/roles/${get(data, "data.id")}/permissions`}
                onSuccess={() => {
                  notification({
                    type: "success",
                    message: t("Muvaffaqiyatli saqlandi")
                  });
                }}
                fields={[
                  {
                    name: 'permission_ids',
                    type: 'object',
                    value: items.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: true }), {}),
                    onSubmitValue: (value: any) => {

                      return Object.keys(value).filter(key => value[key]).map(Number);
                    }
                  }
                ]}
              >
                {({ isLoading, values, setFieldValue }) => {

                  return <Spin spinning={isLoading}>
                    <Get
                      name={'permissions'}
                      url={`/permissions`}
                      params={{
                        limit: 500
                      }}
                    >
                      {({ items }) => {
                        const groupedPermissions: any = items.reduce((acc: any, curr: any) => {
                          const group = get(curr, 'name', '').split('.')[0] || 'other';
                          if (!acc[group]) acc[group] = [];
                          acc[group].push(curr);
                          return acc;
                        }, {});

                        const handleSelectAll = (checked: boolean) => {
                          const newPermissionIds = { ...values.permission_ids };
                          items.forEach((item: any) => {
                            newPermissionIds[item.id] = checked;
                          });
                          setFieldValue('permission_ids', newPermissionIds);
                        };

                        const handleSelectGroup = (groupItems: any[], checked: boolean) => {
                          const newPermissionIds = { ...values.permission_ids };
                          groupItems.forEach((item: any) => {
                            newPermissionIds[item.id] = checked;
                          });
                          setFieldValue('permission_ids', newPermissionIds);
                        };

                        const allSelected = items.length > 0 && items.every((item: any) => values.permission_ids[item.id]);

                        return (
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-600">
                              <Typography.Title level={4} className="text-lg">
                                {t("Ruxsatlar ro'yxati")}
                              </Typography.Title>
                              <Checkbox
                                checked={allSelected}
                                onChange={(e: any) => handleSelectAll(e.target.checked)}
                              >
                                {t("Barchasini tanlash")}
                              </Checkbox>
                            </div>

                            {Object.entries(groupedPermissions).map(([group, groupItems]: [string, any]) => {
                              const groupSelected = groupItems.every((item: any) => values.permission_ids[item.id]);
                              const groupIndeterminate = !groupSelected && groupItems.some((item: any) => values.permission_ids[item.id]);

                              return (
                                <div key={group} className="flex flex-col gap-3 border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
                                  <div className="flex items-center justify-between pb-2 mb-2">
                                    <Typography.Title level={4} className="capitalize">
                                      {t(group)}
                                    </Typography.Title>
                                    <Checkbox
                                      indeterminate={groupIndeterminate}
                                      checked={groupSelected}
                                      onChange={(e: any) => handleSelectGroup(groupItems, e.target.checked)}
                                    >
                                      {t("Guruhni tanlash")}
                                    </Checkbox>

                                  </div>
                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {groupItems.map((item: any) => (
                                      <div key={get(item, "id")} className="bg-gray-200 border-gray-100  dark:bg-gray-900 border dark:border-gray-700 p-2 rounded-lg">
                                        <Field
                                          component={Fields.Checkbox}
                                          name={`permission_ids.${get(item, "id")}`}
                                          label={get(item, `name_${language}`)}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )
                      }}
                    </Get>

                    <div className="flex justify-end gap-5 mt-6">
                      <Button loading={isLoading} htmlType="submit" type="primary">
                        {t("Saqlash")}
                      </Button>
                    </div>
                  </Spin>
                }}
              </Form>
            )
          }}
        </Get>
      </Panel> : null}


    </>
  );
}

export default RolesModalData;
