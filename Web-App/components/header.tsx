"use client";

import { useState } from "react";
import Link from "next/link";

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

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-white">Road</span>
          <span className="text-orange-500">Mint</span>
        </Link>

        {/* CENTER NAV (desktop) */}
        <nav className="hidden md:flex gap-8 text-sm">
          <Link href="/#how-it-works" className="text-gray-400 hover:text-orange-400">KAKO FUNKCIONIRA</Link>
          <Link href="/#features" className="text-gray-400 hover:text-orange-400">ZNAČAJKE</Link>
          <Link href="/map" className="text-gray-400 hover:text-orange-400">MAPA UŽIVO</Link>
          <Link href="/report" className="text-gray-400 hover:text-orange-400">PRIJAVI PROBLEM</Link>
        </nav>

        {/* RIGHT (desktop buttons) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onLiveToggle}
            className="px-4 py-2 text-sm border border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-black transition"
          >
            Uživo
          </button>

          <Link
            href="/login"
            className="px-4 py-2 text-sm bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition"
          >
            Prijava
          </Link>
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
            <Link href="/#how-it-works" className="text-gray-400 hover:text-orange-400">KAKO FUNKCIONIRA</Link>
            <Link href="/#features" className="text-gray-400 hover:text-orange-400">ZNAČAJKE</Link>
            <Link href="/map" className="text-gray-400 hover:text-orange-400">MAPA UŽIVO</Link>
            <Link href="/report" className="text-gray-400 hover:text-orange-400">PRIJAVI PROBLEM</Link>
          </nav>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleLiveClick}
              className="w-full max-w-xs px-3 py-1.5 text-sm border border-orange-500 text-orange-400 rounded-lg"
            >
              Uživo
            </button>

            <Link
              href="/login"
              className="w-full max-w-xs px-3 py-1.5 text-sm bg-orange-500 text-black rounded-lg text-center"
            >
              Prijava
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
