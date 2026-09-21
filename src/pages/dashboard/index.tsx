import { Card, Statistic, Table as AntTable, Tag, Typography } from "antd";
import { get } from "lodash";
import { Panel, Spin } from "../../components";
import { useGet } from "../../hooks";
import useHooks from "../../hooks/useHooks";
import { helpers } from "../../services";
import { ORDER_STATUSES, statusColor, statusLabel } from "../../services/constants";

/** Bosh sahifa: GET /dashboard — buyurtmalar, tushum, ombor, mijozlar. */
const Dashboard = () => {
  const { t, navigate } = useHooks();
  const { data, isLoading } = useGet({ name: "dashboard", url: "/dashboard" });
  const stats = get(data, "data", {});

  const cards = [
    { title: t("Bugungi buyurtmalar"), value: get(stats, "orders.today", 0) },
    { title: t("Jami buyurtmalar"), value: get(stats, "orders.total", 0) },
    { title: t("Yetkazilgan tushum"), value: helpers.beatifyPrice(get(stats, "revenue.total", 0)), suffix: "UZS" },
    { title: t("Omborda mavjud"), value: get(stats, "stock.available", 0), suffix: t("dona") },
    { title: t("Kam qolgan (≤5)"), value: get(stats, "stock.low_stock_variants", 0), danger: true },
    { title: t("Mijozlar"), value: get(stats, "customers.total", 0) },
    { title: t("Yangi mijozlar (oy)"), value: get(stats, "customers.new_this_month", 0) },
    { title: t("Dizaynlar"), value: get(stats, "designs.total", 0) },
  ];

  const byStatus = Object.entries(get(stats, "orders.by_status", {})).map(([key, v]: any) => ({ key, ...v }));

  return (
    <Spin spinning={isLoading}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {cards.map((c, i) => (
          <Card key={i} size="small" className="rounded-2xl">
            <Statistic title={c.title} value={c.value} suffix={c.suffix} valueStyle={c.danger && Number(c.value) > 0 ? { color: "#cf1322" } : undefined} />
          </Card>
        ))}
      </div>
      <Panel title={t("Buyurtmalar holati bo'yicha")} hasButton={false}>
        <AntTable
          size="small"
          pagination={false}
          rowKey="key"
          dataSource={byStatus}
          onRow={(row) => ({ onClick: () => navigate(`/orders?filter[status]=${row.key}`), className: "cursor-pointer" })}
          columns={[
            { title: t("Holat"), dataIndex: "key", render: (v) => <Tag color={statusColor(ORDER_STATUSES, v)}>{t(statusLabel(ORDER_STATUSES, v))}</Tag> },
            { title: t("Soni"), dataIndex: "count" },
            { title: t("Summa"), dataIndex: "total", render: (v) => <Typography.Text>{helpers.beatifyPrice(v)} UZS</Typography.Text> },
          ]}
        />
      </Panel>
    </Spin>
  );
};

export default Dashboard;
