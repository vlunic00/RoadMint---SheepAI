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
      <body className="bg-black text-white overflow-x-hidden min-h-screen">
        <Header
          onLiveToggle={toggleLive}
          onLiveClose={closeLive}
        />

        <LiveOpenProvider value={{ liveOpen }}>
          <div className="relative flex w-full min-w-0 min-h-[calc(100vh-56px)] live-resize-boundary">
            <div
              className={`min-w-0 transition-[width] duration-300 ease-in-out ${
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
