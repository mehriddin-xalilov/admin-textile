import { Badge, Button, Dropdown, Popover, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/uz";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  BagIcon,
  BellIcon,
  BoxIcon,
  BoxMinimalisticIcon,
  HangerIcon,
  PaletteIcon,
  Buildings2Icon,
  Chart2Icon,
  InfoCircleIcon,
  MonitorSmartphoneIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserCircleIcon,
  WalletMoneyIcon,
  Widget2Icon
} from "../../../assets/icon/components/solar-bold-duotone-icons/index.tsx";
import { HamburgerMenuIcon } from "../../../assets/icon/components/solar-line-duotone-icons";
import {
  CheckReadIcon,
  MaximizeSquareMinimalisticIcon,
  MinimizeSquareMinimalisticIcon,
} from "../../../assets/icon/components/solar-line-duotone-icons/index.tsx";
import LogoDark from "../../../assets/images/logo-dark.svg";
import LogoLight from "../../../assets/images/logo-light.svg";
import { useResolvedTheme } from "../../../hooks";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { useStore } from "../../../services/index.ts";
import Language from "../language/index.tsx";
import { SettingsDrawer } from "./settings.tsx";

dayjs.extend(relativeTime);

const quickLinks = [
  { path: '/', label: 'Statistika', color: 'blue', icon: <Chart2Icon className="!text-white" /> },
  { path: '/orders', label: 'Buyurtmalar', color: 'emerald', icon: <BagIcon className="!text-white" /> },
  { path: '/products', label: 'Mahsulotlar', color: 'violet', icon: <HangerIcon className="!text-white" /> },
  { path: '/inventory/stock', label: 'Qoldiqlar', color: 'amber', icon: <BoxIcon className="!text-white" /> },
  { path: '/inventory/batches', label: 'Partiyalar', color: 'orange', icon: <BoxMinimalisticIcon className="!text-white" /> },
  { path: '/designs', label: 'Dizaynlar', color: 'indigo', icon: <PaletteIcon className="!text-white" /> },
  { path: '/users', label: 'Foydalanuvchilar', color: 'cyan', icon: <UserCircleIcon className="!text-white" /> },
  { path: '/settings', label: 'Sozlamalar', color: 'gray', icon: <SettingsIcon className="!text-white" /> },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500 bg-opacity-15 dark:bg-blue-500 dark:bg-opacity-25 text-blue-500',
  violet: 'bg-violet-500 bg-opacity-15 dark:bg-violet-500 dark:bg-opacity-25 text-violet-500',
  emerald: 'bg-emerald-500 bg-opacity-15 dark:bg-emerald-500 dark:bg-opacity-25 text-emerald-500',
  amber: 'bg-amber-500 bg-opacity-15 dark:bg-amber-500 dark:bg-opacity-25 text-amber-500',
  rose: 'bg-rose-500 bg-opacity-15 dark:bg-rose-500 dark:bg-opacity-25 text-rose-500',
  indigo: 'bg-indigo-500 bg-opacity-15 dark:bg-indigo-500 dark:bg-opacity-25 text-indigo-500',
  cyan: 'bg-cyan-500 bg-opacity-15 dark:bg-cyan-500 dark:bg-opacity-25 text-cyan-500',
  orange: 'bg-orange-500 bg-opacity-15 dark:bg-orange-500 dark:bg-opacity-25 text-orange-500',
  gray: 'bg-gray-500 bg-opacity-15 dark:bg-gray-500 dark:bg-opacity-25 text-gray-500',
}

const Header = () => {
  const { theme, setTheme, openChatDrawer, setOpenChatDrawer, sidebarImage, sidebarGradient, sidebar, setSidebar } = useStore(
    state => state
  );
  const { isMobile, isTablet } = useWindowSize();
  const isSmallScreen = isMobile || isTablet;
  const isCustomBg = sidebarImage !== 'none' || sidebarGradient !== 'none';
  const resolvedTheme = useResolvedTheme();

  const [openLanguage, setOpenLanguage] = React.useState(false);
  const [openApps, setOpenApps] = React.useState(false);
  const [openNotifications, setOpenNotifications] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      type: 'payment',
      title: "Yangi to'lov",
      description: "Aliyev Ali 500,000 UZS to'ladi",
      time: dayjs().subtract(5, 'minute').toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'student',
      title: "Yangi ro'yxatdan o'tish",
      description: "Sobirov Vali yangi o'quvchi sifatida qo'shildi",
      time: dayjs().subtract(1, 'hour').toISOString(),
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: "Tizim yangilanishi",
      description: "CRM tizimi v1.2.0 versiyasiga yangilandi",
      time: dayjs().subtract(5, 'hour').toISOString(),
      read: true
    },
    {
      id: 4,
      type: 'payment',
      title: "To'lov tasdiqlanmadi",
      description: "Karimov Omonning to'lovi bekor qilindi",
      time: dayjs().subtract(1, 'day').toISOString(),
      read: true
    }
  ]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setTheme(value);
    const body = document.querySelector("body");

    if (body) {
      body.classList.remove("light", "dark");
      body.classList.add(value);
    }
  };

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');

    if (!meta) return;

    if (theme === "dark") {
      meta.setAttribute("content", "#151515");
    } else {
      meta.setAttribute("content", "#ffffff");
    }
  }, [theme]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => { });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => { });
    }
  };

  React.useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.classList.remove("light", "dark");
      body.classList.add(theme);
    }
  }, []);

  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 60) {
        setIsHeaderHidden(false);
      } else if (currentY > lastScrollY.current + 5) {
        setIsHeaderHidden(true);
      } else if (currentY < lastScrollY.current - 5) {
        setIsHeaderHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'organization':
        return <div className="w-10 h-10 rounded-xl bg-orange-500 bg-opacity-20 dark:bg-orange-500 dark:bg-opacity-30 flex items-center justify-center text-orange-600 dark:text-orange-400"><Buildings2Icon className="!text-white" width={22} height={22} /></div>
      case 'payment':
        return <div className="w-10 h-10 rounded-xl bg-emerald-500 bg-opacity-20 dark:bg-emerald-500 dark:bg-opacity-30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><WalletMoneyIcon className="!text-white" width={22} height={22} /></div>
      case 'student':
        return <div className="w-10 h-10 rounded-xl bg-blue-500 bg-opacity-20 dark:bg-blue-500 dark:bg-opacity-30 flex items-center justify-center text-blue-600 dark:text-blue-400"><UserCircleIcon className="!text-white" width={22} height={22} /></div>
      case 'system':
        return <div className="w-10 h-10 rounded-xl bg-amber-500 bg-opacity-20 dark:bg-amber-500 dark:bg-opacity-30 flex items-center justify-center text-amber-600 dark:text-amber-400"><InfoCircleIcon className="!text-white" width={22} height={22} /></div>
      default:
        return <div className="w-10 h-10 rounded-xl bg-gray-500 bg-opacity-20 dark:bg-gray-500 dark:bg-opacity-30 flex items-center justify-center text-gray-600 dark:text-gray-400"><InfoCircleIcon className="!text-white" width={22} height={22} /></div>
    }
  }

  const getNotificationTitleColor = (type: string) => {
    switch (type) {
      case 'payment': return 'text-emerald-600 dark:text-emerald-400';
      case 'student': return 'text-blue-600 dark:text-blue-400';
      case 'system': return 'text-amber-600 dark:text-amber-400';
      case 'organization': return 'text-orange-600 dark:text-orange-400'; // Added organization title color
      default: return '';
    }
  }

  return (
    <div
      style={{
        background: sidebarGradient !== 'none' ? sidebarGradient : undefined,
        backgroundImage: sidebarImage !== 'none' ? `url(/images/background/image-${sidebarImage}.jpg)` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className={
        `overflow-hidden sm:px-4 px-2 py-2 flex gap-2 sm:gap-3 justify-end items-center h-14 m-2 rounded-xl shadow shadow-[#E2E8F050] dark:shadow-[#00000050] transition-all duration-300 sticky top-2 z-40 ${isCustomBg ? 'text-white border-0' : 'bg-white/60 dark:bg-[#15151560] backdrop-blur-sm'} ${isHeaderHidden ? '-translate-y-[120%]' : 'translate-y-0'}`
      }
    >
      <div className="mr-auto flex items-center gap-3 sm:gap-5 z-10 relative">
        {isSmallScreen && (
          <button
            onClick={() => setSidebar(true)}
            className={`p-2 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isCustomBg ? "hover:bg-white/10" : ""}`}
          >
            <HamburgerMenuIcon width={24} height={24} className={isCustomBg ? "!text-white" : "!text-gray-600 dark:!text-gray-300"} />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <img className="h-8 object-contain" src={resolvedTheme === "dark" ? LogoLight : LogoDark} alt="Logo" />
        </div>
        {!isSmallScreen && (
          <Popover
            open={openApps}
            trigger={"click"}
            placement="bottomRight"
            content={
              <div className="w-64">
                <Typography.Text className="!text-xs uppercase !font-bold tracking-wide !text-gray-400 !mb-3 !block">
                  {t("Tezkor havolalar")}
                </Typography.Text>
                <div className="grid grid-cols-3 gap-2">
                  {quickLinks.map((link) => {
                    return (
                      <div
                        key={link.path}
                        onClick={() => {
                          navigate(link.path)
                          setOpenApps(false)
                        }}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl cursor-pointer
                        hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[link.color]}`}>
                          {link.icon}
                        </div>
                        <Typography.Text className="!text-[11px] !leading-tight text-center truncate w-full">
                          {t(link.label)}
                        </Typography.Text>
                      </div>
                    )
                  })}
                </div>
              </div>
            }
            onOpenChange={(open) => setOpenApps(open)}
          >
            <div
              className={"flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"}
              onClick={() => setOpenApps(true)}
            >
              <Widget2Icon width={22} height={22} className="!text-green-600 dark:!text-green-300" />
            </div>
          </Popover>
        )}
      </div>

      {/* Fullscreen toggle */}
      {!isSmallScreen && (
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={toggleFullscreen}
          title={isFullscreen ? t("Kichraytirish") : t("To'liq ekran")}
        >
          {isFullscreen ? (
            <MinimizeSquareMinimalisticIcon width={20} height={20} className={isCustomBg ? '!text-white hover:!text-gray-500' : '!text-gray-600 dark:!text-gray-300'} />
          ) : (
            <MaximizeSquareMinimalisticIcon width={20} height={20} className={isCustomBg ? '!text-white hover:!text-gray-500' : '!text-gray-600 dark:!text-gray-300'} />
          )}
        </div>
      )}

      {/* Theme toggle */}
      <Dropdown
        menu={{
          items: [
            {
              key: 'light',
              label: t("Yorug'"),
              icon: <SunIcon width={16} height={16} className="!text-yellow-500" />,
              onClick: () => handleThemeChange('light')
            },
            {
              key: 'dark',
              label: t("Qorong'u"),
              icon: <MoonIcon width={16} height={16} className="!text-blue-500" />,
              onClick: () => handleThemeChange('dark')
            },
            {
              key: 'system',
              label: t("Tizim"),
              icon: <MonitorSmartphoneIcon width={16} height={16} className="text-gray-500 dark:text-gray-400" />,
              onClick: () => handleThemeChange('system')
            }
          ]
        }}
        placement="bottomRight"
        trigger={['click']}
      >
        <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {theme === "light" ? (
            <SunIcon width={20} height={20} className={isCustomBg ? '!text-white hover:!text-gray-500' : '!text-yellow-600 dark:!text-yellow-300'} />
          ) : theme === "dark" ? (
            <MoonIcon width={20} height={20} className={isCustomBg ? '!text-white hover:!text-gray-500' : '!text-blue-500 dark:!text-blue-400'} />
          ) : (
            <MonitorSmartphoneIcon width={20} height={20} className={isCustomBg ? '!text-white hover:!text-gray-500' : '!text-gray-600 dark:!text-gray-300'} />
          )}
        </div>
      </Dropdown>

      {/* Language */}
      <div className="hidden sm:flex items-center justify-center">
        <Language openLanguage={openLanguage} setOpenLanguage={setOpenLanguage} />
      </div>



      {/* Notifications */}
      <Popover
        open={openNotifications}
        onOpenChange={setOpenNotifications}
        trigger="click"
        placement="bottom"
        content={
          <div className="w-80 -mt-1 -mx-1">
            <div className="flex items-center justify-between px-2">
              <Typography.Title level={5} className="!mb-0">{t("Bildirishnomalar")}</Typography.Title>
              {notifications.length ? <div className="flex gap-1">
                <Tooltip title={t("Hammasini o'qilgan deb belgilash")}>
                  <Button
                    type="text"
                    shape="circle"
                    icon={<CheckReadIcon width={18} height={18} className="!text-blue-500" />}
                    onClick={markAllAsRead}
                    className="flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-500 dark:hover:bg-opacity-10"
                  />
                </Tooltip>

              </div> : null}
            </div>
            <div className="max-h-[400px] overflow-y-auto py-2">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`px-2 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-xl transition-all duration-200 relative overflow-hidden group
                      ${!n.read ? 'bg-blue-50 bg-opacity-70 dark:bg-blue-500 dark:bg-opacity-10' : 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-50'}
                    `}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-500 rounded-r-full" />
                    )}
                    <div className="">
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <Typography.Text strong className={`!text-[15px] block truncate pr-4 ${getNotificationTitleColor(n.type)}`}>
                        {n.title}
                      </Typography.Text>
                      <Typography.Text type="secondary" className="!text-[12px] block leading-tight text-gray-600 dark:text-gray-400">
                        {n.description}
                      </Typography.Text>
                      <Typography.Text className="!text-[11px] !text-gray-400 mt-1 !font-medium">
                        {dayjs(n.time).fromNow()}
                      </Typography.Text>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-30">
                  <BellIcon width={48} height={48} />
                  <Typography.Text className="text-sm font-medium">{t("Bildirishnomalar yo'q")}</Typography.Text>
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <Button type="link" block className="!text-[13px] h-8 font-semibold hover:bg-blue-50 dark:hover:bg-blue-500 dark:hover:bg-opacity-5">
                {t("Barchasini ko'rish")}
              </Button>
            )}
          </div>
        }
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          onClick={() => setOpenNotifications(true)}
        >
          <Badge count={unreadCount} size="small" offset={[2, 2]} className="flex items-center justify-center">
            <BellIcon width={22} height={22} className={isCustomBg ? '!text-white' : '!text-blue-600 dark:!text-blue-300'} />
          </Badge>
        </div>
      </Popover>
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-[#252836] transition-colors"
        onClick={() => setOpenSettings(true)}
      >
        <SettingsIcon className={isCustomBg ? '!text-white animate-[spin_4s_linear_infinite]' : 'animate-[spin_4s_linear_infinite] !text-gray-500 dark:!text-gray-400'} width={24} height={24} />
      </div>

      <SettingsDrawer open={openSettings} onClose={() => setOpenSettings(false)} />
    </div>
  );
};

export default Header;
