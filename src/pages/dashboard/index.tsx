import { Table as AntTable, Progress, Tag } from "antd";
import { get } from "lodash";
import { Panel, Spin } from "../../components";
import { useGet } from "../../hooks";
import useHooks from "../../hooks/useHooks";
import { helpers } from "../../services";
import { ORDER_STATUSES, statusColor, statusLabel } from "../../services/constants";
import {
  BagIcon,
  BoxIcon,
  DangerIcon,
  PaletteIcon,
  UsersGroupTwoRoundedIcon,
  WalletIcon,
} from "../../assets/icon/components/solar-bold-duotone-icons";

type CardItem = {
  title: string;
  value: string | number;
  suffix?: string;
  icon: React.ComponentType<any>;
  tone: "blue" | "green" | "violet" | "amber" | "rose" | "slate";
  hint?: string;
};

const TONES: Record<CardItem["tone"], { bg: string; fg: string }> = {
  blue: { bg: "bg-blue-50", fg: "!text-blue-600" },
  green: { bg: "bg-emerald-50", fg: "!text-emerald-600" },
  violet: { bg: "bg-violet-50", fg: "!text-violet-600" },
  amber: { bg: "bg-amber-50", fg: "!text-amber-600" },
  rose: { bg: "bg-rose-50", fg: "!text-rose-600" },
  slate: { bg: "bg-slate-100", fg: "!text-slate-600" },
};

/** Bosh sahifa: GET /dashboard — buyurtmalar, tushum, ombor, mijozlar. */
const Dashboard = () => {
  const { t, navigate } = useHooks();
  const { data, isLoading } = useGet({ name: "dashboard", url: "/dashboard" });
  const stats = get(data, "data", {});

  const cards: CardItem[] = [
    { title: t("Bugungi buyurtmalar"), value: get(stats, "orders.today", 0), icon: BagIcon, tone: "blue" },
    { title: t("Jami buyurtmalar"), value: get(stats, "orders.total", 0), icon: BagIcon, tone: "slate" },
    { title: t("Yetkazilgan tushum"), value: helpers.beatifyPrice(get(stats, "revenue.total", 0)), suffix: "UZS", icon: WalletIcon, tone: "green" },
    { title: t("Omborda mavjud"), value: get(stats, "stock.available", 0), suffix: t("dona"), icon: BoxIcon, tone: "violet" },
    { title: t("Kam qolgan (≤5)"), value: get(stats, "stock.low_stock_variants", 0), icon: DangerIcon, tone: "rose", hint: t("Variantlar") },
    { title: t("Mijozlar"), value: get(stats, "customers.total", 0), icon: UsersGroupTwoRoundedIcon, tone: "blue" },
    { title: t("Yangi mijozlar (oy)"), value: get(stats, "customers.new_this_month", 0), icon: UsersGroupTwoRoundedIcon, tone: "amber" },
    { title: t("Dizaynlar"), value: get(stats, "designs.total", 0), icon: PaletteIcon, tone: "violet" },
  ];

  const byStatus = Object.entries(get(stats, "orders.by_status", {})).map(([key, v]: any) => ({ key, ...v }));
  const maxCount = Math.max(1, ...byStatus.map((r: any) => Number(r.count || 0)));

  return (
    <Spin spinning={isLoading}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {cards.map((c, i) => {
          const tone = TONES[c.tone];
          const Icon = c.icon;

          return (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-[0_10px_28px_-16px_rgba(15,23,42,0.35)] transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[13px] text-gray-500 dark:text-gray-400 truncate">{c.title}</div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      {typeof c.value === "number" ? c.value.toLocaleString("uz-UZ") : c.value}
                    </span>
                    {c.suffix && <span className="text-xs font-semibold text-gray-400">{c.suffix}</span>}
                  </div>
                  {c.hint && <div className="text-[11px] text-gray-400 mt-0.5">{c.hint}</div>}
                </div>
                <span className={`w-10 h-10 rounded-xl ${tone.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`!w-5 !h-5 ${tone.fg}`} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Panel title={t("Buyurtmalar holati bo'yicha")} hasButton={false}>
        <AntTable
          size="middle"
          pagination={false}
          rowKey="key"
          dataSource={byStatus}
          onRow={(row) => ({ onClick: () => navigate(`/orders?filter[status]=${row.key}`), className: "cursor-pointer" })}
          columns={[
            {
              title: t("Holat"),
              dataIndex: "key",
              width: 200,
              render: (v) => <Tag color={statusColor(ORDER_STATUSES, v)}>{t(statusLabel(ORDER_STATUSES, v))}</Tag>,
            },
            {
              title: t("Soni"),
              dataIndex: "count",
              width: 240,
              render: (v: number) => (
                <div className="flex items-center gap-3">
                  <span className="w-8 font-bold text-gray-900 dark:text-white tabular-nums">{v}</span>
                  <Progress
                    percent={Math.round((Number(v || 0) / maxCount) * 100)}
                    showInfo={false}
                    size="small"
                    className="!mb-0 flex-1"
                  />
                </div>
              ),
            },
            {
              title: t("Summa"),
              dataIndex: "total",
              align: "right",
              render: (v) => <span className="font-semibold text-gray-900 dark:text-white">{helpers.beatifyPrice(v)} UZS</span>,
            },
          ]}
        />
      </Panel>
    </Spin>
  );
};

export default Dashboard;
