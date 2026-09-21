import { Image, Tag } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Pagination, Panel, Table } from "../../components";
import useHooks from "../../hooks/useHooks";
import Get from "../../modules/get";
import { useStore } from "../../services";
import { DESIGN_STATUSES, statusColor, statusLabel } from "../../services/constants";

const Designs = ({ userId }: { userId?: number }) => {
  const { t, query, navigate } = useHooks();
  const { language } = useStore();

  return (
    <Get name="designs" url="/designs" params={{ page: get(query, "page", 1), limit: get(query, "limit", 50), filter: { user_id: userId, status: get(query, "status") } }}>
      {({ items, isLoading, meta }) => (
        <Panel title={t("Dizaynlar")} meta={meta} hasButton={false}>
          <Table
            items={items}
            isLoading={isLoading}
            size="small"
            name="designs"
            onRow={(item) => ({ onClick: () => navigate(`/designs/view/${item.id}`), className: "cursor-pointer" })}
            columns={[
              { title: t("ID"), dataIndex: "id", width: 60 },
              { title: t("Preview"), dataIndex: ["preview", "src"], width: 80, render: (v) => v ? <Image src={v} width={48} className="rounded" preview={false} /> : "—" },
              { title: t("Nomi"), dataIndex: "name", render: (v, row) => <Link to={`/designs/view/${row.id}`}>{v || `#${row.id}`}</Link> },
              { title: t("Mijoz"), render: (_, r) => <Link to={`/users/view/${get(r, "user.id")}`} onClick={(e) => e.stopPropagation()}>{get(r, "user.full_name")}</Link> },
              { title: t("Mahsulot"), render: (_, r) => get(r, `product.name_${language}`, get(r, "product.name")) },
              { title: t("Rang"), render: (_, r) => <span className="inline-flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-gray-300" style={{ background: get(r, "product_color.color.hex") }} />{get(r, "product_color.color.name")}</span> },
              { title: t("Holati"), dataIndex: "status", render: (v) => <Tag color={statusColor(DESIGN_STATUSES, v)}>{t(statusLabel(DESIGN_STATUSES, v))}</Tag> },
              { title: t("Yangilangan"), dataIndex: "updated_at", render: (v) => dayjs(v).format("DD.MM.YYYY HH:mm") },
            ]}
          />
          <Pagination meta={meta} rootClassName="!mt-4" align="end" />
        </Panel>
      )}
    </Get>
  );
};

export default Designs;
