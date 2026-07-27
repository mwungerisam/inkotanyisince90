'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function OrderStatusPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order status lookup
    console.log('Looking up order:', orderId);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
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
        .order-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.62);
          backdrop-filter: blur(.5px);
          -webkit-backdrop-filter: blur(.5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .order-modal {
          width: 580px;
          max-width: 92vw;
          height: 460px;
          background: #ffffff;
          border: 1px solid #e0e0e0;
          box-shadow:
            0 18px 45px rgba(0,0,0,.18),
            0 3px 10px rgba(0,0,0,.08);
          overflow: hidden;
          position: relative;
          font-family: "IBM Plex Mono", monospace;
          color: #222;
        }
        .order-title {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .015em;
          color: #111111;
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
        }
        .close-btn {
          width: 48px;
          height: 40px;
          border: 1px solid #222;
          background: #fff;
          border-radius: 0;
          box-shadow: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: .2s;
        }
        .close-btn:hover {
          background: #111;
          color: white;
        }
        .order-content {
          padding: 0 20px 20px 20px;
        }
        .order-description {
          font-size: 10px;
          color: #666666;
          line-height: 1.5;
          font-weight: 400;
          letter-spacing: .015em;
          margin-bottom: 20px;
        }
        .order-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .order-form label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          color: #8b8b8b;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .order-form input {
          width: 100%;
          height: 50px;
          padding: 0 16px;
          font-family: inherit;
          font-size: 14px;
          border: 1px solid #222;
          background: #fff;
          outline: none;
          transition: .2s;
        }
        .order-form input:focus {
          border-color: #000;
          box-shadow: 0 0 0 1px #000;
        }
        .order-button {
          width: 100%;
          height: 48px;
          margin-top: 8px;
          background: #000;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .04em;
          transition: .25s;
        }
        .order-button:hover {
          background: #222;
        }
        .back-link {
          display: block;
          margin-top: 20px;
          text-align: center;
          text-decoration: none;
          color: #111;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .04em;
          transition: .2s;
        }
        .back-link:hover {
          opacity: .65;
        }
        ::placeholder {
          color: #b5b5b5;
          text-transform: uppercase;
        }
      `}</style>
      <div className="order-overlay">
        <div className="order-modal">
          <div className="order-header">
            <h1 className="order-title">Order Status</h1>
            <button
              onClick={() => router.push('/')}
              className="text-black hover:text-gray-600 transition-colors px-2"
              aria-label="Close"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>
          
          <div className="order-content">
            <p className="order-description">
              Enter your order ID to track your order status and view shipping information.
            </p>
            
            <form className="order-form" onSubmit={handleSubmit}>
              <label htmlFor="orderId">Order ID</label>
              <input
                type="text"
                id="orderId"
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              
              <button type="submit" className="order-button">
                Track Order
              </button>
            </form>
            
            <a href="/" className="back-link">
              Go back to Inkotanyi
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
