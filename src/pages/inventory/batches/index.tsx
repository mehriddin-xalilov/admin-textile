import { Tag } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Pagination, Panel, Table } from "../../../components";
import useAccess from "../../../hooks/useAccess";
import useHooks from "../../../hooks/useHooks";
import Get from "../../../modules/get";
import { BATCH_STATUSES, COUNTRIES, statusColor, statusLabel } from "../../../services/constants";

const Batches = () => {
  const { t, query, navigate } = useHooks();
  const { isCreate, isUpdate, isDelete } = useAccess("inventory-batches");

  return (
    <Get name="inventory-batches" url="/inventory-batches" params={{ include: "creator", page: get(query, "page", 1), limit: get(query, "limit", 50), filter: { status: get(query, "status") } }}>
      {({ items, isLoading, meta }) => (
        <Panel title={t("Kelgan partiyalar")} meta={meta} hasButton={isCreate} onClick={() => navigate("/inventory/batches/create")}>
          <Table
            items={items}
            isLoading={isLoading}
            size="small"
            name="inventory-batches"
            url="/inventory-batches"
            hasEdit={(item) => isUpdate && item.status === "draft"}
            hasDelete={(item) => isDelete && item.status === "draft"}
            editAction={(item) => navigate(`/inventory/batches/update/${item.id}`)}
            onRow={(item) => ({ onClick: () => navigate(`/inventory/batches/view/${item.id}`), className: "cursor-pointer" })}
            columns={[
              { title: t("Raqam"), dataIndex: "number", render: (v, row) => <Link to={`/inventory/batches/view/${row.id}`}>{v}</Link> },
              { title: t("Davlat"), dataIndex: "supplier_country", render: (v) => COUNTRIES.find((c) => c.value === v)?.label || v },
              { title: t("Yetkazuvchi"), dataIndex: "supplier_name", render: (v) => v || "—" },
              { title: t("Pozitsiyalar"), dataIndex: "items_count", width: 100 },
              { title: t("Jami dona"), dataIndex: "total_quantity", width: 100 },
              { title: t("Kelgan sana"), dataIndex: "arrived_at", render: (v) => v ? dayjs(v).format("DD.MM.YYYY") : "—" },
              { title: t("Kiritdi"), dataIndex: ["creator", "full_name"] },
              { title: t("Holati"), dataIndex: "status", render: (v) => <Tag color={statusColor(BATCH_STATUSES, v)}>{t(statusLabel(BATCH_STATUSES, v))}</Tag> },
            ]}
          />
          <Pagination meta={meta} rootClassName="!mt-4" align="end" />
        </Panel>
      )}
    </Get>
  );
};

export default Batches;
