import React from "react";
import { Button, Input } from "antd";
import { useTranslation } from "react-i18next";

type Row = { name: string; value: string };

/** Xususiyatlar jadvali: [{name, value}] — qator qo'shish/o'chirish. */
function Index(props: any) {
  const { t } = useTranslation();
  const {
    form: { setFieldValue },
    field: { name, value }
  } = props;
  const rows: Row[] = Array.isArray(value) ? value : [];

  const set = (i: number, key: keyof Row, v: string) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [key]: v } : r));
    setFieldValue(name, next);
  };

  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            size="large"
            placeholder={t("Nomi (Mato)")}
            value={r.name}
            onChange={(e) => set(i, "name", e.target.value)}
            className="!w-2/5"
          />
          <Input
            size="large"
            placeholder={t("Qiymati (100% paxta)")}
            value={r.value}
            onChange={(e) => set(i, "value", e.target.value)}
          />
          <Button danger type="text" onClick={() => setFieldValue(name, rows.filter((_, idx) => idx !== i))}>✕</Button>
        </div>
      ))}
      <Button onClick={() => setFieldValue(name, [...rows, { name: "", value: "" }])}>
        + {t("Xususiyat qo'shish")}
      </Button>
    </div>
  );
}

export default Index;
