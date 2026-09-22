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
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <ConfigProvider
      locale={antdLocale}
      prefixCls="textile"
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor,
          fontFamily,
          fontSize,
          borderRadius,
          // Marketplace uslubi: yumshoq chegaralar, keng boshqaruvlar, mayin soyalar
          colorBgLayout: isDark ? undefined : '#F6F7F9',
          colorBorderSecondary: isDark ? undefined : '#E9EBEF',
          controlHeight: 40,
          controlHeightLG: 48,
          controlHeightSM: 32,
          boxShadowTertiary: '0 1px 2px rgba(15, 23, 42, 0.04)',
          colorTextHeading: isDark ? undefined : '#0F172A',
          colorText: isDark ? undefined : '#1E293B',
          colorTextSecondary: isDark ? undefined : '#64748B',
          colorTextPlaceholder: isDark ? undefined : '#94A3B8',
        },
        components: {
          Layout: { headerBg: isDark ? undefined : '#FFFFFF', bodyBg: isDark ? undefined : '#F6F7F9' },
          Card: { borderRadiusLG: 16, paddingLG: 20 },
          Table: {
            headerBg: isDark ? undefined : '#F8FAFC',
            headerColor: isDark ? undefined : '#64748B',
            headerSplitColor: 'transparent',
            borderColor: isDark ? undefined : '#EEF1F5',
            rowHoverBg: isDark ? undefined : '#F8FAFC',
            cellPaddingBlock: 14,
            borderRadiusLG: 16,
          },
          Button: { fontWeight: 600, primaryShadow: 'none', defaultShadow: 'none', dangerShadow: 'none' },
          Input: { paddingBlock: 8 },
          Select: { optionSelectedBg: isDark ? undefined : '#EFF6FF' },
          Modal: { borderRadiusLG: 20, paddingContentHorizontalLG: 24 },
          Drawer: { paddingLG: 24 },
          Tabs: { itemSelectedColor: primaryColor, inkBarColor: primaryColor, horizontalItemPadding: '10px 4px' },
          Tag: { borderRadiusSM: 8, defaultBg: isDark ? undefined : '#F1F5F9' },
          Pagination: { itemActiveBg: primaryColor },
          Segmented: { itemSelectedBg: isDark ? undefined : '#0F172A', itemSelectedColor: '#FFFFFF', trackBg: isDark ? undefined : '#F1F5F9', borderRadius: 10 },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
