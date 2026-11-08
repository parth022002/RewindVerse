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

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      { href: "/studio", label: "Studio Home", icon: Home },
      { href: "/studio/algorithms", label: "Algorithm Catalogue", icon: BookOpen },
    ],
  },
  {
    title: "Build & Replay",
    items: [
      { href: "/studio/forge", label: "Algorithm Forge", icon: Wrench },
      { href: "/studio/lab", label: "Optimizer Lab", icon: Cpu },
      { href: "/studio/replay/sample", label: "Replay Viewer", icon: RotateCcw },
    ],
  },
  {
    title: "Intelligence & Tools",
    items: [
      { href: "/studio/insights", label: "Diagnostics", icon: Sparkles },
      { href: "/studio/compare", label: "Run Compare", icon: GitCompare },
      { href: "/studio/embeddings", label: "Embeddings 3D", icon: Compass },
    ],
  },
  {
    title: "Learning & Import",
    items: [
      { href: "/studio/academy", label: "Academy", icon: GraduationCap },
      { href: "/studio/import", label: "Import Center", icon: UploadCloud },
    ],
  },
];

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--text)]">
      {/* Studio Sidebar */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#080b12]/95 backdrop-blur-2xl flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Brand Header */}
          <div className="h-16 border-b border-white/[0.08] px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/brand/favicon.png"
                alt="RewindVerse Symbol"
                width={28}
                height={28}
                className="object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-base text-white tracking-wide">
                Rewind<span className="text-cyan-400">Studio</span>
              </span>
            </Link>
          </div>

          {/* Grouped Navigation Links */}
          <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)] px-3 mb-1.5">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/studio"
                      ? pathname === "/studio"
                      : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-500/10"
                          : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-raised)]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-[var(--text-muted)]"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer / System Status */}
        <div className="p-4 border-t border-white/[0.08] bg-[#06080e]/60 space-y-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-mono text-slate-300">Local-First Sandbox</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Studio to Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="md:hidden h-14 border-b border-white/[0.08] bg-[#080b12] px-4 flex items-center justify-between sticky top-0 z-40">
          <Link href="/studio" className="flex items-center gap-2">
            <Image
              src="/brand/favicon.png"
              alt="RewindVerse Symbol"
              width={24}
              height={24}
            />
            <span className="font-bold text-sm text-white">RewindStudio</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/studio/forge"
              className="text-xs text-violet-400 font-semibold"
            >
              Forge
            </Link>
            <Link
              href="/"
              className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Website
            </Link>
          </div>
        </div>

        {/* Studio Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
