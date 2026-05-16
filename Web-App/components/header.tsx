"use client";

import { useState } from "react";

export default function Header({
  onLiveToggle,
  onLiveClose,
}: {
  onLiveToggle: () => void;
  onLiveClose: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLiveClick = () => {
    onLiveToggle();
    setMenuOpen(false);
  };

  const handleBurgerClick = () => {
    setMenuOpen((prev) => {
      const next = !prev;

      // close live feed when opening burger
      if (next) onLiveClose();

      return next;
    });
  };

  return (
    <header className="w-full bg-black border-b border-white/10 shadow-md relative z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="text-xl font-bold">
          <span className="text-white">Road</span>
          <span className="text-orange-500">Mint</span>
        </div>

        {/* CENTER NAV (desktop) */}
        <nav className="hidden md:flex gap-8 text-sm">
          <a className="text-gray-400 hover:text-orange-400">HOW IT WORKS</a>
          <a className="text-gray-400 hover:text-orange-400">FEATURES</a>
          <a className="text-gray-400 hover:text-orange-400">LIVE MAP</a>
          <a className="text-gray-400 hover:text-orange-400">REPORT ISSUE</a>
        </nav>

        {/* RIGHT (desktop buttons) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onLiveToggle}
            className="px-4 py-2 text-sm border border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-black transition"
          >
            Live Feed
          </button>

          <button className="px-4 py-2 text-sm bg-orange-500 text-black rounded-lg">
            Sign In
          </button>
        </div>

        {/* MOBILE */}
        <button
          className="md:hidden text-2xl text-orange-400"
          onClick={handleBurgerClick}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-5 bg-black border-t border-white/10">

          <nav className="flex flex-col items-center gap-4 text-sm py-4">
            <a className="text-gray-400 hover:text-orange-400">HOW IT WORKS</a>
            <a className="text-gray-400 hover:text-orange-400">FEATURES</a>
            <a className="text-gray-400 hover:text-orange-400">LIVE MAP</a>
            <a className="text-gray-400 hover:text-orange-400">REPORT ISSUE</a>
          </nav>

          <div className="flex flex-col items-center gap-3">

            <button
              onClick={handleLiveClick}
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
  );
}