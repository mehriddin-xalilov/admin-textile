import React from "react";
import { Panel } from "../../components";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon } from "../../assets/icon/components/solar-bold-duotone-icons";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import { get } from "lodash";
import { settingsRoutes } from "../../routes/settings";
import { helpers } from "../../services";
import { useAccess } from "../../hooks";

const Index = () => {
  const { t } = useTranslation();
  const { permissions } = useAccess()

  const filteredRoutes = helpers.filterRoutesByPermissions(
    settingsRoutes,
    permissions
  );
  return (
    <Panel header={false}>
      <div className="flex items-center justify-between mb-5">
        <Typography.Title level={4}>{t("Sozlamalar")}</Typography.Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredRoutes.map((item: any, index: number) => {
          const themeColor = get(item, "color", "#407BFF");
          return get(item, "icon") ? (
            <Link
              to={get(item, "path")}
              key={index}
              className="group relative flex flex-col p-6 rounded-2xl !transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl overflow-hidden !bg-gray-50/50 dark:!bg-[#1d1d1d] border border-gray-200 dark:border-gray-800"
            >
              {/* Background Glow Effect */}
              <div
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: themeColor }}
              />

              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 shadow-sm"
                style={{
                  backgroundColor: `${themeColor}15`,
                  color: `${themeColor} !important`
                }}
              >
                {get(item, "icon")}
              </div>

              <div className="flex flex-col gap-1">
                <Typography.Title
                  level={5}
                  className="!m-0 !text-gray-800 dark:!text-gray-200 !font-bold transition-colors group-hover:!text-blue-600 dark:group-hover:!text-blue-400"
                >
                  {t(get(item, "title") as string)}
                </Typography.Title>

              </div>

              <ArrowRightIcon
                className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                style={{ color: themeColor }}
              />
            </Link>
          ) : null;
        })}
      </div>
    </Panel>
  );
};

export default Index;
