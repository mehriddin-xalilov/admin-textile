import { Input, Tag } from "antd";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Pagination, Panel, Table } from "../../../components";
import useAccess from "../../../hooks/useAccess";
import useHooks from "../../../hooks/useHooks";
import Get from "../../../modules/get";
import { helpers } from "../../../services";
import { COUNTRIES } from "../../../services/constants";

const Products = () => {
  const { t, query, navigate, qs } = useHooks();
  const { isCreate, isUpdate, isDelete } = useAccess("products");

  return (
    <Get
      name="products"
      url="/products"
      params={{
        include: "category,colors.color",
        page: get(query, "page", 1),
        limit: get(query, "limit", 50),
        filter: { search: get(query, "search"), category_id: get(query, "category_id"), status: get(query, "status") },
      }}
    >
      {({ items, isLoading, meta }) => (
        <Panel
          title={t("Mahsulotlar")}
          meta={meta}
          hasButton={isCreate}
          onClick={() => navigate("/products/create")}
          headerRight={
            <Input.Search allowClear
              placeholder={t("Qidirish")}
              defaultValue={get(query, "search")}
              onSearch={(search: string) => navigate({ search: qs.stringify({ ...query, search: search || undefined, page: 1 }) })}
            />
          }
        >
          <Table
            items={items}
            size="small"
            isLoading={isLoading}
            name="products"
            url="/products"
            hasEdit={isUpdate}
            hasDelete={isDelete}
            hasSwitch={isUpdate}
            editAction={(item) => navigate(`/products/update/${item.id}`)}
            onRow={(item) => ({ onClick: () => navigate(`/products/view/${item.id}`), className: "cursor-pointer" })}
            columns={[
              { title: t("ID"), dataIndex: "id", width: 60 },
              { title: t("Nomi"), render: (_, row) => <Link to={`/products/view/${row.id}`}>{row.name}</Link> },
              { title: t("Kategoriya"), dataIndex: ["category", "name"] },
              { title: t("Ranglar"), dataIndex: "colors", render: (colors = []) => <span className="flex gap-1">{colors.map((c: any) => <span key={c.id} title={get(c, "color.name")} className="w-4 h-4 rounded-full border border-gray-300" style={{ background: get(c, "color.hex") }} />)}</span> },
              { title: t("Narx"), dataIndex: "base_price", render: (v) => `${helpers.beatifyPrice(v)} UZS` },
              { title: t("Bosma"), dataIndex: "print_price", render: (v) => `${helpers.beatifyPrice(v)} UZS` },
              { title: t("Qoldiq"), dataIndex: "available_stock", width: 90, render: (v) => <Tag color={v > 0 ? "green" : "red"}>{v}</Tag> },
              { title: t("Davlat"), dataIndex: "origin_country", width: 90, render: (v) => COUNTRIES.find((c) => c.value === v)?.label || "—" },
              { type: "switch", title: t("Holati"), dataIndex: "status", width: 90 },
            ]}
          />
          <Pagination meta={meta} rootClassName="!mt-4" align="end" />
        </Panel>
      )}
    </Get>
  );
};

export default Products;
