import React, { useEffect } from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/uz-latn";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import uzUZ from "antd/es/locale/uz_UZ";
import ruRU from "antd/es/locale/ru_RU";
import enUS from "antd/es/locale/en_US";
import { useStore } from "../../services";

const AntdProvider = ({ children }: { children: React.ReactNode }) => {
  const { language, theme, primaryColor, fontSize, fontFamily, borderRadius } = useStore();

  const getLocale = () => {
    switch (language) {
      case "uz":
        return { antd: uzUZ, dayjs: "uz-latn" };
      case "ru":
        return { antd: ruRU, dayjs: "ru" };
      case "en":
        return { antd: enUS, dayjs: "en" };
      default:
        return { antd: enUS, dayjs: "en" };
    }
  };

  // Update dayjs locale when language changes
  useEffect(() => {
    const { dayjs: dayjsLocale } = getLocale();
    dayjs.locale(dayjsLocale);
  }, [language]);

  // Apply global theme settings to document
  useEffect(() => {
    // Handle dark mode class
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    // Handle font and css variables globally
    document.documentElement.style.setProperty("--font-family", fontFamily);
    // document.documentElement.style.fontSize = `${fontSize}px`; // Tailwind uses rem, better to just let AntD handle font sizes or apply to body
  }, [theme, fontFamily, fontSize, primaryColor]);

  const { antd: antdLocale } = getLocale();

  return (
    <ConfigProvider
      locale={antdLocale}
      prefixCls="textile"
      theme={{
        algorithm:
          theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? antTheme.darkAlgorithm
            : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor,
          fontFamily: fontFamily,
          fontSize: fontSize,
          borderRadius: borderRadius,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
