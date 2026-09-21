import React from "react";
import { Image, message } from "antd";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { CameraIcon } from "../../../assets/icon/components/solar-line-duotone-icons";
import { api } from "../../../services";
import Spin from "../../spin";

type Img = { id: number; src: string };

/** Bir nechta rasm yuklash: qiymat — [{id, src}] massivi (tartib = ko'rsatilish tartibi). */
function Index(props: any) {
  const { t } = useTranslation();
  const {
    form: { setFieldValue },
    field: { name, value }
  } = props;
  const [isLoading, setLoading] = React.useState(false);
  const items: Img[] = Array.isArray(value) ? value : [];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach((file, i) => formData.append(`files[${i}]`, file));

    api({ method: "post", url: "/files", data: formData, headers: { "Content-Type": "multipart/form-data" } })
      .then((response) => {
        const uploaded: Img[] = get(response, "data.data", []).map((f: any) => ({ id: f.id, src: f.src || f.url }));
        setFieldValue(name, [...items, ...uploaded]);
        message.success(t("Fayllar muvaffaqiyatli yuklandi"));
      })
      .catch(() => message.error(t("Fayllarni yuklashda xatolik yuz berdi")))
      .finally(() => { setLoading(false); e.target.value = ""; });
  };

  const remove = (id: number) => setFieldValue(name, items.filter((i) => i.id !== id));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setFieldValue(name, next);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="flex flex-wrap gap-3">
        {items.map((img, i) => (
          <div key={img.id} className="w-28 h-28 rounded-lg overflow-hidden relative bg-[#f4f7fb] dark:bg-gray-900 shadow group">
            <Image src={img.src} className="!w-full !h-full !object-contain" />
            <div className="absolute inset-x-0 bottom-0 hidden group-hover:flex justify-between bg-black/60 text-white text-xs">
              <button type="button" className="px-2 py-1" onClick={() => move(i, i - 1)}>←</button>
              <button type="button" className="px-2 py-1" onClick={() => remove(img.id)}>✕</button>
              <button type="button" className="px-2 py-1" onClick={() => move(i, i + 1)}>→</button>
            </div>
          </div>
        ))}
        <label className="w-28 h-28 rounded-lg flex flex-col items-center justify-center gap-1 bg-[#f4f7fb] dark:bg-gray-900 shadow cursor-pointer text-gray-400 hover:text-primary">
          <CameraIcon className="w-7 h-7" />
          <span className="text-xs">{t("Rasm qo'shish")}</span>
          <input type="file" accept="image/*" multiple hidden onChange={onChange} />
        </label>
      </div>
    </Spin>
  );
}

export default Index;
