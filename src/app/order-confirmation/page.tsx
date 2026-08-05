'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PaymentStatus } from '@/lib/payment';
import { getStoredOrders, saveOrders } from '@/lib/storage';

const statusLabelMap = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
  successful: 'Successful',
  failed: 'Failed',
} as const;

const statusToneMap = {
  pending: 'bg-gray-400',
  processing: 'bg-black',
  completed: 'bg-black',
  cancelled: 'bg-gray-400',
  successful: 'bg-black',
  failed: 'bg-gray-400',
} as const;

function mapPaymentStatusToOrderStatus(status: PaymentStatus | null) {
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

export default function OrderConfirmationPage() {
  const router = useRouter();
  const latestOrder = useMemo(() => {
    const orders = getStoredOrders();
    if (orders.length === 0) {
      return null;
    }

    return orders[orders.length - 1];
  }, []);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const effectiveStatus = paymentStatus ? mapPaymentStatusToOrderStatus(paymentStatus) : latestOrder?.status;
  const statusLabel = effectiveStatus ? statusLabelMap[effectiveStatus] : 'Processing';
  const statusTone = effectiveStatus ? statusToneMap[effectiveStatus] : 'bg-black';
  const placedAt = latestOrder
    ? new Date(latestOrder.createdAt).toLocaleString('en-RW', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  useEffect(() => {
    let cancelled = false;

    const checkStatus = async () => {
      if (!latestOrder?.referenceId) {
        return;
      }

      setIsCheckingStatus(true);

      try {
        const response = await fetch(
          `/api/payment/status?referenceId=${encodeURIComponent(latestOrder.referenceId)}`,
          { cache: 'no-store' }
        );
        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setStatusMessage(data.error || 'Unable to check payment status right now.');
          }
          return;
        }

        if (cancelled) {
          return;
        }

        setPaymentStatus(data.status);
        setStatusMessage(data.message || 'Payment status updated.');

        const orders = getStoredOrders();
        const updatedOrders = orders.map((order) =>
          order.id === latestOrder.id
            ? { ...order, status: mapPaymentStatusToOrderStatus(data.status) }
            : order
        );
        saveOrders(updatedOrders);
      } catch {
        if (!cancelled) {
          setStatusMessage('Unable to check payment status right now.');
        }
      } finally {
        if (!cancelled) {
          setIsCheckingStatus(false);
        }
      }
    };

    checkStatus();

    return () => {
      cancelled = true;
    };
  }, [latestOrder?.id, latestOrder?.referenceId]);

  return (
    <main className="flex-1 bg-white">
      <div className="min-h-[calc(100vh-18rem)] flex items-start justify-center px-6 pt-48 pb-24 md:px-10 lg:px-16">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <section className="border border-gray-200 rounded-2xl p-8 md:p-10 bg-white">
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-4">
                Order Confirmation
              </p>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black mb-4">
                Thank you for your order.
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-gray-600 leading-7">
                Your payment request has been created successfully. In MTN sandbox, payments are tracked by
                status updates instead of a real PIN prompt on the phone, so keep this page or your order ID
                nearby while the transaction is being checked.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <div className="border border-gray-200 rounded-xl p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-2">Order ID</p>
                <p className="text-sm font-medium text-black break-all">
                  {latestOrder?.id || 'Order not available'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-2">Payment Status</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-2.5 w-2.5 rounded-full ${statusTone}`} aria-hidden="true" />
                  <p className="text-sm font-medium text-black uppercase">
                    {statusLabel}
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-2">Payment Reference</p>
                <p className="text-sm font-medium text-black break-all">
                  {latestOrder?.referenceId || 'Reference will appear after payment confirmation.'}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-200 pt-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-semibold text-black">What happens next?</h2>
                {latestOrder?.referenceId && (
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-black transition-colors hover:bg-gray-100"
                  >
                    Refresh Status
                  </button>
                )}
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-2">Sandbox Payment Flow</p>
                <p className="text-sm text-gray-600 leading-7">
                  MTN sandbox does not send a live payment prompt to a real phone. Use the payment reference and
                  order status tools to follow the request state until it becomes successful or failed.
                </p>
              </div>
              {(statusMessage || isCheckingStatus) && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-2">Latest Update</p>
                  <p className="text-sm text-gray-600 leading-7">
                    {isCheckingStatus ? 'Checking payment status...' : statusMessage}
                  </p>
                </div>
              )}
              <ul className="space-y-3 text-sm text-gray-600 leading-7">
                <li>• Use your order ID to track progress from the order status page.</li>
                <li>• Use the payment reference below when checking the MTN transaction status.</li>
                <li>• Our team will confirm and prepare your order after payment verification.</li>
              </ul>
              {placedAt && (
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-2">Placed</p>
                  <p className="text-sm text-black">{placedAt}</p>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-44">
            <section className="border border-gray-200 rounded-2xl p-7 md:p-8 bg-white">
              <h2 className="text-xl font-semibold text-black mb-4">Order Summary</h2>
              {latestOrder ? (
                <>
                  <div className="space-y-4 mb-6">
                    {latestOrder.items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.size}`}
                        className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4"
                      >
<div>
                          <p className="text-sm font-medium text-black uppercase tracking-[0.08em]">
                            {item.product.code}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.size} · Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-black whitespace-nowrap">
                          {(item.product.price * item.quantity).toLocaleString()} RWF
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-[0.14em]">
                      <span>Customer</span>
                      <span className="text-right normal-case tracking-normal text-black">{latestOrder.customer.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium text-black">
                      <span className="uppercase tracking-[0.12em]">Total</span>
                      <span>{latestOrder.total.toLocaleString()} RWF</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-5">
                  <p className="text-sm text-gray-600 leading-7">
                    We could not find a saved order summary on this device. You can still continue shopping or
                    use the order status page if you already have an order ID.
                  </p>
                </div>
              )}
            </section>

            <section className="border border-gray-200 rounded-2xl p-7 md:p-8 bg-white">
              <h2 className="text-xl font-semibold text-black mb-4">Next Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-xl"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/order-status"
                  className="block w-full py-3 text-center border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-xl"
                >
                  Track Your Order
                </Link>
                <a
                  href="https://chat.whatsapp.com/Cb22N7qdbKBI1daglO2o8E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-xl"
                >
                  Join Our WhatsApp Community
                </a>
              </div>
            </section>

            <section className="border border-gray-200 rounded-2xl p-7 md:p-8 bg-white">
              <h2 className="text-xl font-semibold text-black mb-4">Need Help?</h2>
              <p className="text-sm text-gray-600 leading-7 mb-5">
                If you have any questions about your order, share your order ID and payment reference with our
                support team through WhatsApp for faster help.
              </p>
              <a
                href="https://chat.whatsapp.com/Cb22N7qdbKBI1daglO2o8E"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center px-6 py-3 border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-xl"
              >
                Contact Support
              </a>
            </section>
          </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
