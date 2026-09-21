import React from "react";
import { Layout, Typography } from "antd";
import Button from "../button";
import useHooks from "../../hooks/useHooks";
import { AltArrowLeftIcon } from "../../assets/icon/components/solar-bold-duotone-icons";
import { TMeta } from "../../services/types";
import { get } from "lodash";

const Panel = ({
  children,
  className = "",
  header = true,
  title,
  hasButton = true,
  meta,
  onClick,
  headerRight,
  hasBack = false,
  ref
}: {
  children: React.ReactNode;
  className?: string;
  header?: boolean
  title?: string;
  hasButton?: boolean;
  meta?: TMeta;
  onClick?: () => void;
  headerRight?: React.ReactNode;
  hasBack?: boolean;
  ref?: any;
}) => {
  const { t, navigate } = useHooks()
  return (
    <Layout
      rootClassName={`dark:!bg-[#151515] rounded-xl p-2 md:p-4 fade-item !bg-white ${className}`}
      ref={ref}
    >
      {header ? <div className="flex flex-col gap-2  mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {hasBack && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-0.5 shrink-0 text-gray-400 hover:text-blue-500 transition cursor-pointer -ml-1"
              >
                <AltArrowLeftIcon className="!w-5 !h-5 !text-current" />
                <span className="text-[13.5px] font-medium">{t('Ortga')}</span>
              </button>
            )}
            <Typography.Title level={4} className="!mb-0 truncate">{t(title as string)}</Typography.Title>
          </div>
          {meta && get(meta, 'total', 0) > 0 ? <Typography.Text className="mx-auto hidden md:block">{t("Umumiy {{total}} tadan {{count}} ta", { total: get(meta, "total", 0), count: get(meta, "count", 0) })}</Typography.Text> : null}
          <div className="flex items-center gap-2">
            {headerRight}
            {hasButton && onClick ? <Button
              type="primary"
              onClick={onClick}
            >
              {t("Qo'shish")}
            </Button> : null}
          </div>
        </div>
        {meta && get(meta, 'total', 0) > 0 ? <Typography.Text className="mx-auto md:hidden">{t("Umumiy {{total}} tadan {{count}} ta", { total: get(meta, "total", 0), count: get(meta, "count", 0) })}</Typography.Text> : null}

      </div>
        : null}
      {children}
    </Layout>
  );
};

export default Panel;
