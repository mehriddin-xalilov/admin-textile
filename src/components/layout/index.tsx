import { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import Sidebar from "./sidebar";
import Content from "./content";
import { Outlet } from "react-router-dom";
import Header from "./header";
import { useStore } from "../../services/index.ts";
import { useWindowSize } from "../../hooks/useWindowSize.tsx";
import Logo from "../../assets/images/logo.svg";

const Layout = () => {
  const { bodyBg } = useStore((state) => state);
  const { isMobile, isTablet } = useWindowSize();
  const isSmallScreen = isMobile || isTablet;
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default" && !localStorage.getItem("notificationRequested")) {
        // Show our custom UI button instead of auto-prompting (fixes iOS Safari blockage)
        setShowNotificationPrompt(true);
      }
    }
  }, []);

  const requestNotificationPermission = () => {
    localStorage.setItem("notificationRequested", "true");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Bildirishnomalar yoqildi", {
          body: "Sizga endi tizimdan muhim xabarlar kelib turadi.",
          icon: Logo
        });
      }
      setShowNotificationPrompt(false);
    });
  };

  const closeNotificationPrompt = () => {
    localStorage.setItem("notificationRequested", "true");
    setShowNotificationPrompt(false);
  };

  return (
    <div
      className={`flex flex-col w-full min-h-screen font-sans ${bodyBg === 'none' ? 'bg-[#F4F7FE] dark:bg-black' : 'text-gray-800 dark:text-gray-200'}`}
      style={bodyBg !== 'none' ? { background: bodyBg } : {}}
    >
      <Header />

      <div className="flex w-full flex-1 relative">
        <Sidebar />
        <div
          className={`flex flex-col w-full transition-all duration-300 ease-in-out ${isSmallScreen ? '' : 'xl:pl-[80px]'}`}
        >
          <Content>
            <Outlet />
          </Content>
        </div>
      </div>

      {showNotificationPrompt && (
        <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-[9999] bg-white dark:bg-[#151515] p-5 rounded-2xl shadow-2xl dark:shadow-black/50 max-w-sm flex flex-col gap-4 border border-gray-100 dark:border-gray-800 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <img src={Logo} alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <Typography.Title level={5} className="!mb-1 !text-[15px]">Bildirishnomalar</Typography.Title>
              <Typography.Text className="!text-[13px] text-gray-500 dark:text-gray-400">
                Muhim xabarlarni o'tkazib yubormaslik uchun bildirishnomalarga ruxsat bering.
              </Typography.Text>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <Button onClick={closeNotificationPrompt} type="default" className="border-gray-200 dark:border-gray-700 dark:text-gray-300">Keyinroq</Button>
            <Button type="primary" onClick={requestNotificationPermission} className="bg-blue-600">Ruxsat berish</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
