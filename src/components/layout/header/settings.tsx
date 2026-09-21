import React from "react";
import { Drawer, Radio, Typography, Slider, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useStore, utils } from "../../../services/index.ts";
import { PaletteRoundIcon, PaletteIcon, TextIcon, TextSquareIcon, GalleryIcon, MoonIcon, SunIcon, MonitorSmartphoneIcon, GlobalIcon, ScaleIcon } from "../../../assets/icon/components/solar-bold-duotone-icons/index.tsx";
import config from "../../../../config.ts";

// 10 custom darker modern linear gradients
export const gradients = [
  "linear-gradient(135deg, #1f2233 0%, #151515 100%)",
  "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)",
  "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
  "linear-gradient(135deg, #3f2b96 0%, #6884d6 100%)",
  "linear-gradient(135deg, #111827 0%, #000000 100%)",
  "linear-gradient(to right, #434343 0%, #000000 100%)",
  "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
  "linear-gradient(to right, #141e30, #243b55)",
  "linear-gradient(135deg, #232526 0%, #414345 100%)",
  "linear-gradient(135deg, #000000 0%, #434343 100%)",
];

// pre-defined body colors split by theme
export const lightBodyColors = ["#F4F7FE", "#ffffff", "#f8fafc", "#f3f4f6", "#e5e7eb"];
export const darkBodyColors = ["#000000", "#121212", "#18181b", "#1f2937", "#0f172a"];

export const primaryColorsList = utils.colorPalette.slice(0, 10);

export const SettingsDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const {
    theme,
    setTheme,
    sidebarImage,
    setSidebarImage,
    sidebarGradient,
    setSidebarGradient,
    fontSize,
    setFontSize,
    primaryColor,
    setPrimaryColor,
    fontFamily,
    setFontFamily,
    borderRadius,
    setBorderRadius,
    language,
    setLanguage,
    bodyBg,
    setBodyBg,
    resetSettings,
  } = useStore((state) => state);

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const activeBodyColors = isDark ? darkBodyColors : lightBodyColors;

  const images = [1, 2, 3]; // From public/images/background/image-X.jpg

  const isCustomBg = sidebarImage !== 'none' || sidebarGradient !== 'none';

  return (
    <Drawer
      title={<span className={isCustomBg ? 'text-white' : ''}>{t("Sozlamalar")}</span>}
      placement="right"
      onClose={onClose}
      open={open} rootClassName="[&_.textile-drawer-content-wrapper]:!overflow-hidden [&_.textile-drawer-content-wrapper]:!m-1 [&_.textile-drawer-content-wrapper]:!rounded-xl"
      width={360}
      className={`!bg-white dark:!bg-[#151515] ${isCustomBg ? 'text-white' : 'dark:text-gray-200'}`}

    >
      <div className="flex flex-col gap-6">

        {/* Language (Mobile Only) */}
        <div className="block sm:hidden">
          <Typography.Title level={5} className="!mb-3 !text-[15px] dark:!text-gray-200 flex items-center gap-2">
            <GlobalIcon className="!text-blue-500" width={20} height={20} />
            {t("Til")}
          </Typography.Title>
          <Radio.Group
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex "
            buttonStyle="solid"
          >
            {config.API_LANGUAGES.map(lang => (
              <Radio.Button key={lang.code} value={lang.code} className="flex-1 text-center items-center mx-auto !px-1 ">
                <div className="flex items-center justify-center gap-1.5 my-auto h-full px-3">
                  <img src={lang.icon} alt={lang.code} className="w-4 h-4 rounded-full" />
                  <span className="text-xs">{lang.name}</span>
                </div>
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        {/* Theme */}
        <div>
          <Typography.Title level={5} className="!mb-3 !text-[15px] dark:!text-gray-200 flex items-center gap-2">
            <PaletteRoundIcon className="!text-blue-500" width={20} height={20} />
            {t("Mavzu")}
          </Typography.Title>
          <Radio.Group
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="flex w-full"
            buttonStyle="solid"
          >
            <Radio.Button value="light" className="flex-1 text-center !px-3">
              <div className="flex items-center justify-center gap-1">
                <SunIcon width={16} height={16} className="!text-yellow-500" /> {t("Yorug'")}
              </div>
            </Radio.Button>
            <Radio.Button value="dark" className="flex-1 text-center !px-3">
              <div className="flex items-center justify-center gap-1">
                <MoonIcon width={16} height={16} className="!text-blue-500" /> {t("Qorong'u")}
              </div>
            </Radio.Button>
            <Radio.Button value="system" className="flex-1 text-center !px-3">
              <div className="flex items-center justify-center gap-1">
                <MonitorSmartphoneIcon width={16} height={16} className={theme === "system" ? "!text-white" : ""} /> {t("Tizim")}
              </div>
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* Primary Color */}
        <div>
          <Typography.Title level={5} className="!mb-3 !text-[15px] dark:!text-gray-200 flex items-center gap-2">
            <PaletteIcon className="!text-blue-500" width={20} height={20} />
            {t("Asosiy rang")}
          </Typography.Title>
          <div className="flex flex-col gap-3">

            <div className="flex gap-2 flex-wrap">
              {primaryColorsList.map(c => (
                <div
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  className={`w-6 h-6 rounded-full cursor-pointer shadow-sm border-2 transition-transform hover:scale-110 ${primaryColor === c ? 'border-gray-500 scale-110 ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-[#151515]' : 'border-transparent'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Font Family */}
        <div>
          <Typography.Title level={5} className="!mb-3 !text-[15px] dark:!text-gray-200 flex items-center gap-2">
            <TextIcon className="!text-blue-500" width={20} height={20} />
            {t("Shrift")}
          </Typography.Title>
          <div className="grid grid-cols-2 gap-2">
            {["GT Walsheim Pro", "Montserrat", "Poppins", "Roboto"].map((font) => (
              <div
                key={font}
                onClick={() => setFontFamily(font)}
                style={{ fontFamily: font }}
                className={`py-2 px-3 rounded-lg border-2 cursor-pointer line-clamp-1 text-center text-[15px] transition-all ${fontFamily === font ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium shadow-sm shadow-blue-500/20" : "border-gray-200/60 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-500/50 text-gray-700 dark:text-gray-300"}`}
              >
                {font}
              </div>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <Typography.Title level={5} className="!mb-2 !text-[15px] dark:!text-gray-200 flex items-center gap-2">
            <TextSquareIcon className="!text-blue-500" width={20} height={20} />
            {t("Shrift o'lchami")}: {fontSize}px
          </Typography.Title>
          <Slider
            min={12}
            max={20}
            value={fontSize}
            onChange={(val) => setFontSize(val)}
          />
        </div>

        {/* Border Radius */}
        <div>
          <Typography.Title level={5} className="!mb-2 !text-[15px] dark:!text-gray-200 flex items-center gap-2">
            <ScaleIcon className="!text-blue-500" width={20} height={20} />
            {t("Burchak radiusi")}: {borderRadius}px
          </Typography.Title>
          <Slider
            min={0}
            max={24}
            value={borderRadius}
            onChange={(val) => setBorderRadius(val)}
          />
        </div>

        {/* Body Background */}
        <div>
          <Typography.Title level={5} className="!mb-3 !text-[15px] dark:!text-gray-200 flex items-center gap-2">
            <GalleryIcon className="!text-blue-500" width={20} height={20} />
            {t("Asosiy fon")}
          </Typography.Title>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            <div
              onClick={() => setBodyBg("none")}
              className={`w-12 h-10 shrink-0 rounded-lg cursor-pointer border-2 shadow-sm flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${bodyBg === "none" ? "border-blue-500" : "border-transparent"}`}
            >
              <span className="text-xs">Off</span>
            </div>
            {activeBodyColors.map(c => (
              <div
                key={c}
                onClick={() => setBodyBg(c)}
                className={`w-12 h-10 rounded-lg shrink-0 cursor-pointer shadow-sm border-2 ${bodyBg === c ? 'border-blue-500 scale-105' : 'border-gray-200 dark:border-gray-700'}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* Sidebar Background */}
        <div>
          <Typography.Title level={5} className="!mb-3 !text-[15px] dark:!text-gray-200 flex items-center gap-2">
            <GalleryIcon className="!text-blue-500" width={20} height={20} />
            {t("Yon va yuqori panel foni")}
          </Typography.Title>

          <div className="mb-2 italic text-sm text-gray-500">{t("Rasmlar")}</div>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {/* option for default/none */}
            <div
              onClick={() => { setSidebarImage("none"); setSidebarGradient("none"); }}
              className={`w-16 h-12 shrink-0 rounded-lg cursor-pointer border-2 shadow-sm flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${sidebarImage === "none" && sidebarGradient === "none" ? "border-blue-500" : "border-transparent"}`}
            >
              <span className="text-xs">Off</span>
            </div>
            {images.map((img) => (
              <img
                key={`img-${img}`}
                src={`/images/background/image-${img}.jpg`}
                alt={`bg-${img}`}
                onClick={() => { setSidebarImage(img); setSidebarGradient('none'); }}
                className={`w-16 h-12 shrink-0 rounded-lg cursor-pointer object-cover shadow-sm border-2 ${sidebarImage === img ? "border-blue-500" : "border-transparent"}`}
              />
            ))}
          </div>

          {/* <div className="mb-2 italic text-sm text-gray-500">{t("Gradientlar")}</div>
          <div className="grid grid-cols-5 gap-2">
            {gradients.map((grad, i) => (
              <div
                key={`grad-${i}`}
                onClick={() => { setSidebarGradient(grad); setSidebarImage('none'); }}
                style={{
                  borderColor: grad
                }}
                className={`w-full aspect-square rounded-lg cursor-pointer shadow-sm border-2 ${sidebarGradient === grad ? "border-blue-500" : "border-transparent"}`}
              >
                <div className="w-full h-full rounded-lg" style={{ background: grad }}></div>

              </div>
            ))}
          </div> */}
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          <Button danger type="link" variant="link" className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl" onClick={resetSettings}>
            {t("Tozalash")}
          </Button>
          <Button type="primary" className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl" onClick={onClose}>
            {t("Yopish")}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
