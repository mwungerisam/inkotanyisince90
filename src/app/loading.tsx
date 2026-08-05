export default function Loading() {
  return (
    <div
      className="flex-1 min-h-[60vh] flex items-center justify-center bg-white"
      style={{ fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
          Loading
        </p>
      </div>
    </div>
  );
}
