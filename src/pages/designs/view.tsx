import { Descriptions, Table as AntTable, Tag } from "antd";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Button, Panel, Spin, Tabs, ViewLayout } from "../../components";
import DesignPreview, { canvasLayers, canvasSides } from "../../components/design-preview";
import { useGet, usePost } from "../../hooks";
import useHooks from "../../hooks/useHooks";
import { DESIGN_STATUSES, PRODUCT_SIDES, statusColor, statusLabel } from "../../services/constants";
import config from "../../../config";
import { api, storage } from "../../services";
import React from "react";
import Design3D from "../../components/design-3d";

const apiV1Root = config.API_V1_ROOT;

/** Dizayn: mockup ustida qatlamlar + ishlab chiqarish uchun jadval (tomon, joy, matn/shrift yoki logo, sm). */
const DesignView = () => {
  const { t, params, query } = useHooks();
  const id = get(params, "id");
  const { data, isLoading } = useGet({ url: `/designs/${id}`, name: "designs", queryOptions: { enabled: !!id } });
  const d = get(data, "data", {});
  const { mutate, isLoading: isSaving } = usePost();
  const { queryClient } = useHooks();
  const [isUploading, setUploading] = React.useState(false);
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const uploaded = await api.post("/files", form).then((r) => get(r, "data.data[0]"));
      await api.put(`/designs/${id}`, { canvas: get(d, "canvas"), photo_file_id: get(uploaded, "id") });
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const toggleTemplate = () => mutate({ url: `/designs/${id}/template`, method: "post", data: { is_template: !get(d, "is_template"), template_title: get(d, "template_title") || get(d, "name") } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["designs"] }) });
  const sides = canvasSides(get(d, "canvas"));
  const side = get(query, "side", sides[0] || "front");
  const IMG: Record<string, string> = { front: "front_image", back: "back_image", left_sleeve: "left_image", right_sleeve: "right_image" };
  const mockup = get(d, `product_color.${IMG[side] || "front_image"}.src`);
  const { data: clipData } = useGet({ url: "/cliparts", name: "cliparts", params: { limit: 500 } });
  const cliparts = Object.fromEntries((get(clipData, "data", []) as any[]).map((c) => [c.id, get(c, "file.src")]));

  return (
    <Spin spinning={isLoading}>
      <ViewLayout
        header={{
          title: get(d, "name") || `${t("Dizayn")} #${id}`,
          subtitle: `${get(d, "product.name", "")} · ${get(d, "product_color.color.name", "")}`,
          extra: (
            <div className="flex gap-2">
              <a href={`${(import.meta.env.VITE_DESIGNER_URL as string) || "http://localhost:5174"}/studio?design=${id}#token=${storage.get("token")}`} target="_blank" rel="noreferrer">
                <Button type="primary">{t("Konstruktorda tahrirlash")}</Button>
              </a>
              <Button loading={isSaving} type={get(d, "is_template") ? "default" : "primary"} onClick={toggleTemplate}>
                {get(d, "is_template") ? t("Tayyor dizaynlardan olib tashlash") : t("Tayyor dizayn sifatida saytga chiqarish")}
              </Button>
              {get(d, "print_file.src") && <a href={get(d, "print_file.src")} target="_blank" rel="noreferrer"><Button>{t("Bosma fayl")}</Button></a>}
            </div>
          ),
        }}
        left={
          <Panel header={false}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t("Mijoz")}><Link to={`/users/view/${get(d, "user.id")}`}>{get(d, "user.full_name")}</Link></Descriptions.Item>
              <Descriptions.Item label={t("Holati")}><Tag color={statusColor(DESIGN_STATUSES, get(d, "status"))}>{t(statusLabel(DESIGN_STATUSES, get(d, "status")))}</Tag></Descriptions.Item>
              <Descriptions.Item label={t("Tomonlar")}>{sides.map((s) => PRODUCT_SIDES.find((p) => p.value === s)?.label || s).join(", ") || "—"}</Descriptions.Item>
              <Descriptions.Item label={t("Qatlamlar")}>{get(d, "summary", []).length}</Descriptions.Item>
              <Descriptions.Item label={t("Saytda")}><Tag color={get(d, "is_template") ? "green" : "default"}>{get(d, "is_template") ? t("Tayyor dizayn") : t("Yo'q")}</Tag></Descriptions.Item>
            </Descriptions>
            {get(d, "preview.src") && <img src={get(d, "preview.src")} alt="" className="mt-4 rounded-xl w-full" />}
          </Panel>
        }
        right={
          <div className="flex flex-col gap-4">
            <Panel title={t("Do'kon fotosi (tayyor mahsulot uchun)")} hasButton={false}>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                  {get(d, "photo.src") ? <img src={get(d, "photo.src")} alt="" className="w-full h-full object-contain" /> : <span className="text-xs text-gray-500">{t("Yo'q")}</span>}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 max-w-md">{t("Saytda tayyor mahsulot kartochkasida shu rasm ko'rsatiladi. Yuklanmasa 3D ko'rinish ishlatiladi.")}</p>
                  <input type="file" accept="image/*" disabled={isUploading} onChange={uploadPhoto} className="text-xs" />
                </div>
              </div>
            </Panel>
            {get(d, "engine") === "shirt-designer-3d" && (
              <Panel title={t("3D ko'rinish")} hasButton={false}>
                <Design3D design={d} />
              </Panel>
            )}
            {get(d, "engine") === "shirt-designer-3d" ? (
              <Panel title={t("Bosma fayllar (300 DPI)")} hasButton={false}>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(get(d, "print_files", {}) as Record<string, number>).map(([zone, fileId]) => (
                    <a key={zone} href={`${apiV1Root}/files/${fileId}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-semibold">{{ front: t("Old"), back: t("Orqa"), sleeve_left: t("Chap yeng"), sleeve_right: t("O'ng yeng") }[zone] || zone}</span>
                      <span className="text-xs text-gray-500">{t("Fayl")} #{fileId}</span>
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">{t("3D konstruktorda yaratilgan. Preview chapda, har tomon uchun bosma PNG shu yerda.")}</p>
              </Panel>
            ) : (
              <Panel title={t("Kiyim ustida ko'rinishi")} hasButton={false}>
                {sides.length > 1 && <Tabs name="side" options={sides.map((s) => ({ value: s, label: PRODUCT_SIDES.find((p) => p.value === s)?.label || s }))} defaultValue={sides[0]} />}
                <div className="mt-3">
                  <DesignPreview side={side} mockupSrc={mockup} areas={get(d, "product.print_areas", [])} layers={canvasLayers(get(d, "canvas"), side)} cliparts={cliparts} width={420} />
                </div>
              </Panel>
            )}
            <Panel title={t("Ishlab chiqarish uchun")} hasButton={false}>
              <AntTable
                size="small" pagination={false} rowKey={(_, i) => String(i)}
                dataSource={get(d, "summary", []) as any[]}
                columns={[
                  { title: t("Tomon"), dataIndex: "side", render: (v) => PRODUCT_SIDES.find((p) => p.value === v)?.label || v },
                  { title: t("Joy"), dataIndex: "area" },
                  { title: t("Tur"), dataIndex: "type", render: (v) => <Tag color={v === "text" ? "blue" : "purple"}>{v === "text" ? t("Yozuv") : t("Logo")}</Tag> },
                  { title: t("Nima"), dataIndex: "label" },
                  { title: t("O'lcham"), dataIndex: "size_cm", render: (v) => v || "—" },
                ]}
              />
            </Panel>
          </div>
        }
      />
    </Spin>
  );
};

export default DesignView;
