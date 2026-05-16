"use client";

import { useState } from "react";
import Header from "../components/header";
import LiveFeedPanel from "../components/liveFeedStatus";
import { LiveOpenProvider } from "../contexts/LiveOpenContext";
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
        <Header
          onLiveToggle={toggleLive}
          onLiveClose={closeLive}
        />

        <LiveOpenProvider value={{ liveOpen }}>
          <div className="relative w-full">
            <div
              className={`transition-all duration-300 ease-in-out ${
                liveOpen
                  ? "md:w-[calc(100%-320px)] w-full"
                  : "w-full"
              }`}
            >
              {children}
            </div>

            <LiveFeedPanel
              open={liveOpen}
              onClose={closeLive}
            />
          </div>
        </LiveOpenProvider>
      </body>
    </html>
  );
}
