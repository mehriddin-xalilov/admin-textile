import { get } from "lodash";
import React from "react";

/**
 * Dizaynni mockup ustida chizadi (SVG overlay, 2D).
 * Qatlam koordinatalari PrintArea ichida foizda — shuning uchun rasm o'lchamidan mustaqil.
 * Admin, sayt va bosma fayl generatori bir xil formuladan foydalanadi:
 *   absX = area.x + layer.x * area.width / 100   (mockup foizida)
 */
type Layer = {
  id: string; type: "text" | "image" | "clipart"; print_area_id: number;
  x: number; y: number; width: number; height: number; rotation?: number;
  text?: string; font_family?: string; font_weight?: string; font_style?: string; fill?: string; align?: string; letter_spacing?: number;
  file_id?: number; src?: string; clipart_id?: number;
};
type Area = { id: number; side: string; name: string; x: number; y: number; width: number; height: number };

type Props = {
  side: string;
  mockupSrc?: string;
  areas: Area[];
  layers: Layer[];
  files?: Record<number, string>;   // file_id → src (logolar)
  cliparts?: Record<number, string>; // clipart_id → svg src
  showAreas?: boolean;
  width?: number;
};

const DesignPreview: React.FC<Props> = ({ side, mockupSrc, areas, layers, files = {}, cliparts = {}, showAreas = true, width = 360 }) => {
  const sideAreas = areas.filter((a) => a.side === side);
  const byId = Object.fromEntries(sideAreas.map((a) => [a.id, a]));
  const fonts = Array.from(new Set(layers.filter((l) => l.type === "text" && l.font_family).map((l) => l.font_family as string)));

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-[#111]" style={{ width, aspectRatio: "1 / 1" }}>
      {fonts.length > 0 && (
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fonts.map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,400;0,700;1,400;1,700`).join("&")}&display=swap`} />
      )}
      {mockupSrc ? <img src={mockupSrc} className="absolute inset-0 w-full h-full object-contain" alt="" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Mockup yo'q</div>}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {showAreas && sideAreas.map((a) => (
          <rect key={a.id} x={a.x} y={a.y} width={a.width} height={a.height} fill="none" stroke="#0f766e" strokeWidth={0.4} strokeDasharray="1.5 1" />
        ))}
        {layers.map((l) => {
          const a = byId[l.print_area_id];
          if (!a) return null;
          const x = a.x + (l.x * a.width) / 100, y = a.y + (l.y * a.height) / 100;
          const w = (l.width * a.width) / 100, h = (l.height * a.height) / 100;
          const cx = x + w / 2, cy = y + h / 2;
          const transform = `rotate(${l.rotation || 0} ${cx} ${cy})`;
          if (l.type === "clipart") {
            const src = cliparts[l.clipart_id as number];
            if (!src) return <rect key={l.id} x={x} y={y} width={w} height={h} fill={l.fill || "#94a3b8"} opacity={0.5} transform={transform} />;
            // Bir rangli SVG: alpha-mask orqali fill rangi bilan bo'yaladi (konstruktordagi kabi)
            return (
              <g key={l.id} transform={transform}>
                <mask id={`m-${l.id}`} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h} style={{ maskType: "alpha" }}>
                  <image href={src} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet" />
                </mask>
                <rect x={x} y={y} width={w} height={h} fill={l.fill || "#111"} mask={`url(#m-${l.id})`} />
              </g>
            );
          }
          if (l.type === "image") {
            const src = l.src || files[l.file_id as number];
            return src
              ? <image key={l.id} href={src} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet" transform={transform} />
              : <rect key={l.id} x={x} y={y} width={w} height={h} fill="#94a3b8" opacity={0.5} transform={transform} />;
          }
          const anchor = l.align === "left" ? "start" : l.align === "right" ? "end" : "middle";
          const tx = anchor === "start" ? x : anchor === "end" ? x + w : cx;
          return (
            <text key={l.id} x={tx} y={cy} textAnchor={anchor} dominantBaseline="middle" transform={transform}
              fontFamily={l.font_family} fontWeight={l.font_weight || "400"} fontStyle={l.font_style || "normal"}
              fill={l.fill || "#000"} fontSize={h * 0.8} textLength={w} lengthAdjust="spacingAndGlyphs" letterSpacing={l.letter_spacing || 0}>
              {l.text}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default DesignPreview;

/** Canvas JSON → tomonlar ro'yxati (qatlamlari bor tomonlar). */
export const canvasSides = (canvas: any): string[] => Object.keys(get(canvas, "sides", {}));
export const canvasLayers = (canvas: any, side: string): Layer[] => get(canvas, `sides.${side}.layers`, []);
