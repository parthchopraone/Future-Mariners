const LearnLoading = () => (
  <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#0b1427] text-white" aria-busy="true" aria-label="Loading lesson">
    <div className="flex flex-col items-center gap-4">
      <div className="size-10 animate-spin rounded-full border-4 border-white/20 border-t-[#7D52F4]" />
      <p className="text-sm font-bold tracking-[0.14em] text-[#e4aa3b] uppercase">Loading lesson</p>
    </div>
  </main>
);

export default LearnLoading;
