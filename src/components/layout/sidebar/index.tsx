import { Drawer, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import { helpers, useStore } from "../../../services";
import useAccess from "../../../hooks/useAccess";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { useResolvedTheme } from "../../../hooks";
import LogoDark from "../../../assets/images/logo-dark.svg";
import LogoLight from "../../../assets/images/logo-light.svg";
import { AltArrowRightIcon, Book2Icon, ExitIcon, HamburgerMenuIcon } from "../../../assets/icon/components/solar-line-duotone-icons";
import { useRoutes } from "../../../routes";

const Sidebar: React.FC = () => {
  const { sidebarImage, sidebarGradient, primaryColor, setSidebar, sidebar, language, user, setLogout } = useStore((state) => state);
  const resolvedTheme = useResolvedTheme();
  const { sidebarRoutes } = useRoutes()
  const isCustomBg = sidebarImage !== 'none' || sidebarGradient !== 'none';
  const { permissions } = useAccess();
  const location = useLocation();
  const [open, setOpen] = React.useState<number | null>(null);
  const [sidebarHovered, setSidebarHovered] = React.useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const { isMobile, isTablet } = useWindowSize();
  const isSmallScreen = isMobile || isTablet;

  React.useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1280px)").matches;
    if (!isDesktop && sidebar) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [sidebar]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebar(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSidebar]);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 100) setIsHeaderHidden(false);
      else if (currentY > lastScrollY.current + 5) setIsHeaderHidden(true);
      else if (currentY < lastScrollY.current - 5) setIsHeaderHidden(false);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);




  const filteredRoutes = helpers.filterRoutesByPermissions(sidebarRoutes, permissions);

  const sidebarContent = (
    <div
      className="flex flex-col h-full overflow-hidden relative group/sidebar"
      style={isSmallScreen ? {
        background: sidebarGradient !== 'none' ? sidebarGradient : undefined,
        backgroundImage: sidebarImage !== 'none' ? `url(/images/background/image-${sidebarImage}.jpg)` : undefined,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {isSmallScreen && (
        <div className="flex items-center justify-between p-4 shrink-0 border-b border-gray-100 dark:border-gray-800">
          <img className="h-8 object-contain shrink-0" src={resolvedTheme === "dark" ? LogoLight : LogoDark} alt="Logo" />
          <button onClick={() => setSidebar(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <HamburgerMenuIcon width={24} height={24} className={isCustomBg ? "!text-white" : "!text-gray-600 dark:!text-gray-400"} />
          </button>
        </div>
      )}

      <div className="flex-1 px-2 overflow-y-auto pt-2 flex flex-col gap-1.5 custom-scrollbar">
        {filteredRoutes?.map((item: any, index: number) => {
          const hasChildren = get(item, "children", [])?.length > 0;
          const itemPath = get(item, "path");

          const isAnyChildActive = hasChildren && get(item, "children", []).some((child: any) => {
            const cp: string = get(child, "path", "");
            const [cpPath] = cp.split('?');
            return cpPath && (location.pathname === cpPath || location.pathname.startsWith(cpPath + '/'));
          });
          const isItemActive = location.pathname === itemPath || isAnyChildActive;

          // ── Accordion (children) ────────────────────────────
          if (hasChildren) {
            const opened = open === index || isAnyChildActive;
            // Desktop collapsed holida children joy egallamamasligi uchun
            const effectivelyOpened = isSmallScreen ? opened : (sidebarHovered && opened);
            return (
              <div key={index} className="flex flex-col gap-1">
                <button
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer group transition-all
                    ${isItemActive
                      ? (isCustomBg ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-[#1f2233]')
                      : (isCustomBg ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-50 dark:hover:bg-[#1a1d27]')
                    }`}
                  onClick={() => setOpen(open === index ? null : index)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="transition-transform group-hover:scale-110 duration-200 shrink-0">
                      {React.cloneElement(get(item, "icon", ""), { width: 22, height: 22 })}
                    </div>
                    {/* Text: hidden on xl (collapsed), visible on sidebar hover */}
                    <Typography.Text className={`
                      !text-[15px] !font-medium whitespace-nowrap inline-block transition-all duration-300
                      xl:!opacity-0 xl:!w-0 xl:overflow-hidden
                      group-hover/sidebar:!opacity-100 group-hover/sidebar:!w-auto group-hover/sidebar:overflow-visible
                      ${isSmallScreen ? '!opacity-100 !w-auto overflow-visible' : ''}
                      ${isItemActive
                        ? (isCustomBg ? '!text-white' : '!text-blue-600 dark:!text-blue-400')
                        : (isCustomBg ? '!text-white' : 'group-hover:!text-blue-500')
                      }`}>
                      {get(item, "title", "")}
                    </Typography.Text>
                  </div>
                  {/* Arrow: hidden on xl, visible on sidebar hover */}
                  <AltArrowRightIcon
                    className={`
                      !w-4 !h-4 shrink-0 transition-all duration-300
                      ${opened ? "rotate-90" : ""}
                      xl:opacity-0 group-hover/sidebar:opacity-100
                      ${isSmallScreen ? 'opacity-100' : ''}
                      ${isItemActive
                        ? (isCustomBg ? "!text-white" : "!text-blue-600")
                        : (isCustomBg ? "!text-white" : "!text-gray-400 group-hover:!text-blue-500")
                      }`}
                  />
                </button>

                {/* Children dropdown */}
                <div className={`
                  grid transition-[grid-template-rows,opacity] duration-300 ease-in-out overflow-hidden
                  ${effectivelyOpened ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                `}>
                  <div className="overflow-hidden">
                    <div className="ml-6 my-1 pl-4 border-l-2 border-gray-100 dark:border-gray-800 flex flex-col gap-1">
                      {get(item, "children", []).map((child: any, cidx: number) => (
                        <NavLink
                          to={get(child, "path")}
                          key={cidx}
                          className={({ isActive }) =>
                            `text-[14px] py-1.5 px-3 rounded-lg flex items-center gap-2.5 transition-all ${isActive
                              ? "!text-white font-semibold !bg-blue-600 shadow-sm shadow-blue-500/30"
                              : (isCustomBg
                                ? "text-white/80 hover:text-white hover:bg-white/10"
                                : "text-gray-500 hover:text-blue-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-[#1f2233]")
                            }`
                          }
                          onClick={() => { if (isSmallScreen) setSidebar(false); }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                          <span>{get(child, "title", "")}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // ── Simple NavLink ──────────────────────────────────
          return (
            <NavLink
              to={itemPath}
              onClick={() => { setOpen(null); if (isSmallScreen) setSidebar(false); }}
              key={index}
              className={({ isActive }) =>
                `group w-full rounded-xl p-3 flex justify-between items-center cursor-pointer transition-all duration-200 relative overflow-hidden
                 ${isActive
                  ? "font-semibold shadow-md text-white"
                  : (isCustomBg ? "text-white hover:bg-white/10" : "text-gray-600 dark:text-gray-400 hover:bg-blue-200 dark:hover:bg-blue-900/40")}`
              }
              style={({ isActive }) => isActive ? { backgroundColor: primaryColor, boxShadow: `0 4px 14px 0 ${primaryColor}40` } : {}}
            >
              {({ isActive }) => (
                <>
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`} />
                  <div className="flex items-center gap-3">
                    <div className="transition-transform group-hover:scale-110 duration-200 shrink-0">
                      {React.cloneElement(get(item, "icon", ""), isActive || isCustomBg ? {
                        width: 22, height: 22,
                        className: (isActive || isCustomBg) ? "!text-white" : ""
                      } : {
                        width: 22, height: 22,
                      })}
                    </div>
                    <Typography.Text className={`
                      !text-[15px] !font-medium whitespace-nowrap inline-block transition-all duration-300
                      xl:!opacity-0 group-hover/sidebar:!opacity-100
                      ${isSmallScreen ? '!opacity-100' : ''}
                      ${(isActive || isCustomBg) ? "!text-white" : "text-gray-600 dark:text-gray-400"}
                    `}>
                      {get(item, "title", "")}
                    </Typography.Text>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}

        {/* ── Qo'llanma (statik sahifa, yangi oynada) ── */}
        <a
          href="/qollanma.html"
          target="_blank"
          rel="noopener"
          onClick={() => { if (isSmallScreen) setSidebar(false); }}
          className={`group w-full rounded-xl p-3 mt-auto flex items-center cursor-pointer transition-all duration-200
            ${isCustomBg ? "text-white hover:bg-white/10" : "text-gray-600 dark:text-gray-400 hover:bg-blue-200 dark:hover:bg-blue-900/40"}`}
        >
          <div className="flex items-center gap-3">
            <div className="transition-transform group-hover:scale-110 duration-200 shrink-0">
              <Book2Icon width={22} height={22} className={isCustomBg ? "!text-white" : ""} />
            </div>
            <Typography.Text className={`
              !text-[15px] !font-medium whitespace-nowrap inline-block transition-all duration-300
              xl:!opacity-0 group-hover/sidebar:!opacity-100
              ${isSmallScreen ? '!opacity-100' : ''}
              ${isCustomBg ? "!text-white" : "text-gray-600 dark:text-gray-400"}
            `}>
              Qo'llanma
            </Typography.Text>
          </div>
        </a>
      </div>

      {/* ── Footer: Profile + Logout ── */}
      <div className="shrink-0 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <NavLink
            to="/profile"
            onClick={() => { setOpen(null); if (isSmallScreen) setSidebar(false); }}
            className={({ isActive }) =>
              `group flex-1 rounded-xl p-2 flex items-center gap-0 group-hover/sidebar:gap-3 cursor-pointer transition-all duration-200
               ${isSmallScreen ? 'gap-3' : ''}
               ${isActive ? "bg-blue-600 text-white shadow-lg" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`
            }
          >
            {({ isActive }) => (
              <>
                <div className="w-10 h-10 mx-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold uppercase shrink-0 shadow-sm">
                  {get(user, 'data.first_name')?.[0] ?? ''}{get(user, 'data.last_name')?.[0] ?? ''}
                </div>
                <div className="flex flex-col min-w-0 opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto group-hover/sidebar:overflow-visible transition-all duration-300">
                  <Typography.Text className={`!text-[14px] !font-bold !leading-tight truncate ${isActive ? '!text-white' : 'dark:text-white'}`}>
                    {get(user, 'data.full_name', '')}
                  </Typography.Text>
                  <Typography.Text type="secondary" className={`!text-[11px] !leading-tight truncate ${isActive ? '!text-blue-100 opacity-70' : ''}`}>
                    {get(user, `data.position.name_${language}`, 'Foydalanuvchi')}
                  </Typography.Text>
                </div>
              </>
            )}
          </NavLink>
          <button
            onClick={() => setLogout()}
            className="w-0 h-10 opacity-0 group-hover/sidebar:w-10 group-hover/sidebar:opacity-100 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shrink-0 cursor-pointer overflow-hidden"
          >
            <ExitIcon className="!w-5 !h-5 !text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isSmallScreen) {
    return (
      <Drawer
        placement="left"
        closable={false}
        rootClassName="[&_.textile-drawer-content-wrapper]:!overflow-hidden [&_.textile-drawer-content-wrapper]:!m-1 [&_.textile-drawer-content-wrapper]:!rounded-xl"
        onClose={() => setSidebar(false)}
        open={sidebar}
        width={280}
        styles={{ body: { padding: 0 } }}
        className="!bg-white dark:!bg-[#151515]"
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <aside
      role="navigation"
      aria-label="Main sidebar"
      onClick={e => e.stopPropagation()}
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
      style={{
        background: sidebarGradient !== 'none' ? sidebarGradient : undefined,
        backgroundImage: sidebarImage !== 'none' ? `url(/images/background/image-${sidebarImage}.jpg)` : undefined,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      }}
      className={`
        overflow-hidden flex flex-col group/sidebar
        fixed left-2 bottom-2 z-[100]
        ${isHeaderHidden ? 'top-2' : 'top-[104px] sm:top-[72px]'}
        ${!isCustomBg ? 'bg-white/60 dark:bg-[#15151560] backdrop-blur-sm' : 'text-white border-0'}
        shadow-lg shadow-[#E2E8F0] dark:shadow-black/20
        rounded-xl
        transition-all duration-300 ease-in-out
        opacity-0 xl:opacity-100 w-[70px] hover:w-[280px]
      `}
    >
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;
