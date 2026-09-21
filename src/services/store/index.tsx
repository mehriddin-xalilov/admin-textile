import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import storage from "../storage/index.ts";
import config from "../../../config.ts";
import i18n from "i18next";
import { get } from "lodash";

interface AppState {
  sidebar: boolean;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  sidebarImage: string | number;
  setSidebarImage: (sidebarImage: string | number) => void;
  sidebarGradient: string;
  setSidebarGradient: (sidebarGradient: string) => void;
  bodyBg: string;
  setBodyBg: (bodyBg: string) => void;
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  primaryColor: string;
  setPrimaryColor: (primaryColor: string) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  borderRadius: number;
  setBorderRadius: (borderRadius: number) => void;
  language: "uz" | "oz" | "ru" | "en";
  setLanguage: (language: "uz" | "oz" | "ru" | "en") => void;
  user: {
    isAuth: boolean;
    data: any;
    token: string;
    refreshToken: string;
  } | null;
  pfxLists: any;
  setLogout: () => void;
  getMeLoading: boolean;
  setGetMeLoading: (getMeLoading: boolean) => void;
  setPfxLists: (pfxLists: any) => void;
  application: any;
  setApplication: (application: any) => void;
  setSidebar: (sidebar: boolean) => void;
  setUser: (
    user: {
      isAuth: boolean;
      data: any;
      token: string;
      refreshToken: string;
    } | null
  ) => void;
  resetSettings: () => void;
  openChatDrawer: boolean;
  setOpenChatDrawer: (openChatDrawer: boolean) => void;
  activeChatId: number | null;
  setActiveChatId: (activeChatId: number | null) => void;
  activeChatData: any | null;
  setActiveChatData: (activeChatData: any | null) => void;
}

export const useStore = create(
  persist<AppState>(
    set => ({
      sidebar: storage.get("sidebar") || true,
      theme: storage.get('theme') || config.THEME || 'system',
      setTheme: theme => {
        set({ theme });
        storage.set("theme", theme);
      },
      sidebarImage: storage.get('sidebarImage') || config.SIDEBAR_IMAGE || '1',
      setSidebarImage: sidebarImage => {
        set({ sidebarImage });
        storage.set("sidebarImage", String(sidebarImage));
      },
      sidebarGradient: storage.get('sidebarGradient') || config.SIDEBAR_GRADIENT || 'none',
      setSidebarGradient: sidebarGradient => {
        set({ sidebarGradient });
        storage.set("sidebarGradient", sidebarGradient);
      },
      bodyBg: storage.get('bodyBg') || config.BODY_BG || 'none',
      setBodyBg: bodyBg => {
        set({ bodyBg });
        storage.set("bodyBg", bodyBg);
      },
      fontSize: Number(storage.get('fontSize')) || config.FONT_SIZE || 14,
      setFontSize: fontSize => {
        set({ fontSize });
        storage.set("fontSize", String(fontSize));
      },
      primaryColor: storage.get('primaryColor') || config.COLOR || '#1e50e7',
      setPrimaryColor: primaryColor => {
        set({ primaryColor });
        storage.set("primaryColor", primaryColor);
      },
      fontFamily: storage.get('fontFamily') || config.FONT_FAMILY || 'GT Walsheim Pro',
      setFontFamily: fontFamily => {
        set({ fontFamily });
        storage.set("fontFamily", fontFamily);
      },
      borderRadius: Number(storage.get('borderRadius')) || config.BORDER_RADIUS || 12,
      setBorderRadius: borderRadius => {
        set({ borderRadius });
        storage.set("borderRadius", String(borderRadius));
      },
      resetSettings: () => {
        const defaults = {
          theme: (config.THEME || 'system') as "light" | "dark" | "system",
          sidebarImage: config.SIDEBAR_IMAGE || 'none',
          sidebarGradient: config.SIDEBAR_GRADIENT || 'none',
          bodyBg: config.BODY_BG || 'none',
          fontSize: config.FONT_SIZE || 14,
          primaryColor: config.COLOR || '#1e50e7',
          fontFamily: config.FONT_FAMILY || 'GT Walsheim Pro',
          borderRadius: config.BORDER_RADIUS || 12,
        };
        set(defaults);
        storage.set("theme", defaults.theme);
        storage.set("sidebarImage", String(defaults.sidebarImage));
        storage.set("sidebarGradient", defaults.sidebarGradient);
        storage.set("bodyBg", defaults.bodyBg);
        storage.set("fontSize", String(defaults.fontSize));
        storage.set("primaryColor", defaults.primaryColor);
        storage.set("fontFamily", defaults.fontFamily);
      },
      language: storage.get("language") || config.DEFAULT_LANGUAGE,
      setLogout: () => {
        set({ user: { isAuth: false, data: null, token: "", refreshToken: "" } });
        storage.clear();
      },
      application: null,
      setApplication: application => {
        set({ application });
      },
      getMeLoading: true,
      setGetMeLoading: getMeLoading => {
        set({ getMeLoading });
      },
      user: {
        isAuth: false,
        data: null,
        token: "",
        refreshToken: ""
      },
      pfxLists: [],
      setPfxLists: pfxLists => {
        set({ pfxLists });
      },
      setSidebar: sidebar => {
        set({ sidebar });
        storage.set("sidebar", String(sidebar));
      },

      setLanguage: language => {
        set({ language });
        i18n.changeLanguage(language);
        storage.set("language", language);
      },
      setUser: user => {
        set({ user });
        storage.set("token", get(user, "token", ""));
        storage.set("refreshToken", get(user, "refreshToken", ""));
      },
      openChatDrawer: false,
      setOpenChatDrawer: openChatDrawer => set({ openChatDrawer }),
      activeChatId: null,
      setActiveChatId: activeChatId => set({ activeChatId }),
      activeChatData: null,
      setActiveChatData: activeChatData => set({ activeChatData })
    }),
    {
      name: "textile", // LocalStorage key nomi
      storage: createJSONStorage(() => localStorage)
    }
  )
);
