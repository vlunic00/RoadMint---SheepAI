import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";
import LiveFeedStatus from "../components/liveFeedStatus";

export const metadata: Metadata = {
  title: "RoadMint",
  description: "RoadMint web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />
        {children}
        <div className="hidden md:flex items-center gap-3">
        <LiveFeedStatus />
      </div>
      </body>
    </html>
  );
}