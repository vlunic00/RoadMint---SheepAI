"use client";

import { useState, useEffect } from "react";
import LiveFeedPanel from "../components/liveFeedStatus";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);

  // if mobile menu opens → close live feed
  useEffect(() => {
    if (menuOpen) setLiveOpen(false);
  }, [menuOpen]);

  // if live feed opens → close mobile menu
  useEffect(() => {
    if (liveOpen) setMenuOpen(false);
  }, [liveOpen]);

  return (
    <>
      <header className="w-full bg-black border-b border-white-500/30 shadow-md relative z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <div className="text-xl font-bold">
            <span className="text-white">Road</span>
            <span className="text-orange-500">Mint</span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8 text-sm">
            <a className="text-gray-400 hover:text-orange-400 transition">HOW IT WORKS</a>
            <a className="text-gray-400 hover:text-orange-400 transition">FEATURES</a>
            <a className="text-gray-400 hover:text-orange-400 transition">LIVE MAP</a>
            <a className="text-gray-400 hover:text-orange-400 transition">REPORT ISSUE</a>
          </nav>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLiveOpen((p) => !p)}
              className="px-4 py-2 text-sm border border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-black transition"
            >
              Live Feed
            </button>

            <button className="px-4 py-2 text-sm bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition">
              Sign In
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-2xl text-orange-400"
            onClick={() => setMenuOpen((p) => !p)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-5 bg-black border-t border-orange-500/20">

            <nav className="flex flex-col items-center gap-4 text-sm py-4">
              <a className="text-gray-400 hover:text-orange-400 transition">HOW IT WORKS</a>
              <a className="text-gray-400 hover:text-orange-400 transition">FEATURES</a>
              <a className="text-gray-400 hover:text-orange-400 transition">LIVE MAP</a>
              <a className="text-gray-400 hover:text-orange-400 transition">REPORT ISSUE</a>
            </nav>

            <div className="flex flex-col items-center gap-3">

              <button
                onClick={() => setLiveOpen((p) => !p)}
                className="w-full max-w-xs px-3 py-1.5 text-sm border border-orange-500 text-orange-400 rounded-lg"
              >
                Live Feed
              </button>

              <button className="w-full max-w-xs px-3 py-1.5 text-sm bg-orange-500 text-black rounded-lg">
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* LIVE FEED PANEL */}
      <LiveFeedPanel
        open={liveOpen}
        onClose={() => setLiveOpen(false)}
      />
    </>
  );
}