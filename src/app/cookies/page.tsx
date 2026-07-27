'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Cookies() {
  const router = useRouter();

  const [necessaryOpen, setNecessaryOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .cookie-overlay {
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
        .cookie-modal {
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
        .cookie-title {
          font-family: "IBM Plex Mono", monospace;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: .015em;
          text-transform: uppercase;
          color: #111111;
        }
        .cookie-heading {
          font-size: 15px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .cookie-body {
          padding: 22px;
        }
        .section-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .015em;
          margin-bottom: 8px;
          color: #111111;
        }
        .cookie-description {
          color: #666666;
          font-size: 10px;
          line-height: 1.5;
          font-weight: 400;
          letter-spacing: .015em;
        }
        .btn-black {
          flex: 0.65;
          height: 32px;
          background: #111111;
          color: white;
          border: none;
          font-family: "IBM Plex Mono", monospace;
          font-size: 9px;
          letter-spacing: .015em;
          font-weight: 700;
          text-transform: uppercase;
          transition: .2s;
        }
        .btn-black:hover {
          background: #222;
        }
        .btn-light {
          flex: 1.15;
          height: 32px;
          background: #ffffff;
          color: #111111;
          border: 1px solid #111111;
          font-family: "IBM Plex Mono", monospace;
          font-size: 9px;
          letter-spacing: .015em;
          font-weight: 700;
          text-transform: uppercase;
          transition: .2s;
        }
        .btn-light:hover {
          background: #111;
          color: white;
        }
        .preference-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 46px;
          padding: 0 16px;
          margin-top: 6px;
          border: 1px solid #e0e0e0;
          border-radius: 3px;
          background: #ffffff;
        }
        .preference-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .015em;
          color: #111111;
        }
        .chevron {
          width: 22px;
          height: 22px;
          background: #f0f2f4;
          border-radius: 50%;
          color: #666666;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .switch {
          width: 50px;
          height: 26px;
          border-radius: 30px;
          background: #dce4ea;
          position: relative;
          transition: .25s;
        }
        .switch.active {
          background: #2e333a;
        }
        .switch::before {
          content: "";
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: .25s;
          box-shadow: 0 1px 3px rgba(0,0,0,.18);
        }
        .switch.active::before {
          left: 26px;
        }
        .info-box {
          margin-top: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 3px;
          background: #ffffff;
          padding: 10px 16px;
        }
        .cookie-actions {
          display: flex;
          gap: 6px;
          padding: 10px 20px;
          border-top: 1px solid #e0e0e0;
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
        .cookie-content::-webkit-scrollbar {
          width: 5px;
        }
        .cookie-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .cookie-content::-webkit-scrollbar-thumb {
          background: #9f9f9f;
          border-radius: 20px;
        }
        .cookie-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
        }
      `}</style>
      <div className="cookie-overlay">

      {/* Overlay - allows products to show through */}
      <div
        className="absolute inset-0"
        onClick={() => router.back()}
      />

      {/* Professional Centered Modal */}
      <div className="cookie-modal relative overflow-hidden">

        {/* Header */}
        <div className="cookie-header">
          <h1 className="cookie-title">
            Manage Cookie Preferences
          </h1>
          <button
            onClick={() => router.back()}
            aria-label="Close"
            className="close-btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="cookie-content h-full overflow-y-auto px-8 pt-2 pb-2">

          {/* Privacy Choices */}
          <section className="pt-6">

            <h2 className="section-title">
              Your Privacy Choices
            </h2>

            <p className="cookie-description mb-6">
              In this panel you can express some preferences related to the processing of your personal information. You may review and change the expressed choices at any time by resurfacing this panel through the privacy settings link available on the website.
            </p>

            {/* Strictly Necessary */}
            <div className="preference-row">

              <div className="flex items-center gap-3">
                <div className="chevron">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <span className="preference-title">
                  Strictly Necessary
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="switch active">
                  <input
                    type="checkbox"
                    id="necessary"
                    checked={true}
                    disabled
                    className="sr-only"
                  />
                </div>
              </div>

            </div>

            {/* Targeted Analytics */}
            <div className="preference-row">

              <div className="flex items-center gap-3">
                <div className="chevron">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <span className="preference-title">
                  Targeted Analytics
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="analytics" className={`switch ${analyticsEnabled ? 'active' : ''} cursor-pointer`} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only"
                  />
                </label>
              </div>

            </div>

            {/* More Information */}
            <div className="info-box">

              <h3 className="section-title mb-2">
                More Information
              </h3>

              <p className="cookie-description mb-2">
                For more information about our privacy practices, please visit our Privacy Policy.
              </p>

              <p className="cookie-description">
                Contact us at:{' '}
                <a href="mailto:contact@inkotanyisince90.rw" className="text-gray-900 underline hover:text-gray-700">
                  contact@inkotanyisince90.rw
                </a>
              </p>

            </div>

            {/* Action Buttons */}
            <div className="cookie-actions">

              <button
                onClick={() => router.back()}
                className="btn-black flex-1"
              >
                Accept All
              </button>

              <button
                onClick={() => router.back()}
                className="btn-black flex-1"
              >
                Reject All
              </button>

              <button
                onClick={() => router.back()}
                className="btn-light"
              >
                Accept Current
              </button>

            </div>

          </section>

        </div>

      </div>

    </div>
    </>
  );
}
