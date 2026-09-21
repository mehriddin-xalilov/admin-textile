import React, { useEffect, useRef, useState } from 'react';
import { Typography } from 'antd';

interface ViewLayoutProps {
  header?: {
    logo?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    extra?: React.ReactNode;
    cards?: React.ReactNode;
  };
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const ViewLayout: React.FC<ViewLayoutProps> = ({ header, left, right, children, className = '' }) => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 100) {
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

  const stickyTop = isHeaderHidden ? 'lg:top-2' : 'lg:top-[72px]';

  return (
    <div className={`flex flex-col gap-4 slide-down-item ${className}`}>
      {header && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {header.logo}
              <div className="flex flex-col">
                <Typography.Title level={3} className="!mb-0">
                  {header.title}
                </Typography.Title>
                {header.subtitle && (
                  <Typography.Text type="secondary">{header.subtitle}</Typography.Text>
                )}
              </div>
            </div>
            {header.extra}
          </div>
          {header.cards && header.cards}
        </div>
      )}

      {left || right ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className={`lg:col-span-3 flex flex-col gap-4 lg:sticky lg:h-max transition-all duration-300 ${stickyTop}`}>
            {left}
          </div>
          <div className="lg:col-span-9">
            {right}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ViewLayout;
