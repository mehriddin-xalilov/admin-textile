import { Descriptions, Popconfirm, Table as AntTable, Tag } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import { Button, notification, Panel, Spin, ViewLayout } from "../../../components";
import { useGet, usePost } from "../../../hooks";
import useHooks from "../../../hooks/useHooks";
import { helpers, useStore } from "../../../services";
import { BATCH_STATUSES, COUNTRIES, statusColor, statusLabel } from "../../../services/constants";

const BatchView = () => {
  const { t, params, navigate, queryClient } = useHooks();
  const { user, language } = useStore();
  const id = get(params, "id");
  const canReceive = get(user, "data.permissions", []).includes("inventory-batches.receive");

  const { data, isLoading } = useGet({ url: `/inventory-batches/${id}`, name: "inventory-batches", queryOptions: { enabled: !!id } });
  const { mutate, isLoading: isReceiving } = usePost();
  const b = get(data, "data", {});
  const isDraft = get(b, "status") === "draft";

  const receive = () =>
    mutate({ url: `/inventory-batches/${id}/receive`, method: "post" }, {
      onSuccess: () => {
        notification({ type: "success", message: t("Partiya omborga qabul qilindi") });
        queryClient.invalidateQueries({ queryKey: ["inventory-batches"] });
        queryClient.invalidateQueries({ queryKey: ["variants"] });
      },
      onError: (e: any) => notification({ type: "error", message: get(e, "response.data.message", t("Xatolik")) }),
    });

  return (
    <Spin spinning={isLoading}>
      <ViewLayout
        header={{
          title: get(b, "number"),
          subtitle: `${COUNTRIES.find((c) => c.value === get(b, "supplier_country"))?.label || ""} · ${get(b, "supplier_name") || ""}`,
          extra: (
            <div className="flex gap-2">
              {isDraft && <Button onClick={() => navigate(`/inventory/batches/update/${id}`)}>{t("Tahrirlash")}</Button>}
              {isDraft && canReceive && (
                <Popconfirm title={t("Omborga qabul qilinsinmi? Qoldiqlar oshadi.")} onConfirm={receive}>
                  <Button type="primary" loading={isReceiving}>{t("Omborga qabul qilish")}</Button>
                </Popconfirm>
              )}
            </div>
          ),
        }}
        left={
          <Panel header={false}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("Holati")}><Tag color={statusColor(BATCH_STATUSES, get(b, "status"))}>{t(statusLabel(BATCH_STATUSES, get(b, "status")))}</Tag></Descriptions.Item>
              <Descriptions.Item label={t("Kelgan sana")}>{get(b, "arrived_at") ? dayjs(get(b, "arrived_at")).format("DD.MM.YYYY") : "—"}</Descriptions.Item>
              <Descriptions.Item label={t("Qabul qilingan")}>{get(b, "received_at") ? dayjs(get(b, "received_at")).format("DD.MM.YYYY HH:mm") : "—"}</Descriptions.Item>
              <Descriptions.Item label={t("Jami dona")}>{get(b, "total_quantity", 0)}</Descriptions.Item>
              <Descriptions.Item label={t("Kiritdi")}>{get(b, "creator.full_name") || "—"}</Descriptions.Item>
              <Descriptions.Item label={t("Izoh")}>{get(b, "note") || "—"}</Descriptions.Item>
            </Descriptions>
          </Panel>
        }
        right={
          <Panel title={t("Pozitsiyalar")} hasButton={false}>
            <AntTable
              size="small"
              pagination={false}
              rowKey="id"
              dataSource={get(b, "items", [])}
              columns={[
                { title: t("Mahsulot"), render: (_, r) => get(r, `variant.product.name_${language}`, get(r, "variant.product.name")) },
                { title: t("Rang"), render: (_, r) => <span className="inline-flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-gray-300" style={{ background: get(r, "variant.product_color.color.hex") }} />{get(r, "variant.product_color.color.name")}</span> },
                { title: t("Razmer"), dataIndex: ["variant", "size", "name"], width: 90 },
                { title: "SKU", dataIndex: ["variant", "sku"] },
                { title: t("Miqdor"), dataIndex: "quantity", width: 90 },
                { title: t("Tannarx"), dataIndex: "unit_cost", render: (v) => v ? `${helpers.beatifyPrice(v)} UZS` : "—" },
              ]}
            />
          </Panel>
        }
      />
    </Spin>
  );
};

export default BatchView;
