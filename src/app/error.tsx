"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      className="flex-1 min-h-[60vh] flex items-center justify-center bg-white"
      style={{ fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif' }}
    >
      <div className="max-w-md mx-auto px-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
          Something went wrong
        </p>
        <h1 className="text-2xl font-semibold text-black mb-4">
          We couldn&apos;t load this page.
        </h1>
        <p className="text-sm text-gray-600 leading-7 mb-8">
          Please try again. If the problem persists, contact us at
          contact@inkotanyisince90.com.
        </p>
        <button
          onClick={reset}
          className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
