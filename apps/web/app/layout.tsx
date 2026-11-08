import type { Metadata } from "next";
import "../styles/globals.css";
import { BackgroundField } from "../components/BackgroundField";
import { ScrollProgressBar } from "../components/ScrollProgressBar";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "RewindVerse — Every Model Has a Story",
  description:
    "Train a model, then replay how it learned. An interactive ML training replay, learning, and experiment intelligence platform.",
  icons: {
    icon: "/brand/favicon.png",
    shortcut: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
  openGraph: {
    title: "RewindVerse — Every Model Has a Story",
    description: "Train a model, then replay how it learned.",
    images: [{ url: "/brand/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--background)] text-[var(--text)] antialiased flex flex-col selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)] relative">
        <ScrollProgressBar />
        <BackgroundField />
        {children}
      </body>
    </html>
  );
}

