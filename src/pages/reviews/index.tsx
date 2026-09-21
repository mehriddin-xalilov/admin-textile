import { Input, Modal, Rate, Segmented, Tag, message } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import qs from "qs";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Pagination, Panel, Table } from "../../components";
import { usePost } from "../../hooks";
import useHooks from "../../hooks/useHooks";
import Get from "../../modules/get";
import useAccess from "../../hooks/useAccess";

const STATUS: Record<string, { color: string; label: string }> = {
  pending: { color: "orange", label: "Kutilmoqda" },
  approved: { color: "green", label: "Tasdiqlangan" },
  rejected: { color: "red", label: "Rad etilgan" },
};

/** Sharhlar moderatsiyasi: tasdiqlash / rad etish / javob yozish. */
const Reviews = () => {
  const { t, query, navigate, queryClient } = useHooks();
  const { mutate, isLoading: isSaving } = usePost();
  const access = useAccess("reviews");
  const [reply, setReply] = React.useState<{ id: number; text: string } | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["reviews"] });
  const save = (id: number, data: Record<string, unknown>) =>
    mutate({ url: `/reviews/${id}`, method: "put", data }, {
      onSuccess: () => { message.success(t("Saqlandi")); refresh(); setReply(null); },
    });
  const remove = (id: number) =>
    Modal.confirm({
      title: t("Sharh o'chirilsinmi?"),
      okType: "danger",
      onOk: () => mutate({ url: `/reviews/${id}`, method: "delete" }, { onSuccess: () => { message.success(t("O'chirildi")); refresh(); } }),
    });

  const status = get(query, "status", "");

  return (
    <Get name="reviews" url="/reviews" params={{ page: get(query, "page", 1), limit: get(query, "limit", 50), filter: { status: status || undefined } }}>
      {({ items, isLoading, meta }) => (
        <Panel title={t("Sharhlar")} meta={meta} hasButton={false}>
          <Segmented
            className="mb-4"
            value={status}
            onChange={(v) => navigate({ search: qs.stringify({ ...query, status: (v as string) || undefined, page: 1 }) })}
            options={[
              { value: "", label: t("Barchasi") },
              { value: "pending", label: t("Kutilmoqda") },
              { value: "approved", label: t("Tasdiqlangan") },
              { value: "rejected", label: t("Rad etilgan") },
            ]}
          />
          <Table
            items={items}
            isLoading={isLoading}
            size="small"
            name="reviews"
            columns={[
              { title: t("ID"), dataIndex: "id", width: 60 },
              { title: t("Baho"), dataIndex: "rating", width: 130, render: (v) => <Rate disabled value={v} style={{ fontSize: 14 }} /> },
              { title: t("Mijoz"), render: (_: unknown, r: any) => <Link to={`/users/view/${get(r, "user.id")}`}>{get(r, "user.full_name")}</Link> },
              { title: t("Mahsulot"), render: (_: unknown, r: any) => get(r, "product.name") },
              { title: t("Izoh"), dataIndex: "comment", render: (v: string, r: any) => (
                <div className="max-w-md">
                  <div className="whitespace-pre-wrap">{v || "—"}</div>
                  {get(r, "reply") && <div className="mt-1 text-xs text-gray-500">↳ {get(r, "reply")}</div>}
                </div>
              ) },
              { title: t("Holati"), dataIndex: "status", width: 130, render: (v: string) => <Tag color={get(STATUS, [v, "color"], "default")}>{t(get(STATUS, [v, "label"], v))}</Tag> },
              { title: t("Sana"), dataIndex: "created_at", width: 140, render: (v: string) => dayjs(v).format("DD.MM.YYYY HH:mm") },
              { title: "", width: 260, render: (_: unknown, r: any) => access.isUpdate && (
                <div className="flex gap-1.5">
                  {get(r, "status") !== "approved" && <Button size="small" type="primary" loading={isSaving} onClick={() => save(r.id, { status: "approved" })}>{t("Tasdiqlash")}</Button>}
                  {get(r, "status") !== "rejected" && <Button size="small" danger loading={isSaving} onClick={() => save(r.id, { status: "rejected" })}>{t("Rad etish")}</Button>}
                  <Button size="small" onClick={() => setReply({ id: r.id, text: get(r, "reply") || "" })}>{t("Javob")}</Button>
                  {access.isDelete && <Button size="small" danger type="text" onClick={() => remove(r.id)}>{t("O'chirish")}</Button>}
                </div>
              ) },
            ]}
          />
          <Pagination meta={meta} rootClassName="!mt-4" align="end" />

          <Modal
            open={!!reply}
            title={t("Sharhga javob")}
            onCancel={() => setReply(null)}
            okText={t("Saqlash")}
            confirmLoading={isSaving}
            onOk={() => reply && save(reply.id, { reply: reply.text })}
          >
            <Input.TextArea
              rows={4}
              value={reply?.text}
              maxLength={1000}
              onChange={(e) => setReply((s) => (s ? { ...s, text: e.target.value } : s))}
              placeholder={t("Mijozga javob")}
            />
          </Modal>
        </Panel>
      )}
    </Get>
  );
};

export default Reviews;
