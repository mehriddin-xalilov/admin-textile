import { Drawer, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  AltArrowRightIcon,
  SettingsIcon,
  Home2Icon,
  MapIcon,
  UserSpeakIcon,
  BookIcon,
  UsersGroupRoundedIcon,
  UserIcon,
  PeopleNearbyIcon,
  UsersGroupTwoRoundedIcon,
  Buildings2Icon,
  Banknote2Icon,
  ExitIcon,
  StarIcon,
  CalendarIcon
} from "../../../assets/icon/components/solar-bold-duotone-icons";
import { helpers, useStore } from "../../../services";
import useAccess from "../../../hooks/useAccess";
import LogoDark from "../../../assets/images/logo-dark.svg";
import LogoLight from "../../../assets/images/logo-light.svg";
import { HamburgerMenuIcon } from "../../../assets/icon/components/solar-line-duotone-icons";
import { useResolvedTheme } from "../../../hooks";

const MobileSidebar: React.FC = () => {
  const { sidebarImage, sidebarGradient, primaryColor, sidebar, setSidebar, user, setLogout } = useStore((state) => state);
  const resolvedTheme = useResolvedTheme();
  const isCustomBg = sidebarImage !== 'none' || sidebarGradient !== 'none';
  const { permissions } = useAccess();
  const location = useLocation();
  const [open, setOpen] = React.useState<number | null>(null);

  const routes = [
    { path: '/', title: "Statistika", icon: <Home2Icon className={isCustomBg ? "!text-white" : ""} />, permissions: ['statistics.list'] },
    { path: '/organizations', title: "Tashkilotlar", icon: <Buildings2Icon className={isCustomBg ? "!text-white" : ""} />, permissions: ['organizations.list'] },
    { path: '/my-organization', title: "Mening tashkilotim", icon: <Buildings2Icon className={isCustomBg ? "!text-white" : ""} />, permissions: ['my-organization.view'] },
    { path: "/users", title: "Barcha foydalanuvchilar", icon: <UsersGroupTwoRoundedIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["users.list"] },
    { path: "/students", title: "O'quvchilar", icon: <UserIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["students.list"] },
    { path: "/parents", title: "Ota-onalar", icon: <PeopleNearbyIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["parents.list"] },
    { path: "/employees", title: "Xodimlar", icon: <UserSpeakIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["employees.list"] },
    { path: "/branches", title: "Filiallar", icon: <MapIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["branches.list"] },
    { path: '/groups', title: "Guruhlar", icon: <UsersGroupRoundedIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["groups.list"] },
    { path: '/rooms', title: "Xonalar", icon: <Buildings2Icon className={isCustomBg ? "!text-white" : ""} />, permissions: ["rooms.list"] },
    { path: '/courses', title: "Kurslar", icon: <BookIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["courses.list"] },
    { path: "/calendar", title: "Taqvim", icon: <CalendarIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["lessons.list"] },
    { path: '/transactions', title: "Moliya", icon: <Banknote2Icon className={isCustomBg ? "!text-white" : ""} />, permissions: ['transactions.list'] },
    { path: "/subscriptions", title: "Obuna", icon: <StarIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["subscriptions.list"] },
    { path: "/settings", title: "Sozlamalar", icon: <SettingsIcon className={isCustomBg ? "!text-white" : ""} />, permissions: ["settings.list"] },
  ];

  const filteredRoutes = helpers.filterRoutesByPermissions(routes, permissions);

  return (
    <Drawer
      placement="left"
      closable={false}
      onClose={() => setSidebar(false)}
      open={sidebar}
      width={280}
      styles={{
        body: { padding: 0 }
      }}
      className={`border-none ${!isCustomBg ? 'bg-white dark:bg-[#151515]' : 'text-white'}`}
      style={{
        background: sidebarGradient !== 'none' ? sidebarGradient : undefined,
        backgroundImage: sidebarImage !== 'none' ? `url(/src/assets/images/background/image-${sidebarImage}.jpg)` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex flex-col h-full overflow-hidden relative">
        {/* Header/Logo part inside Sidebar */}
        <div className="flex items-center justify-between p-4 shrink-0 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <img className="h-8 object-contain shrink-0" src={resolvedTheme === "dark" ? LogoLight : LogoDark} alt="Logo" />
          </div>
          <button onClick={() => setSidebar(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <HamburgerMenuIcon width={24} height={24} className={isCustomBg ? "!text-white" : "!text-gray-600 dark:!text-gray-400"} />
          </button>
        </div>

        {/* Scrollable Nav Item list */}
        <div className="flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
          {filteredRoutes?.map((item: any, index: number) => {
            const hasChildren = get(item, "children", [])?.length > 0;
            const itemPath = get(item, "path");
            const isAnyChildActive = hasChildren && get(item, "children", []).some((child: any) => location.pathname === get(child, "path"));
            const isItemActive = location.pathname === itemPath || isAnyChildActive;

            if (hasChildren) {
              const opened = open === index || isAnyChildActive;
              return (
                <div key={index} className="flex flex-col gap-1">
                  <button
                    type="button"
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${isItemActive ? (isCustomBg ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-[#1f2233]') : (isCustomBg ? 'active:bg-white/10 text-white' : 'active:bg-gray-50 dark:active:bg-[#1a1d27]')}`}
                    onClick={() => setOpen(open === index ? null : index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">{React.cloneElement(get(item, "icon", ""), { width: 22, height: 22 })}</div>
                      <Typography.Text className={`!text-[15px] !font-medium ${isItemActive ? (isCustomBg ? '!text-white' : '!text-blue-600 dark:!text-blue-400') : (isCustomBg ? '!text-white' : '')}`}>
                        {get(item, "title", "")}
                      </Typography.Text>
                    </div>
                    <AltArrowRightIcon className={`!w-4 !h-4 transition-all duration-300 ${opened ? "rotate-90" : ""} ${isItemActive ? (isCustomBg ? "!text-white" : "!text-blue-600") : (isCustomBg ? "!text-white" : "!text-gray-400")}`} />
                  </button>

                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${opened ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="ml-6 my-1 pl-4 border-l-2 border-gray-100 dark:border-gray-800 flex flex-col gap-1">
                        {get(item, "children", []).map((child: any, cidx: number) => (
                          <NavLink
                            to={get(child, "path")}
                            key={cidx}
                            className={({ isActive }) => `text-[14px] py-2 px-3 rounded-lg flex items-center gap-2.5 transition-all ${isActive ? "text-white font-semibold bg-blue-600 shadow-sm shadow-blue-500/30" : (isCustomBg ? "text-white/80 active:text-white active:bg-white/10" : "text-gray-500 active:text-blue-500 active:bg-gray-50 dark:text-gray-400 dark:active:text-blue-400 dark:active:bg-[#1f2233]")}`}
                            onClick={() => setSidebar(false)}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                            <span>{get(child, "title", "")}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                to={itemPath}
                onClick={() => { setOpen(null); setSidebar(false); }}
                key={index}
                className={({ isActive }) => `w-full rounded-xl px-3 py-3 flex justify-between items-center cursor-pointer transition-all duration-200 relative overflow-hidden active:scale-[0.98] ${isActive ? "font-semibold shadow-md text-white" : (isCustomBg ? "text-white active:bg-white/10" : "text-gray-600 dark:text-gray-400 active:bg-gray-50 dark:active:bg-[#1a1d27]")}`}
                style={({ isActive }) => isActive ? { backgroundColor: primaryColor, boxShadow: `0 4px 14px 0 ${primaryColor}40` } : {}}
              >
                {({ isActive }) => (
                  <>
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`} />
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 ml-1">
                        {React.cloneElement(get(item, "icon", ""), { width: 22, height: 22, className: (isActive || isCustomBg) ? "!text-white" : "text-gray-500 dark:text-gray-400" })}
                      </div>
                      <Typography.Text className={`!text-[15px] !font-medium whitespace-nowrap ${(isActive || isCustomBg) ? "!text-white" : "text-gray-600 dark:text-gray-400"}`}>
                        {get(item, "title", "")}
                      </Typography.Text>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Profile / Logout Banner Bottom */}
        <NavLink
          to="/profile"
          onClick={() => { setOpen(null); setSidebar(false); }}
          className={({ isActive }) => `w-full rounded-xl p-3 flex items-center cursor-pointer transition-all duration-200 gap-3 active:scale-[0.98] ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500 shadow-opacity-30" : "active:bg-gray-50 dark:active:bg-gray-800 dark:active:bg-opacity-50"}`}
          style={({ isActive }) => isActive ? { backgroundColor: primaryColor } : {}}
        >
          {({ isActive }) => (
            <>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[15px] font-bold uppercase shrink-0 shadow-sm">
                {get(user, 'data.first_name', '?')}{get(user, 'data.last_name', '')}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <Typography.Text className={`!text-[15px] !font-bold !leading-tight truncate ${isActive || isCustomBg ? '!text-white' : 'dark:text-white'}`}>
                  {get(user, 'data.full_name', '')}
                </Typography.Text>
                <Typography.Text className={`!text-[12px] truncate ${isActive || isCustomBg ? '!text-white/80' : '!text-gray-500'}`}>
                  {get(user, 'data.role', 'Admin')}
                </Typography.Text>
              </div>
              <button
                className={`p-2 rounded-xl transition-colors shrink-0 ml-2 ${isActive || isCustomBg ? "hover:bg-white/20 text-white" : "hover:bg-red-50 text-red-500 dark:hover:bg-red-500/10"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setLogout();
                }}
                title="Tizimdan chiqish"
              >
                <ExitIcon width={22} height={22} className={!(isActive || isCustomBg) ? "!text-red-500" : ""} />
              </button>
            </>
          )}
        </NavLink>
      </div>
    </Drawer>
  );
};

export default MobileSidebar;
