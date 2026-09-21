import { Descriptions, Image, Popconfirm, Select, Table as AntTable, Tag, Timeline } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Panel, Spin, ViewLayout, notification } from "../../components";
import { useGet, usePost } from "../../hooks";
import useAccess from "../../hooks/useAccess";
import useHooks from "../../hooks/useHooks";
import { helpers } from "../../services";
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, statusColor, statusLabel } from "../../services/constants";
import Design3D from "../../components/design-3d";

const OrderView = () => {
  const { t, params, queryClient } = useHooks();
  const { isUpdate } = useAccess("orders");
  const id = get(params, "id");
  const { data, isLoading } = useGet({ url: `/orders/${id}`, name: "orders", queryOptions: { enabled: !!id } });
  const { mutate, isLoading: isSaving } = usePost();
  const o = get(data, "data", {});
  const [comment, setComment] = React.useState("");

  const refresh = () => { queryClient.invalidateQueries({ queryKey: ["orders"] }); queryClient.invalidateQueries({ queryKey: ["variants"] }); };
  const onError = (e: any) => notification({ type: "error", message: get(e, "response.data.message", t("Xatolik")) });

  const changeStatus = (status: string) =>
    mutate({ url: `/orders/${id}/status`, method: "post", data: { status, comment: comment || undefined } }, {
      onSuccess: () => { setComment(""); refresh(); notification({ type: "success", message: t("Holat o'zgartirildi") }); },
      onError,
    });

  const updatePayment = (payload: Record<string, string | undefined>) =>
    mutate({ url: `/orders/${id}/payment`, method: "post", data: { payment_status: get(o, "payment_status"), payment_method: get(o, "payment_method"), ...payload } }, {
      onSuccess: () => { refresh(); notification({ type: "success", message: t("Saqlandi") }); },
      onError,
    });

  const transitions: string[] = get(o, "allowed_transitions", []);

  return (
    <Spin spinning={isLoading}>
      <ViewLayout
        header={{
          title: get(o, "number"),
          subtitle: dayjs(get(o, "created_at")).format("DD.MM.YYYY HH:mm"),
          extra: <Tag color={statusColor(ORDER_STATUSES, get(o, "status"))} className="text-base px-3 py-1">{t(statusLabel(ORDER_STATUSES, get(o, "status")))}</Tag>,
        }}
        left={
          <div className="flex flex-col gap-4">
            <Panel title={t("Mijoz va yetkazish")} hasButton={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t("Mijoz")}><Link to={`/users/view/${get(o, "user.id")}`}>{get(o, "user.full_name")}</Link></Descriptions.Item>
                <Descriptions.Item label={t("Qabul qiluvchi")}>{get(o, "recipient_name")}</Descriptions.Item>
                <Descriptions.Item label={t("Telefon")}>{helpers.formatInputPhoneNumber(get(o, "recipient_phone", ""))}</Descriptions.Item>
                <Descriptions.Item label={t("Manzil")}>{get(o, "delivery_address")}</Descriptions.Item>
                <Descriptions.Item label={t("Izoh")}>{get(o, "note") || "—"}</Descriptions.Item>
              </Descriptions>
            </Panel>
            <Panel title={t("To'lov")} hasButton={false}>
              {/* Summa: kartochka, jami ajratilgan */}
              <div className="rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t("Mahsulotlar")}</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{helpers.beatifyPrice(get(o, "subtotal", 0))} <span className="text-xs">UZS</span></span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t("Yetkazish")}</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{Number(get(o, "delivery_fee", 0)) > 0 ? <>{helpers.beatifyPrice(get(o, "delivery_fee", 0))} <span className="text-xs">UZS</span></> : t("Bepul")}</span>
                </div>
                {Number(get(o, "discount", 0)) > 0 && (
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{t("Chegirma")}</span>
                    <span className="text-emerald-600 font-medium">−{helpers.beatifyPrice(get(o, "discount", 0))} <span className="text-xs">UZS</span></span>
                  </div>
                )}
                <div className="border-t border-dashed border-gray-300 dark:border-white/15 pt-3 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t("Jami")}</span>
                  <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{helpers.beatifyPrice(get(o, "total", 0))} <span className="text-sm font-medium text-gray-500">UZS</span></span>
                </div>
              </div>

              {/* Holat + usul */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("To'lov holati")}</div>
                  <Select
                    className="w-full"
                    disabled={!isUpdate}
                    value={get(o, "payment_status")}
                    onChange={(v) => updatePayment({ payment_status: v })}
                    options={Object.entries(PAYMENT_STATUSES).map(([value, s]) => ({
                      value,
                      label: <span className="inline-flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${{ unpaid: "bg-red-500", paid: "bg-emerald-500", refunded: "bg-orange-500" }[value]}`} />{t(s.label)}</span>,
                    }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("To'lov usuli")}</div>
                  <Select className="w-full" disabled={!isUpdate} value={get(o, "payment_method")} placeholder={t("Tanlang")} options={PAYMENT_METHODS} onChange={(v) => updatePayment({ payment_method: v })} />
                </div>
              </div>
              {(get(o, "transactions", []) as any[]).length > 0 && (
                <div className="mt-3 space-y-1">
                  {(get(o, "transactions", []) as any[]).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="uppercase font-semibold">{tx.provider} <span className="font-normal">#{tx.provider_transaction_id}</span></span>
                      <span>{helpers.beatifyPrice(tx.amount)} · <Tag color={tx.state === "performed" ? "green" : tx.state === "cancelled" ? "red" : "orange"}>{tx.state}</Tag></span>
                    </div>
                  ))}
                </div>
              )}
              {get(o, "payment_status") === "paid" ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{t("To'langan")}</div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{t("To'lov kutilmoqda")}</div>
              )}
            </Panel>
            {isUpdate && transitions.length > 0 && (
              <Panel title={t("Holatni o'zgartirish")} hasButton={false}>
                <input className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" placeholder={t("Izoh (ixtiyoriy)")} value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="flex flex-wrap gap-2">
                  {transitions.map((s) => (
                    <Popconfirm key={s} title={`${t(statusLabel(ORDER_STATUSES, s))}?`} onConfirm={() => changeStatus(s)}>
                      <Button loading={isSaving} danger={s === "cancelled"} type={s === "cancelled" ? "default" : "primary"}>{t(statusLabel(ORDER_STATUSES, s))}</Button>
                    </Popconfirm>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        }
        right={
          <div className="flex flex-col gap-4">
            <Panel title={t("Pozitsiyalar")} hasButton={false}>
              <AntTable
                size="small"
                pagination={false}
                rowKey="id"
                dataSource={get(o, "items", []) as any[]}
                columns={[
                  { title: t("Dizayn"), width: 80, render: (_, r) => get(r, "design.preview.src") ? <Image src={get(r, "design.preview.src")} width={48} className="rounded" /> : <span className="text-gray-400">{t("Logosiz")}</span> },
                  { title: t("Mahsulot"), dataIndex: "product_name", render: (v, r) => (
                    <span>
                      {v}{r.design_id && <Link to={`/designs/view/${r.design_id}`} className="ml-2 text-xs">#{r.design_id}</Link>}
                      {(get(r, "design.summary", []) as any[]).map((s, i) => (
                        <div key={i} className="text-xs text-gray-500">{s.side === "back" ? t("Orqa") : t("Old")} · {s.area}: {s.label}{s.size_cm ? ` (${s.size_cm})` : ""}</div>
                      ))}
                    </span>
                  ) },
                  { title: t("Rang"), render: (_, r) => <span className="inline-flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-gray-300" style={{ background: r.color_hex }} />{r.color_name}</span> },
                  { title: t("Razmer"), dataIndex: "size_name", width: 80 },
                  { title: t("Soni"), dataIndex: "quantity", width: 70 },
                  { title: t("Narx"), dataIndex: "unit_price", render: (v) => helpers.beatifyPrice(v) },
                  { title: t("Bosma"), dataIndex: "print_price", render: (v) => helpers.beatifyPrice(v) },
                  { title: t("Jami"), dataIndex: "total_price", render: (v) => <b>{helpers.beatifyPrice(v)}</b> },
                  { title: t("Fayl"), width: 80, render: (_, r) => get(r, "print_file.src") ? <a href={get(r, "print_file.src")} target="_blank" rel="noreferrer">{t("Yuklab olish")}</a> : "—" },
                ]}
              />
            </Panel>
            {(get(o, "items", []) as any[]).filter((i) => get(i, "design.engine") === "shirt-designer-3d").map((i) => (
              <Panel key={i.id} title={`${t("3D ko'rinish")} — ${i.product_name} · ${i.color_name} · ${i.size_name}`} hasButton={false}>
                <Design3D design={get(i, "design")} height={460} />
              </Panel>
            ))}
            <Panel title={t("Tarix")} hasButton={false}>
              <Timeline
                items={(get(o, "histories", []) as any[]).map((h: any) => ({
                  color: statusColor(ORDER_STATUSES, h.to_status) as string,
                  children: (
                    <div>
                      <b>{t(statusLabel(ORDER_STATUSES, h.to_status))}</b>
                      <span className="text-gray-500 text-xs ml-2">{dayjs(h.created_at).format("DD.MM.YYYY HH:mm")} · {get(h, "changed_by.full_name", "—")}</span>
                      {h.comment && <div className="text-sm text-gray-600 dark:text-gray-300">{h.comment}</div>}
                    </div>
                  ),
                }))}
              />
            </Panel>
          </div>
        }
      />
    </Spin>
  );
};

export default OrderView;
