import { Input, Modal, Segmented, Tag, Tooltip, message } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import qs from "qs";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Pagination, Panel, Table } from "../../components";
import { useGet, usePost } from "../../hooks";
import useHooks from "../../hooks/useHooks";
import Get from "../../modules/get";
import useAccess from "../../hooks/useAccess";

const fmt = (v?: string | null) => (v ? dayjs(v).format("DD.MM.YYYY HH:mm") : null);

/**
 * B2B lidlar: hamkorlik xati yuborilgan kompaniyalar.
 * Xatdagi havola `motex.uz/?c=<token>` ko'rinishida — kim bosgani, necha marta va ro'yxatdan o'tgan-o'tmagani shu yerda.
 */
const B2bLeads = () => {
  const { t, query, navigate, queryClient } = useHooks();
  const { mutate, isLoading: isSaving } = usePost();
  const access = useAccess("b2b-leads");
  const [note, setNote] = React.useState<{ id: number; text: string } | null>(null);
  const { data: stats } = useGet({ name: "b2b-leads-stats", url: "/b2b-leads/stats" }) as any;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["b2b-leads"] });
    queryClient.invalidateQueries({ queryKey: ["b2b-leads-stats"] });
  };
  const saveNote = () =>
    note && mutate({ url: `/b2b-leads/${note.id}`, method: "put", data: { note: note.text } }, {
      onSuccess: () => { message.success(t("Saqlandi")); refresh(); setNote(null); },
    });

  const view = get(query, "view", "clicked");
  const search = get(query, "search", "");
  const filter: Record<string, unknown> = { search: search || undefined };
  if (view === "clicked") filter.clicked = 1;
  if (view === "opened") { filter.opened = 1; filter.clicked = 0; }
  if (view === "silent") { filter.opened = 0; filter.clicked = 0; }

  const s = get(stats, "data", stats) || {};
  const cards = [
    { label: t("Yuborildi"), value: s.sent ?? "—", color: "text-gray-700" },
    { label: t("Ochdi"), value: s.opened ?? "—", color: "text-sky-600" },
    { label: t("Havolani bosdi"), value: s.clicked ?? "—", color: "text-emerald-600" },
    { label: t("Ro'yxatdan o'tdi"), value: s.registered ?? "—", color: "text-violet-600" },
  ];

  return (
    <Get name="b2b-leads" url="/b2b-leads" params={{ page: get(query, "page", 1), limit: get(query, "limit", 50), filter }}>
      {({ items, isLoading, meta }) => (
        <Panel title={t("B2B lidlar")} meta={meta} hasButton={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="text-xs text-gray-500">{c.label}</div>
                <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Segmented
              value={view}
              onChange={(v) => navigate({ search: qs.stringify({ ...query, view: v as string, page: 1 }) })}
              options={[
                { value: "clicked", label: t("Bosganlar") },
                { value: "opened", label: t("Faqat ochganlar") },
                { value: "silent", label: t("Javob yo'q") },
                { value: "all", label: t("Barchasi") },
              ]}
            />
            <Input.Search
              allowClear
              className="max-w-xs"
              defaultValue={search}
              placeholder={t("Kompaniya, email, telefon")}
              onSearch={(v) => navigate({ search: qs.stringify({ ...query, search: v || undefined, page: 1 }) })}
            />
          </div>

          <Table
            items={items}
            isLoading={isLoading}
            size="small"
            name="b2b-leads"
            columns={[
              { title: t("Kompaniya"), dataIndex: "company", render: (v: string, r: any) => (
                <div>
                  <div className="font-medium">{v || "—"}</div>
                  {get(r, "segment") && <div className="text-xs text-gray-400">{get(r, "segment")}</div>}
                </div>
              ) },
              { title: t("Aloqa"), render: (_: unknown, r: any) => (
                <div className="text-xs">
                  <a href={`mailto:${get(r, "email")}`} className="block">{get(r, "email")}</a>
                  {get(r, "phone") && <a href={`tel:${get(r, "phone")}`} className="block text-gray-500">{get(r, "phone")}</a>}
                </div>
              ) },
              { title: t("Yuborildi"), dataIndex: "sent_at", width: 130, render: (v: string) => <span className="text-xs">{fmt(v) || "—"}</span> },
              { title: t("Ochdi"), dataIndex: "opened_at", width: 130, render: (v: string) => v ? <Tooltip title={fmt(v)}><Tag color="blue">{dayjs(v).format("DD.MM HH:mm")}</Tag></Tooltip> : <span className="text-gray-300">—</span> },
              { title: t("Bosdi"), width: 200, render: (_: unknown, r: any) => get(r, "first_click_at") ? (
                <div className="text-xs">
                  <Tag color="green">{get(r, "clicks")} {t("marta")}</Tag>
                  <div className="text-gray-500 mt-1">{t("Birinchi")}: {fmt(get(r, "first_click_at"))}</div>
                  {get(r, "clicks") > 1 && <div className="text-gray-500">{t("Oxirgi")}: {fmt(get(r, "last_click_at"))}</div>}
                </div>
              ) : <span className="text-gray-300">—</span> },
              { title: t("Ro'yxat"), width: 150, render: (_: unknown, r: any) => get(r, "user")
                ? <Link to={`/users/view/${get(r, "user.id")}`}><Tag color="purple">{get(r, "user.full_name") || get(r, "user.phone_number")}</Tag></Link>
                : <span className="text-gray-300">—</span> },
              { title: t("Izoh"), dataIndex: "note", render: (v: string, r: any) => (
                <div className="flex items-start gap-2">
                  <span className="text-xs whitespace-pre-wrap max-w-[220px]">{v || ""}</span>
                  {access.isUpdate && <Button size="small" type="text" onClick={() => setNote({ id: r.id, text: v || "" })}>{v ? t("Tahrirlash") : t("Izoh")}</Button>}
                </div>
              ) },
            ]}
          />
          <Pagination meta={meta} rootClassName="!mt-4" align="end" />

          <Modal open={!!note} title={t("Izoh")} onCancel={() => setNote(null)} okText={t("Saqlash")} confirmLoading={isSaving} onOk={saveNote}>
            <Input.TextArea rows={4} value={note?.text} maxLength={2000} onChange={(e) => setNote((s) => (s ? { ...s, text: e.target.value } : s))} placeholder={t("Qo'ng'iroq natijasi, kelishuv...")} />
          </Modal>
        </Panel>
      )}
    </Get>
  );
};

export default B2bLeads;
