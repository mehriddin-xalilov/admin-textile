import { Avatar, Descriptions, Tag } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import { Button, Panel, Spin, Tabs, ViewLayout } from "../../components";
import { useGet } from "../../hooks";
import useAccess from "../../hooks/useAccess";
import useHooks from "../../hooks/useHooks";
import { helpers, useStore } from "../../services";
import Orders from "../orders";
import Designs from "../designs";

const UserView = () => {
  const { t, params, navigate, query } = useHooks();
  const { language } = useStore();
  const { isUpdate } = useAccess("users");
  const id = get(params, "id");
  const tab = get(query, "tab", "orders");

  const { data, isLoading } = useGet({ url: `/users/${id}`, name: "users", params: { include: "roles,avatar" }, queryOptions: { enabled: !!id } });
  const user = get(data, "data", {});

  return (
    <Spin spinning={isLoading}>
      <ViewLayout
        header={{
          logo: <Avatar size={56} src={get(user, "avatar.src")} className="bg-blue-500">{get(user, "first_name[0]", "")}</Avatar>,
          title: get(user, "full_name"),
          subtitle: helpers.formatInputPhoneNumber(get(user, "phone_number", "")),
          extra: isUpdate && <Button type="primary" onClick={() => navigate(`/users/update/${id}`)}>{t("Tahrirlash")}</Button>,
        }}
        left={
          <Panel header={false}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("Email")}>{get(user, "email") || "—"}</Descriptions.Item>
              <Descriptions.Item label={t("Rollar")}>{get(user, "roles", []).map((r: any) => <Tag key={r.id} color="blue">{get(r, `name_${language}`, r.name)}</Tag>)}</Descriptions.Item>
              <Descriptions.Item label={t("Holati")}><Tag color={get(user, "status") === "active" ? "green" : "red"}>{get(user, "status")}</Tag></Descriptions.Item>
              <Descriptions.Item label={t("Buyurtmalar")}>{get(user, "orders_count", 0)}</Descriptions.Item>
              <Descriptions.Item label={t("Dizaynlar")}>{get(user, "designs_count", 0)}</Descriptions.Item>
              <Descriptions.Item label={t("Oxirgi kirish")}>{get(user, "last_login_at") ? dayjs(get(user, "last_login_at")).format("DD.MM.YYYY HH:mm") : "—"}</Descriptions.Item>
              <Descriptions.Item label={t("Ro'yxatdan o'tgan")}>{dayjs(get(user, "created_at")).format("DD.MM.YYYY")}</Descriptions.Item>
            </Descriptions>
          </Panel>
        }
        right={
          <div className="flex flex-col gap-4">
            <Tabs options={[{ label: t("Buyurtmalar"), value: "orders" }, { label: t("Dizaynlar"), value: "designs" }]} defaultValue="orders" />
            {tab === "designs" ? <Designs userId={Number(id)} /> : <Orders userId={Number(id)} />}
          </div>
        }
      />
    </Spin>
  );
};

export default UserView;
