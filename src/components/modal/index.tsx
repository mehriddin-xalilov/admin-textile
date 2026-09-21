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
              <div className="md:p-5 p-3 bg-[#1e50e7] rounded-t-2xl textile-modal-head sticky top-0 z-[9999]">
                <div className={`flex gap-5 justify-between`}>
                  <Typography.Title className={"!text-white"} level={4}>
                    {title}
                  </Typography.Title>
                  <div className="flex gap-5">
                    <CloseCircleIcon
                      className="text-white cursor-pointer w-7 h-7 min-w-7 min-h-7 hover:text-gray-300 transition-colors"
                      // @ts-ignore
                      onClick={onClose || onCancel}
                    />
                  </div>
                </div>
                {header ? (
                  <span className={"text-white block"}>{header}</span>
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
