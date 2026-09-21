import { Field } from "formik";
import { get } from "lodash";
import { Button, Fields, notification, Panel } from "../../components";
import { useGet } from "../../hooks";
import useHooks from "../../hooks/useHooks";
import Form from "../../modules/form";
import { useStore } from "../../services";
import { STATUS_OPTIONS } from "../../services/constants";

const UsersForm = () => {
  const { t, navigate, params } = useHooks();
  const { language } = useStore();
  const id = get(params, "id");

  const { data } = useGet({ url: `/users/${id}`, name: "users", params: { include: "roles,avatar" }, queryOptions: { enabled: !!id } });

  return (
    <Panel title={id ? t("Foydalanuvchini tahrirlash") : t("Yangi foydalanuvchi")} hasButton={false}>
      <Form
        name="users"
        method={id ? "put" : "post"}
        url={id ? `/users/${id}` : "/users"}
        fields={[
          { name: "first_name", value: get(data, "data.first_name"), required: true },
          { name: "last_name", value: get(data, "data.last_name") },
          { name: "phone_number", value: get(data, "data.phone_number"), required: true, onSubmitValue: (v: string) => v?.replace(/\s+/g, "") },
          { name: "email", value: get(data, "data.email"), type: "email" },
          { name: "password", value: undefined, required: !id },
          { name: "status", value: get(data, "data.status", "active") },
          { name: "avatar_id", type: "object", value: get(data, "data.avatar", null), onSubmitValue: (v: any) => get(v, "id", null) },
          { name: "role_ids", type: "array", value: get(data, "data.roles", []), onSubmitValue: (v: any[]) => v.map((r) => r.id) },
        ]}
        onSuccess={(res) => {
          notification({ type: "success", message: t("Muvaffaqiyatli saqlandi") });
          navigate(`/users/view/${get(res, "data.data.id", id)}`);
        }}
      >
        {({ isLoading }) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field component={Fields.Input} name="first_name" label={t("Ism")} />
            <Field component={Fields.Input} name="last_name" label={t("Familiya")} />
            <Field component={Fields.InputMask} mask="+998 ## ### ## ##" name="phone_number" label={t("Telefon")} />
            <Field component={Fields.Input} name="email" label={t("Email")} />
            <Field component={Fields.Password} name="password" label={id ? t("Yangi parol (ixtiyoriy)") : t("Parol")} />
            <Field component={Fields.Select} name="status" label={t("Holati")} options={STATUS_OPTIONS} />
            <Field component={Fields.AsyncSelect} name="role_ids" url="/roles" isMulti label={t("Rollar")} optionLabel={(o: any) => get(o, `name_${language}`, o.name)} loadOptionsParams={(search: string) => ({ filter: { search } })} />
            <Field component={Fields.UploadImg} name="avatar_id" label={t("Rasm")} multiple={false} />
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

export default UsersForm;
