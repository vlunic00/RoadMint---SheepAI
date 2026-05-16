"use client";

import { useEffect } from "react";

export default function LiveFeedPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-14 h-[calc(100vh-56px)] bg-black shadow-2xl border-l border-orange-500/30
        z-40 transform transition-transform duration-300 ease-in-out

        w-full md:w-80 md:right-0

        ${open ? "translate-x-0" : "translate-x-full md:translate-x-full"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-orange-500/20 bg-black">

        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute h-full w-full rounded-full bg-orange-500 opacity-75"></span>
          <span className="relative h-2.5 w-2.5 rounded-full bg-orange-500"></span>
        </span>

        <span className="text-orange-500 font-semibold text-sm">
          LIVE UPDATES
        </span>

        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-orange-400 transition"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 text-sm text-gray-300 space-y-3">
        <div className="text-gray-500 text-xs">
          Real-time system activity
        </div>

        <div className="space-y-2">
          <div className="p-2 border border-white/10 rounded">
            🚧 Pothole detected
          </div>
          <div className="p-2 border border-white/10 rounded">
            🌧 Flooding update
          </div>
          <div className="p-2 border border-white/10 rounded">
            ⚠ Traffic anomaly detected
          </div>
        </div>
      </div>
    </div>
  );
}