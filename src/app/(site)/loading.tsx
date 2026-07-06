export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-4 text-sm uppercase tracking-widest text-muted">Loading...</p>
      </div>
    </div>
  );
}
