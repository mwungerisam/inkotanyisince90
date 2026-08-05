import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex-1 min-h-[70vh] flex items-center justify-center bg-white"
      style={{ fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif' }}
    >
      <div className="max-w-md mx-auto px-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
          404
        </p>
        <h1 className="text-3xl font-semibold text-black mb-4">
          Page not found
        </h1>
        <p className="text-sm text-gray-600 leading-7 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link
          href="/"
          className="inline-block w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
