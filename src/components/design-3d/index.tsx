import React, { useEffect, useRef } from "react";
import { get } from "lodash";

/**
 * 3D konstruktorni (web-3d) ko'rish rejimida iframe qilib, dizaynni postMessage bilan uzatadi.
 * URL: VITE_DESIGNER_URL (default http://localhost:5174). Aylantirish/zoom iframe ichida ishlaydi.
 */
const DESIGNER_URL = (import.meta.env.VITE_DESIGNER_URL as string) || "http://localhost:5174";

const Design3D: React.FC<{ design: any; height?: number }> = ({ design, height = 520 }) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const slug = get(design, "product.slug");

  useEffect(() => {
    const send = () => ref.current?.contentWindow?.postMessage({ type: "tx:load", product: slug, canvas: get(design, "canvas") }, "*");
    const onMessage = (e: MessageEvent) => { if (e.data?.type === "tx:ready") send(); };
    window.addEventListener("message", onMessage);
    send();
    return () => window.removeEventListener("message", onMessage);
  }, [design, slug]);

  if (!get(design, "canvas")) return null;

  return (
    <iframe
      ref={ref}
      title="3D"
      src={`${DESIGNER_URL}/studio?embed=view&product=${slug || ""}`}
      className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-black"
      style={{ height }}
      allow="fullscreen"
    />
  );
};

export default Design3D;
