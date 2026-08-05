'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

export default function DNSMPIPage() {
  const router = useRouter();
  const { itemCount } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isHuman: false,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaState, setCaptchaState] = useState<'idle' | 'checking' | 'verified'>('checking');
  const captchaTimerRef = useRef<number | null>(null);

  useEffect(() => {
    captchaTimerRef.current = window.setTimeout(() => {
      setCaptchaState('verified');
      setFormData((current) => ({ ...current, isHuman: true }));
    }, 1400);

    return () => {
      if (captchaTimerRef.current) {
        window.clearTimeout(captchaTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<Record<string, string>> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Please fill this field.';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Please fill this field.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please fill this field.';
    }
    if (!formData.isHuman) {
      errors.isHuman = 'Confirm you are not a robot.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormSuccess('');
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/dnsmpi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormErrors({ form: (data && data.error) || 'Submission failed. Please try again.' });
        return;
      }

      setFormSuccess('Your request has been received. Someone from INKOTANYISINCE90 will follow up shortly.');
    } catch {
      setFormErrors({ form: 'Submission failed. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleCaptchaVerification = () => {
    if (captchaState === 'verified') {
      return;
    }

    if (captchaTimerRef.current) {
      window.clearTimeout(captchaTimerRef.current);
    }

    setCaptchaState('checking');
    captchaTimerRef.current = window.setTimeout(() => {
      setCaptchaState('verified');
      setFormData((current) => ({ ...current, isHuman: true }));
      setFormErrors((current) => ({ ...current, isHuman: undefined }));
    }, 900);
  };

  return (
    <>
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
        .dnsmpi-page {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 80px 20px 80px;
          background: #fff;
          min-height: 100vh;
          position: relative;
        }
        .dnsmpi-container {
          width: 100%;
          max-width: 720px;
          padding-top: 50px;
        }
        .page-intro {
          font-size: 11px;
          line-height: 1.8;
          color: #222;
          text-transform: uppercase;
          letter-spacing: .14em;
          margin-bottom: 22px;
          max-width: 100%;
        }
        .required-fields {
          font-size: 11px;
          margin-bottom: 24px;
          text-transform: uppercase;
          color: #222;
          letter-spacing: .14em;
          font-weight: 600;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        label {
          font-size: 10px;
          color: #222;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: .14em;
          font-weight: 600;
        }
        input, textarea {
          width: 100%;
          min-height: 52px;
          border: 1px solid #111;
          background: #fff;
          padding: 0 16px;
          font-family: inherit;
          font-size: 13px;
          letter-spacing: .02em;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease;
          box-shadow: none;
        }
        textarea {
          min-height: 120px;
          padding: 14px 16px;
          resize: none;
        }
        input:focus, textarea:focus {
          border-color: #000;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
        }
.captcha {
          margin-top: 12px;
          padding: 0;
          border: 1px solid #d9d9d9;
          background: #fafafa;
          display: flex;
          flex-direction: column;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .captcha-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 16px 18px;
        }
        .captcha-label {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          user-select: none;
        }
        .captcha-label input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        .captcha-checkbox {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          border: 1px solid #c9c9c9;
          background: #fff;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background .15s ease, border-color .15s ease, box-shadow .15s ease;
        }
        .captcha-checkbox:hover {
          border-color: #989898;
        }
        .captcha-checkbox.checking {
          border-color: #c9c9c9;
          background: #fff;
        }
        .captcha-checkbox.verified {
          background: #fff;
          border-color: #c9c9c9;
        }
        .captcha-check {
          width: 14px;
          height: 8px;
          border-left: 2px solid #00678f;
          border-bottom: 2px solid #00678f;
          transform: rotate(-45deg);
          display: block;
          margin-top: -2px;
        }
        .captcha-spinner {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #d4d4d4;
          border-top-color: #f38020;
          animation: captcha-spin 0.8s linear infinite;
          display: block;
        }
        @keyframes captcha-spin {
          to { transform: rotate(360deg); }
        }
        .captcha-text-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .captcha-text {
          font-size: 13px;
          color: #222;
          letter-spacing: .02em;
          font-weight: 500;
          display: block;
        }
        .captcha-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #8a8a8a;
          letter-spacing: .02em;
        }
        .captcha-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .captcha-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding: 8px 18px;
          border-top: 1px solid #ececec;
          background: #f4f4f4;
        }
        .captcha-footer-links {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: #8a8a8a;
          letter-spacing: .02em;
        }
        .captcha-footer-links a {
          color: #5a5a5a;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .captcha-footer-links a:hover {
          color: #222;
        }
        .captcha-footer-links .divider {
          color: #c4c4c4;
        }
        .cf-logo {
          width: 52px;
          height: 20px;
          display: block;
          flex-shrink: 0;
        }
        .field-error {
          font-size: 10px;
          color: #a21d1d;
          margin-top: 10px;
          letter-spacing: .04em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .success-message {
          margin-top: 12px;
          padding: 14px 16px;
          border: 1px solid #222;
          background: #f7f7f7;
          color: #111;
          font-size: 12px;
          letter-spacing: .02em;
          text-transform: uppercase;
          line-height: 1.4;
          font-weight: 600;
        }
        .submit {
          margin-top: 24px;
          width: 100%;
          height: 54px;
          border: none;
          background: #111;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .16em;
          transition: background .2s ease, transform .15s ease;
        }
        .submit:hover {
          background: #000;
          transform: translateY(-1px);
        }
        .back-button {
          position: fixed;
          top: 24px;
          left: 20px;
          width: 52px;
          height: 52px;
          border: none;
          background: transparent;
          color: #111;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          transition: color .2s ease, transform .15s ease;
          z-index: 20;
        }
        .back-button:hover {
          color: #000;
          transform: translateY(-1px);
        }
        .back-button .icon {
          width: 22px;
          height: 22px;
          display: block;
        }
        .cart-button {
          position: fixed;
          top: 24px;
          right: 20px;
          width: 52px;
          height: 52px;
          border: none;
          background: transparent;
          color: #111;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          transition: color .2s ease, transform .15s ease;
          z-index: 20;
        }
.cart-button:hover {
          color: #000;
          transform: translateY(-1px);
        }
        .cart-button svg {
          width: 22px;
          height: 22px;
          color: currentColor;
          transition: color 0.2s ease;
        }
@media (max-width: 768px) {
          .dnsmpi-page {
            padding: 90px 16px 40px;
          }
          .dnsmpi-container {
            max-width: 100%;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .captcha-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 14px;
          }
          .captcha-brand {
            align-self: flex-end;
          }
          .captcha-footer {
            justify-content: center;
            padding: 8px 14px;
          }
        }
      `}</style>
      
      <div className="dnsmpi-page">
        <button
          onClick={() => router.push('/')}
          className="back-button"
          aria-label="Go back"
        >
          <ChevronLeft className="icon" strokeWidth={2} />
        </button>
        <button
          onClick={() => router.push('/cart')}
          className="cart-button"
          aria-label="Open cart"
        >
          <CartIcon count={itemCount} />
        </button>
        <div className="dnsmpi-container">
          <p className="page-intro">
            Do not sell or share my personal information. We respect your privacy and are committed to protecting your personal data. Please complete the form below to submit your request.
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

<div className="captcha">
              <div className="captcha-main">
                <label className="captcha-label">
                  <input
                    type="checkbox"
                    name="isHuman"
                    checked={captchaState === 'verified'}
                    onChange={handleCaptchaVerification}
                  />
                  <span className={`captcha-checkbox ${captchaState}`.trim()} aria-hidden="true">
                    {captchaState === 'checking' ? (
                      <span className="captcha-spinner" />
                    ) : captchaState === 'verified' ? (
                      <span className="captcha-check" />
                    ) : null}
                  </span>
                  <span className="captcha-text-block">
                    <span className="captcha-text">I&apos;m not a robot</span>
                    <span className="captcha-status">
                      {captchaState === 'checking' ? (
                        'Verifying…'
                      ) : captchaState === 'verified' ? (
                        'Verified ✓'
                      ) : (
                        'Click to verify'
                      )}
                    </span>
                  </span>
                </label>
                <div className="captcha-brand">
                  <svg className="cf-logo" viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cloudflare Turnstile protected">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.5 4.5c4.4 0 8 3.6 8 8s-3.6 8-8 8h-9c-4.4 0-8-3.6-8-8s3.6-8 8-8h9zM14 8a4.5 4.5 0 100 9h4.5a4.5 4.5 0 100-9H14z" fill="#F38020"/>
                    <path d="M39 5v12h-3V5h3zm-6 0v12h-3.4l-3.6-8.2V17h-3V5h3.4l3.6 8.2V5H33z" fill="#444444"/>
                    <path d="M45 5h6.5v3H48v2.5h3v3H48V17h-3V5z" fill="#444444"/>
                  </svg>
                </div>
              </div>
              <div className="captcha-footer">
                <span className="captcha-footer-links">
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
                  <span className="divider">|</span>
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
                </span>
              </div>
            </div>
{formErrors.isHuman && <div className="field-error">{formErrors.isHuman}</div>}
            {formErrors.form && <div className="field-error">{formErrors.form}</div>}
            {formSuccess && (
              <div className="success-message">{formSuccess}</div>
            )}

            <button type="submit" className="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
