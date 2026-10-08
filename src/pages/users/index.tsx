import { Input, Segmented, Switch, Tag, message } from "antd";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Pagination, Panel, Table } from "../../components";
import { usePost } from "../../hooks";
import useAccess from "../../hooks/useAccess";
import useHooks from "../../hooks/useHooks";
import Get from "../../modules/get";
import { helpers, useStore } from "../../services";

const Index = () => {
  const { t, query, navigate, qs, queryClient } = useHooks();
  const { mutate } = usePost();
  const { language } = useStore();
  const { isUpdate, isDelete, isCreate } = useAccess("users");

  return (
    <Get
      name="users"
      url="/users"
      params={{
        include: "roles",
        page: get(query, "page", 1),
        limit: get(query, "limit", 50),
        filter: { q: get(query, "q"), role: get(query, "role"), studio: get(query, "studio") || undefined },
      }}
    >
      {({ items, isLoading, meta }) => (
        <Panel
          title={t("Foydalanuvchilar")}
          meta={meta}
          hasButton={isCreate}
          onClick={() => navigate("/users/create")}
          headerRight={
            <Input.Search allowClear
              placeholder={t("Ism yoki telefon")}
              defaultValue={get(query, "q")}
              onSearch={(q: string) => navigate({ search: qs.stringify({ ...query, q: q || undefined, page: 1 }) })}
            />
          }
        >
          <Segmented
            className="mb-4"
            value={get(query, "studio", "")}
            onChange={(v) => navigate({ search: qs.stringify({ ...query, studio: (v as string) || undefined, page: 1 }) })}
            options={[
              { value: "", label: t("Barchasi") },
              { value: "pending", label: t("Konstruktor ruxsatini kutmoqda") },
              { value: "approved", label: t("Ruxsat berilgan") },
            ]}
          />
          <Table
            items={items}
            size="small"
            isLoading={isLoading}
            hasDelete={isDelete}
            hasEdit={isUpdate}
            editAction={(item: any) => navigate(`/users/update/${item.id}`)}
            onRow={(item) => ({ onClick: () => navigate(`/users/view/${item.id}`), className: "cursor-pointer" })}
            name="users"
            url="/users"
            columns={[
              { title: t("ID"), dataIndex: "id", width: 60 },
              { title: t("To'liq ismi"), render: (_, row) => <Link to={`/users/view/${row.id}`}>{row.full_name}</Link> },
              { title: t("Telefon"), dataIndex: "phone_number", render: (v) => helpers.formatInputPhoneNumber(v) },
              { title: t("Rol"), dataIndex: "roles", render: (roles) => roles?.map((r: any) => <Tag color="green" key={r.id}>{get(r, `name_${language}`, r.name)}</Tag>) },
              { title: t("Buyurtmalar"), dataIndex: "orders_count", width: 110 },
              { title: t("Konstruktor"), dataIndex: "studio_access", width: 130, render: (v: boolean, row: any) => (
                <span onClick={(e) => e.stopPropagation()}>
                  <Switch
                    size="small"
                    checked={!!v}
                    disabled={!isUpdate}
                    onChange={(approved) => mutate({ url: `/users/${row.id}/studio-access`, method: "put", data: { approved } }, {
                      onSuccess: () => { message.success(approved ? t("Konstruktor ochildi") : t("Konstruktor yopildi")); queryClient.invalidateQueries({ queryKey: ["users"] }); queryClient.invalidateQueries({ queryKey: ["notifications"] }); },
                    })}
                  />
                  {!v && <Tag color="orange" className="!ml-2">{t("Kutmoqda")}</Tag>}
                </span>
              ) },
              { type: "switch", title: t("Holati"), dataIndex: "status", width: 90 },
            ]}
          />
          <Pagination meta={meta} rootClassName="!mt-4" align="end" />
        </Panel>
      )}
    </Get>
  );
};

export default Index;
