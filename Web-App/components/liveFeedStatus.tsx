"use client";

import { useEffect, useState } from "react";

type UpdateItem = {
  id: string;
  status: "fixed" | "in progress";
  location: string;
  city: string;
  timestamp: string;
};

export default function LiveFeedPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<UpdateItem[]>([]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // load JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/liveUpdates.json");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load live updates:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={`
        absolute right-0 top-0 h-full w-[320px] border-l border-orange-500/30 bg-black shadow-2xl
        z-40 transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
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
      <div className="p-4 text-sm text-gray-300 space-y-3 overflow-y-auto">

        <div className="text-gray-500 text-xs">
          Real-time infrastructure status
        </div>

        {data.map((item) => (
          <div
            key={item.id}
            className="p-3 border border-white/10 rounded space-y-1"
          >
            {/* STATUS */}
            <div className="flex items-center justify-between">
              <span
                className={
                  item.status === "fixed"
                    ? "text-green-400 font-semibold"
                    : "text-orange-400 font-semibold"
                }
              >
                {item.status.toUpperCase()}
              </span>

              <span className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>

            {/* LOCATION */}
            <div className="text-gray-300">
              {item.location}
            </div>

            {/* CITY */}
            <div className="text-xs text-gray-500">
              {item.city}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}