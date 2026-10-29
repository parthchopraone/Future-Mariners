"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MarkComplete = ({ slug, videoId, completed }: { slug: string; videoId: string; completed: boolean }) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, videoId, completed: !completed }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Could not save your progress. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e4aa3b] disabled:cursor-not-allowed disabled:opacity-60 ${
          completed ? "border border-[#e4aa3b]/60 bg-[#e4aa3b]/10 text-[#f4c766] hover:bg-[#e4aa3b]/20" : "bg-[#e4aa3b] text-[#0b1427] hover:bg-[#f4c766]"
        }`}
      >
        {busy ? "Saving..." : completed ? "✓ Completed (undo)" : "Mark as complete"}
      </button>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
};

export default MarkComplete;