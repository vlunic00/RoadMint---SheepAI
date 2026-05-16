"use client";

import { useState } from "react";
import Header from "../components/header";
import LiveFeedPanel from "../components/liveFeedStatus";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [liveOpen, setLiveOpen] = useState(false);

  const toggleLive = () => setLiveOpen((p) => !p);
  const closeLive = () => setLiveOpen(false);

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <Header onLiveToggle={toggleLive} onLiveClose={closeLive} />

        <div
          className={`
            transition-transform duration-300 ease-in-out
            ${liveOpen ? "md:-translate-x-80" : "translate-x-0"}
          `}
        >
          {children}
        </div>

        <LiveFeedPanel open={liveOpen} onClose={closeLive} />
      </body>
    </html>
  );
}
