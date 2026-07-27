'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';
import { useState } from 'react';

export default function DNSMPIPage() {
  const router = useRouter();
  const { itemCount } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        html {
          font-size: 16px;
        }
        body {
          background: #fff;
          color: #222;
          font-family: "IBM Plex Mono", monospace;
          min-height: 100vh;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
        }
        .privacy-page {
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 100px;
          padding-bottom: 60px;
        }
        .privacy-container {
          width: 100%;
          max-width: 600px;
        }
        .privacy-description {
          font-size: 12px;
          line-height: 1.8;
          color: #383838;
          text-transform: uppercase;
          letter-spacing: .02em;
          margin-bottom: 30px;
        }
        .required-fields {
          font-size: 12px;
          margin-bottom: 20px;
          text-transform: uppercase;
          color: #222;
          letter-spacing: .02em;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        label {
          font-size: 12px;
          color: #333;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: .02em;
        }
        input, textarea {
          width: 100%;
          height: 50px;
          border: 1px solid #222;
          background: #fff;
          padding: 0 14px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: .15s;
        }
        textarea {
          height: 100px;
          padding: 14px;
          resize: none;
        }
        input:focus, textarea:focus {
          border-color: #000;
          box-shadow: 0 0 0 1px #000;
        }
        .captcha {
          margin-top: 2px;
          height: 60px;
          border: 1px solid #dddddd;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }
        .captcha-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .captcha-checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid #555;
          background: white;
        }
        .captcha-text {
          font-size: 13px;
          color: #222;
        }
        .captcha-logo {
          text-align: right;
          font-size: 9px;
          line-height: 1.4;
          color: #888;
          text-transform: none;
        }
        .submit {
          margin-top: 20px;
          width: 100%;
          height: 48px;
          border: none;
          background: #000;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .03em;
          transition: .2s;
        }
        .submit:hover {
          background: #1d1d1d;
        }
        @media (max-width: 768px) {
          .privacy-page {
            padding: 90px 20px 50px;
          }
          .privacy-container {
            max-width: 100%;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      {/* Top navigation with back and cart buttons */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between h-24">
            <button
              onClick={() => router.push('/')}
              className="text-black hover:text-gray-600 transition-colors px-2"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="cart"
              aria-label="Open cart"
            >
              <CartIcon count={itemCount} />
            </button>
          </div>
        </div>
      </div>

      <div className="privacy-page">
        <div className="privacy-container">
          <p className="privacy-description">
            Do Not Sell or Share My Personal Information. We respect your privacy and are committed to protecting your personal data. Please complete the form below to submit your request.
          </p>

          <p className="required-fields">
            * Required fields
          </p>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="captcha">
              <div className="captcha-left">
                <div className="captcha-checkbox"></div>
                <span className="captcha-text">I'm not a robot</span>
              </div>
              <div className="captcha-logo">
                reCAPTCHA<br/>Privacy - Terms
              </div>
            </div>

            <button type="submit" className="submit">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
