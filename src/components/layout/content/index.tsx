import React from "react";
import { useStore } from "../../../services";

const Content = ({ children }: { children: React.ReactNode }) => {
  const { sidebar } = useStore();
  return (
    <div className={`w-full h-full px-2 pb-2`}>
      <div
        className={
          ''
          // "bg-transparent w-full h-full rounded-2xl p-3 xl:p-5 overflow-y-scroll no-scrollbar max-h-[calc(100vh_-_80px)]"
          // 'h-[calc(100vh_-_82px)] overflow-y-scroll rounded-2xl no-scrollbar'
        }
      >
        <div
          className={`${sidebar
            ? " "
            : "!w-full"
            } mx-auto transition-all`}
        >
          <a id="page-top" aria-hidden="true" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Content;
