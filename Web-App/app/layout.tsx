import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";
import LiveFeedPanel from "../components/liveFeedStatus";
import Footer from "../components/footer";



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
        <LiveFeedPanel />
      </div>
      <Footer />
      </body>
    </html>
  );
}
