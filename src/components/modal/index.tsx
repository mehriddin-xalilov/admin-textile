import { Modal, ModalProps, Typography } from "antd";
import { CloseCircleIcon } from "../../assets/icon/components/solar-bold-duotone-icons";
import React from "react";

interface Props extends ModalProps {
  title?: React.ReactNode;
  header?: React.ReactNode;
  extraIcon?: any;
  bodyClassName?: string;
  hasDownload?: boolean;
  customRender?: boolean;
}

const Index = (props: Props) => {
  const {
    header,
    onClose,
    onCancel,
    bodyClassName,
    title,
    children,
    extraIcon,
    customRender = true
  } = props;
  return (
    <Modal
      centered={true}
      {...props}
      destroyOnClose={true}
      rootClassName={`[&_.textile-modal-mask]:backdrop-blur-[1.5px] [&_.textile-modal-mask]:!bg-[#00000050]  [&_.textile-modal]:!pointer-events-auto !relative !z-[100] ${props.rootClassName}`}
      footer={false}
      closeIcon={<CloseCircleIcon />}
      modalRender={
        customRender
          ? () => (
            <div className="dark:bg-[#1d1d1d] bg-white rounded-2xl  relative z-10 textile-modal-wrapper xs:my-5 ">
              {/* Sarlavha: oq fon, to'q matn (marketplace uslubi) */}
              <div className="md:px-6 md:pt-5 md:pb-4 p-4 bg-white dark:bg-[#1d1d1d] border-b border-gray-100 dark:border-gray-800 rounded-t-2xl textile-modal-head sticky top-0 z-[9999]">
                <div className={`flex gap-5 justify-between items-start`}>
                  <Typography.Title className={"!mb-0 !text-gray-900 dark:!text-white"} level={4}>
                    {title}
                  </Typography.Title>
                  <button
                    type="button"
                    aria-label="Yopish"
                    // @ts-ignore
                    onClick={onClose || onCancel}
                    className="w-9 h-9 -mr-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                  >
                    <CloseCircleIcon className="w-6 h-6" />
                  </button>
                </div>
                {header ? (
                  <span className={"text-gray-500 dark:text-gray-400 block mt-1 text-sm"}>{header}</span>
                ) : null}
              </div>
              <div className={`p-3 lg:p-5 ${bodyClassName}`}>{children}</div>
            </div>
          )
          : undefined
      }
    />
  );
};

export default Index;
