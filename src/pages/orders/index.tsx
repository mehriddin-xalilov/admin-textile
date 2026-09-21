import { Input, Segmented, Tag } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Pagination, Panel, Table } from "../../components";
import useHooks from "../../hooks/useHooks";
import Get from "../../modules/get";
import { helpers } from "../../services";
import { ORDER_STATUSES, PAYMENT_STATUSES, statusColor, statusLabel } from "../../services/constants";

const Orders = ({ userId }: { userId?: number }) => {
  const { t, query, navigate, qs } = useHooks();
  const status = get(query, "filter.status", get(query, "status", ""));

  return (
    <Get name="orders" url="/orders" params={{ page: get(query, "page", 1), limit: get(query, "limit", 50), filter: { user_id: userId, status, search: get(query, "search"), payment_status: get(query, "payment_status") } }}>
      {({ items, isLoading, meta }) => (
        <Panel
          title={t("Buyurtmalar")}
          meta={meta}
          hasButton={false}
          headerRight={<Input.Search allowClear placeholder={t("Raqam")} defaultValue={get(query, "search")} onSearch={(search: string) => navigate({ search: qs.stringify({ ...query, search: search || undefined, page: 1 }) })} />}
        >
          <div className="mb-4 overflow-x-auto">
            <Segmented
              value={status}
              onChange={(v) => navigate({ search: qs.stringify({ ...query, filter: undefined, status: v || undefined, page: 1 }) })}
              options={[{ label: t("Barchasi"), value: "" }, ...Object.entries(ORDER_STATUSES).map(([value, s]) => ({ label: t(s.label), value }))]}
            />
          </div>
          <Table
            items={items}
            isLoading={isLoading}
            size="small"
            name="orders"
            onRow={(item) => ({ onClick: () => navigate(`/orders/view/${item.id}`), className: "cursor-pointer" })}
            columns={[
              { title: t("Raqam"), dataIndex: "number", render: (v, row) => <Link to={`/orders/view/${row.id}`}>{v}</Link> },
              { title: t("Mijoz"), render: (_, r) => <span>{get(r, "user.full_name")}<br /><span className="text-gray-500 text-xs">{helpers.formatInputPhoneNumber(get(r, "user.phone_number", ""))}</span></span> },
              { title: t("Pozitsiyalar"), dataIndex: "items_count", width: 100 },
              { title: t("Summa"), dataIndex: "total", render: (v) => `${helpers.beatifyPrice(v)} UZS` },
              { title: t("To'lov"), dataIndex: "payment_status", render: (v) => <Tag color={statusColor(PAYMENT_STATUSES, v)}>{t(statusLabel(PAYMENT_STATUSES, v))}</Tag> },
              { title: t("Holati"), dataIndex: "status", render: (v) => <Tag color={statusColor(ORDER_STATUSES, v)}>{t(statusLabel(ORDER_STATUSES, v))}</Tag> },
              { title: t("Sana"), dataIndex: "created_at", render: (v) => dayjs(v).format("DD.MM.YYYY HH:mm") },
            ]}
          />
          <Pagination meta={meta} rootClassName="!mt-4" align="end" />
        </Panel>
      )}
    </Get>
  );
};

export default Orders;
