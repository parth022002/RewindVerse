"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Cpu,
  RotateCcw,
  Sparkles,
  GitCompare,
  GraduationCap,
  UploadCloud,
  Home,
  ArrowLeft,
  ShieldCheck,
  Compass,
  Wrench,
  BookOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/studio", label: "Studio Home", icon: Home },
  { href: "/studio/algorithms", label: "Algorithm Catalog", icon: BookOpen },
  { href: "/studio/forge", label: "Algorithm Forge", icon: Wrench },
  { href: "/studio/lab", label: "Optimizer Lab", icon: Cpu },
  { href: "/studio/replay/sample", label: "Replay Viewer", icon: RotateCcw },
  { href: "/studio/import", label: "Import Center", icon: UploadCloud },
  { href: "/studio/insights", label: "Diagnostics", icon: Sparkles },
  { href: "/studio/compare", label: "Run Compare", icon: GitCompare },
  { href: "/studio/academy", label: "Academy", icon: GraduationCap },
  { href: "/studio/embeddings", label: "Embeddings 3D", icon: Compass },
];

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--text)]">
      {/* Studio Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Brand Header */}
          <div className="h-16 border-b border-[var(--border)] px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/brand/favicon.png"
                alt="RewindVerse Symbol"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="font-bold text-base text-white tracking-wide">
                Rewind<span className="text-cyan-400">Studio</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
              Workspace
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/studio"
                  ? pathname === "/studio"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/15 to-blue-600/15 text-cyan-400 border border-cyan-500/30 font-semibold"
                      : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-raised)]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer / System Status */}
        <div className="p-4 border-t border-[var(--border)] space-y-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Local-First Workspace</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Exit Studio to Website
          </Link>
        </div>
      </aside>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="md:hidden h-14 border-b border-[var(--border)] bg-[var(--surface)] px-4 flex items-center justify-between">
          <Link href="/studio" className="flex items-center gap-2">
            <Image
              src="/brand/favicon.png"
              alt="RewindVerse Symbol"
              width={24}
              height={24}
            />
            <span className="font-bold text-sm text-white">RewindStudio</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Exit
          </Link>
        </div>

        {/* Studio Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

