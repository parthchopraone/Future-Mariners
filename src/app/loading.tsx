const Loading = () => (
  <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f3f6f8]" aria-busy="true" aria-label="Loading">
    <div className="flex flex-col items-center gap-4 text-[#102c63]">
      <div className="size-10 animate-spin rounded-full border-4 border-[#d8e0e8] border-t-[#7D52F4]" />
      <p className="text-sm font-bold tracking-[0.14em] text-[#bd8014] uppercase">Loading</p>
    </div>
  </main>
);

export default Loading;