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
        className={`px-5 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
          completed ? "border border-[#e4aa3b] text-[#e4aa3b]" : "bg-[#e4aa3b] text-[#0b1427]"
        }`}
      >
        {busy ? "Saving..." : completed ? "✓ Completed (undo)" : "Mark as complete"}
      </button>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
};

export default MarkComplete;