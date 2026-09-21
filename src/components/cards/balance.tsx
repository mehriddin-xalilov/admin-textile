import { Card, Space, Typography } from 'antd';
import React, { useState } from 'react';
import CountUp from '../count-up';
import { EyeClosedIcon, EyeIcon, Wallet2Icon } from '../../assets/icon/components/solar-bold-duotone-icons';
import { helpers } from '../../services';
import TopUpModal from './balance-topup-modal';
import useHooks from '../../hooks/useHooks';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  organizationName?: string;
  organizationId?: number;
  /** Admin boshqa o'quvchi sahifasida: to'lov shu foydalanuvchiga tushadi */
  topUpForUserId?: number;
  onTopUpSuccess?: () => void;
  className?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  currency = 'UZS',
  organizationName = 'Nexa LMS',
  organizationId,
  topUpForUserId,
  onTopUpSuccess,
  className = ''
}) => {
  const { t } = useHooks();
  const [isVisible, setIsVisible] = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(false);

  return (
    <Card
      className={`relative overflow-hidden !rounded-2xl shadow-lg border-none w-full h-34 flex flex-col justify-between !py-1.5 !px-2.5  ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: '#fff'
      }}
      bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-5 rounded-full" />

      <div className="z-10 flex justify-between items-start">
        <Space direction="vertical" size={0}>
          <Typography.Text className="!text-white  text-xs uppercase tracking-wider font-bold">
            {organizationName}
          </Typography.Text>
          <Typography.Text className="!text-white opacity-70 flex items-center gap-1">
            <Wallet2Icon className='!text-green-400' /> {currency} {organizationName !== 'Nexa LMS' ? 'Balans' : 'Balans'}
          </Typography.Text>
        </Space>
        <div
          onClick={() => setIsVisible(!isVisible)}
          className="cursor-pointer !text-white  hover:text-white transition-colors"
        >
          {isVisible ? <EyeClosedIcon className='!text-white' /> : <EyeIcon className='!text-white' />}
        </div>
      </div>

      <div className="z-10">
        <Typography.Title
          level={2}
          className="!text-white !mb-0 font-mono tracking-tighter"
        >
          {isVisible ? (
            <CountUp
              end={balance}
              formatter={(val) => helpers.beatifyPrice(val)}
            />
          ) : '*******'} <span className="text-lg opacity-60 ml-1">{currency}</span>
        </Typography.Title>
      </div>

      <div className="z-10 flex justify-between items-end">
        {organizationId ? (
          <button
            onClick={() => setTopUpOpen(true)}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer border-none"
          >
            + {t("Balans to'ldirish")}
          </button>
        ) : <span />}
        <div className="w-10 h-7 bg-yellow-500 opacity-20 rounded-md" />
      </div>

      {organizationId && (
        <TopUpModal
          open={topUpOpen}
          onClose={() => setTopUpOpen(false)}
          organizationId={organizationId}
          topUpForUserId={topUpForUserId}
          onSuccess={onTopUpSuccess}
        />
      )}
    </Card>
  );
};

export default BalanceCard;
