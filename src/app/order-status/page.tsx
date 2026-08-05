'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PaymentStatus } from '@/lib/payment';
import { getStoredOrders, saveOrders } from '@/lib/storage';

const statusLabelMap = {
  pending: 'Pending',
  processing: 'Processing',
  successful: 'Successful',
  failed: 'Failed',
} as const;

function mapPaymentStatusToOrderStatus(status: PaymentStatus) {
  switch (status) {
    case 'successful':
      return 'completed' as const;
    case 'failed':
      return 'cancelled' as const;
    case 'processing':
      return 'processing' as const;
    case 'pending':
    default:
      return 'pending' as const;
  }
}

export default function OrderStatusPage() {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [address, setAddress] = useState('');
  const [searchedOrderNumber, setSearchedOrderNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; orderNumber?: string; address?: string }>({});
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const matchedOrder = useMemo(() => {
    if (!searchedOrderNumber.trim()) {
      return null;
    }

    return getStoredOrders().find(
      (order) => order.id.toLowerCase() === searchedOrderNumber.trim().toLowerCase()
    ) || null;
  }, [searchedOrderNumber]);

  const hasSearched = searchedOrderNumber.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; orderNumber?: string; address?: string } = {};

    if (!email.trim()) {
      errors.email = 'Please fill this field.';
    }
    if (!orderNumber.trim()) {
      errors.orderNumber = 'Please fill this field.';
    }
    if (!address.trim()) {
      errors.address = 'Please fill this field.';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const normalizedOrderNumber = orderNumber.trim();
    setSearchedOrderNumber(normalizedOrderNumber);
    setPaymentStatus(null);
    setStatusMessage('');

    const localMatch = getStoredOrders().find(
      (order) => order.id.toLowerCase() === normalizedOrderNumber.toLowerCase()
    );

    if (!localMatch?.referenceId) {
      return;
    }

    try {
      setIsCheckingStatus(true);
      const response = await fetch(`/api/payment/status?referenceId=${encodeURIComponent(localMatch.referenceId)}`, {
        cache: 'no-store',
      });
      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data.error || 'Unable to check payment status right now.');
        return;
      }

      setPaymentStatus(data.status);
      setStatusMessage(data.message || 'Payment status updated.');

      const orders = getStoredOrders();
      const updatedOrders = orders.map((order) =>
        order.id === localMatch.id
          ? { ...order, status: mapPaymentStatusToOrderStatus(data.status) }
          : order
      );
      saveOrders(updatedOrders);
    } catch {
      setStatusMessage('Unable to check payment status right now.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: "IBM Plex Mono", monospace;
          background: #ffffff;
          color: #1b1b1b;
          min-height: 100vh;
        }
        .order-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px 16px 24px;
          background: #ffffff;
        }
        .order-card {
          width: 360px;
          max-width: 100%;
          background: transparent;
          border: none;
          box-shadow: none;
          overflow: visible;
          position: relative;
          font-family: "IBM Plex Mono", monospace;
          color: #222;
          border-radius: 0;
        }
        .order-content {
          padding: 0;
        }
        .order-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: .1em;
          color: #111111;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .order-description {
          font-size: 8px;
          color: #6a6a6a;
          line-height: 1.5;
          font-weight: 400;
          letter-spacing: .14em;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .order-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .order-form label {
          display: block;
          margin-bottom: 4px;
          font-size: 9px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: .14em;
        }
        .field-error {
          margin-top: 4px;
          font-size: 9px;
          color: #a21d1d;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .order-form input {
          width: 100%;
          min-height: 44px;
          padding: 14px 16px;
          font-family: inherit;
          font-size: 12px;
          border: 1px solid #111;
          background: #fff;
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
          border-radius: 0;
          color: #111;
          box-shadow: none;
        }
        .order-form input:focus {
          border-color: #000;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
        }
        .order-button {
          width: 100%;
          height: 46px;
          margin-top: 10px;
          background: #111;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .16em;
          transition: background .25s, transform .15s;
          border-radius: 4px;
        }
        .order-button:hover {
          background: #000;
          transform: translateY(-1px);
        }
        .back-link {
          display: block;
          margin-top: 18px;
          text-align: center;
          text-decoration: none;
          color: #111;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .045em;
          transition: color .2s, background .2s, opacity .2s;
          padding: 10px 0;
        }
        .back-link:hover {
          color: #fff;
          background: #111;
        }
        ::placeholder {
          color: #b5b5b5;
          text-transform: uppercase;
        }
      `}</style>
      <div className="order-page">
        <div className="order-card">
          <div className="order-content">
            <h1 className="order-title">View Order Status</h1>
            <p className="order-description">
              Enter the email address, order number, and shipping address from your order.
            </p>
            <form className="order-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((current) => ({ ...current, email: undefined }));
                  }}
                />
                {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="orderNumber">Order Number</label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    setFieldErrors((current) => ({ ...current, orderNumber: undefined }));
                  }}
                />
                {fieldErrors.orderNumber && <p className="field-error">{fieldErrors.orderNumber}</p>}
              </div>
              <div>
                <label htmlFor="address">Shipping Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setFieldErrors((current) => ({ ...current, address: undefined }));
                  }}
                />
                {fieldErrors.address && <p className="field-error">{fieldErrors.address}</p>}
              </div>
              <button type="submit" className="order-button">
                {isCheckingStatus ? 'Checking Status...' : 'View Order'}
              </button>
            </form>
            
            {hasSearched && matchedOrder && (
              <div className="mt-6 border border-gray-200 p-4 text-left">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mb-2">Current Status</p>
                <p className="text-sm font-semibold uppercase mb-2">
                  {paymentStatus ? statusLabelMap[paymentStatus] : matchedOrder.status}
                </p>

                {statusMessage && (
                  <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-[11px] text-gray-600 leading-5">{statusMessage}</p>
                  </div>
                )}
                {matchedOrder.referenceId && (
                  <>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mb-2">Payment Reference</p>
                    <p className="text-xs text-black mb-4">{matchedOrder.referenceId}</p>
                  </>
                )}
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mb-2">Customer</p>
                <p className="text-xs text-black mb-4">{matchedOrder.customer.name}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mb-2">Total</p>
                <p className="text-xs text-black mb-4">{matchedOrder.total.toLocaleString()} RWF</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mb-2">Items</p>
<p className="text-xs text-black">
                  {matchedOrder.items.map((item) => `${item.product.code} × ${item.quantity}`).join(', ')}
                </p>
              </div>
            )}

            {hasSearched && !matchedOrder && (
              <div className="mt-6 border border-gray-200 p-4 text-left">
                <p className="text-sm font-semibold uppercase mb-2">Order not found</p>
                <p className="text-xs text-gray-600">
                  Double-check the order ID from your confirmation page and try again.
                </p>
              </div>
            )}

            <Link href="/" className="back-link">
              GO BACK TO INKOTANYISINCE90
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
