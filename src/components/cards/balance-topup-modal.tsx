import React, { useRef, useState } from 'react';
import { InputNumber, notification, Select, Spin, Typography } from 'antd';
import { Modal, Button } from '../index';
import { api } from '../../services';
import { get } from 'lodash';
import useHooks from '../../hooks/useHooks';
import config from '../../../config';

interface Props {
  open: boolean;
  onClose: () => void;
  organizationId: number;
  /** O'rnatilganda: admin boshqa o'quvchi uchun (faqat payme/click) */
  topUpForUserId?: number;
  onSuccess?: () => void;
}

const PROVIDERS = [
  { label: 'Payme', value: 'payme' },
  { label: 'Click', value: 'click' },
];

const MIN_AMOUNT = 100000; // tiyin

const TopUpModal: React.FC<Props> = ({ open, onClose, organizationId, topUpForUserId, onSuccess }) => {
  const { t } = useHooks();
  const forAnotherUser = Boolean(topUpForUserId);
  const [amount, setAmount] = useState<number | null>(null);
  const [provider, setProvider] = useState<string>('payme');
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPolling(false);
  };

  const startPolling = (id: number) => {
    setPolling(true);
    intervalRef.current = setInterval(async () => {
      try {
        const res = forAnotherUser
          ? await api.get(`/payment/balance/orders/${id}`)
          : await api.get(`/payment/balance/orders/${id}`, { baseURL: config.API_V1_ROOT });
        const orderPayload = get(res, 'data.data') ?? get(res, 'data');
        const status = get(orderPayload, 'status');
        if (status === 'success' || status === 'paid') {
          stopPolling();
          notification.success({ message: t("To'lov muvaffaqiyatli amalga oshirildi!") });
          onSuccess?.();
          handleClose();
        } else if (status === 'failed' || status === 'cancelled') {
          stopPolling();
          notification.error({ message: t("To'lov amalga oshmadi") });
          handleClose();
        }
      } catch {
        // polling continues
      }
    }, 3000);
  };

  const handleClose = () => {
    stopPolling();
    setAmount(null);
    setProvider('payme');
    setOrderId(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!amount || amount < MIN_AMOUNT) {
      notification.warning({ message: t("Minimum summa: 1 000 so'm (100 000 tiyin)") });
      return;
    }
    setLoading(true);
    try {
      const body = {
        organization_id: organizationId,
        amount,
        provider,
        lang: 'uz',
      };
      const res = forAnotherUser
        ? await api.post(`/students/${topUpForUserId}/payment/balance/checkout-url`, body)
        : await api.post('/payment/balance/checkout-url', body, { baseURL: config.API_V1_ROOT });
      const data = get(res, 'data.data') || get(res, 'data');
      const url = get(data, 'url');
      const id = get(data, 'order_id');

      if (url) {
        window.open(url, '_blank');
      }
      if (id) {
        setOrderId(id);
        startPolling(id);
      }
    } catch (err: any) {
      notification.error({
        message: get(err, 'response.data.message') || t("Xatolik yuz berdi"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("Balans to'ldirish")}
      open={open}
      onCancel={handleClose}
      width={440}
    >
      {polling ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Spin size="large" />
          <Typography.Text className="text-center">
            {t("To'lov kutilmoqda. Yangi oynada to'lovni amalga oshiring...")}
          </Typography.Text>
          {orderId && (
            <Typography.Text type="secondary" className="text-xs">
              {t("Order")} #{orderId}
            </Typography.Text>
          )}
          <Button danger onClick={handleClose} size="small">
            {t("Bekor qilish")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <Typography.Text className="font-medium">{t("To'lov tizimi")}</Typography.Text>
            <Select
              value={provider}
              onChange={setProvider}
              options={PROVIDERS}
              size="large"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Typography.Text className="font-medium">{t("Summa (tiyin)")}</Typography.Text>
            <InputNumber
              value={amount}
              onChange={(val) => setAmount(val)}
              min={MIN_AMOUNT}
              step={100000}
              size="large"
              className="w-full"
              placeholder="500000"
              formatter={(val) => val ? String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : ''}
              parser={(val) => Number(val?.replace(/\s/g, '')) as any}
            />
            <Typography.Text type="secondary" className="text-xs">
              {t("Minimum: 100 000 tiyin (1 000 so'm)")}
              {amount ? ` · ${Math.floor(amount / 100).toLocaleString('ru-RU')} so'm` : ''}
            </Typography.Text>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={handleClose}>{t("Bekor qilish")}</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              {t("To'lash")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TopUpModal;
