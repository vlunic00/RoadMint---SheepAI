"use client";

import { useState } from "react";
import Header from "./header";
import LiveFeedPanel from "./liveFeedStatus";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [liveOpen, setLiveOpen] = useState(false);

  const toggleLive = () => setLiveOpen((p) => !p);
  const closeLive = () => setLiveOpen(false);

  return (
    <>
      <Header onLiveToggle={toggleLive} onLiveClose={closeLive} />

      <div
        className={`transition-transform duration-300 ease-in-out ${
          liveOpen ? "md:-translate-x-80" : "translate-x-0"
        }`}
      >
        {children}
      </div>

      <LiveFeedPanel open={liveOpen} onClose={closeLive} />
    </>
  );
}
