"use client";

import React, { useState } from "react";
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
  Settings,
  Database,
  Layers,
  GitBranch,
  Trophy,
  Eye,
  Zap,
  FileCheck,
  FileText,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  id: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    id: "workspace",
    items: [
      { href: "/studio", label: "Overview", icon: Home },
      { href: "/studio/projects", label: "Projects", icon: FolderKanban, badge: "New" },
    ],
  },
  {
    title: "Build",
    id: "build",
    items: [
      { href: "/studio/data", label: "Data Lab", icon: Database },
      { href: "/studio/algorithms", label: "Algo Explorer", icon: BookOpen },
      { href: "/studio/forge", label: "Algorithm Forge", icon: Wrench },
      { href: "/studio/fit-lab", label: "Fit Lab", icon: Layers },
      { href: "/studio/experiments", label: "Experiment Lab", icon: GitBranch },
    ],
  },
  {
    title: "Analyze",
    id: "analyze",
    items: [
      { href: "/studio/replay/sample", label: "Replay Viewer", icon: RotateCcw },
      { href: "/studio/lab", label: "Optimizer Lab", icon: Cpu },
      { href: "/studio/insights", label: "Diagnostic Insights", icon: Sparkles },
      { href: "/studio/compare", label: "Run Compare", icon: GitCompare },
      { href: "/studio/embeddings", label: "Embeddings 3D", icon: Compass },
    ],
  },
  {
    title: "Research & Learn",
    id: "research",
    items: [
      { href: "/studio/benchmarks", label: "RewindBench", icon: Trophy },
      { href: "/studio/notebook", label: "Research Notebook", icon: FileText },
      { href: "/studio/trust", label: "Model Trust Lab", icon: ShieldCheck },
      { href: "/studio/explainability", label: "Explainability", icon: Eye },
      { href: "/studio/reproduce", label: "Reproduction", icon: FileCheck },
      { href: "/studio/profiler", label: "Profiler", icon: Zap },
      { href: "/studio/academy", label: "Academy", icon: GraduationCap },
    ],
  },
  {
    title: "Settings",
    id: "settings",
    items: [
      { href: "/studio/settings", label: "Settings & Storage", icon: Settings },
    ],
  },
];

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Find active label for breadcrumb
  let activeLabel = "Workspace";
  let activeSection = "Workspace";
  for (const s of SECTIONS) {
    for (const item of s.items) {
      if (item.href === "/studio" ? pathname === "/studio" : pathname?.startsWith(item.href)) {
        activeLabel = item.label;
        activeSection = s.title;
        break;
      }
    }
  }

  const renderNavItems = () => (
    <div className="space-y-4">
      {SECTIONS.map((sec) => {
        const isCollapsed = !!collapsedSections[sec.id];
        return (
          <div key={sec.id} className="space-y-1">
            <button
              onClick={() => toggleSection(sec.id)}
              className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)] px-3 py-1 hover:text-white transition-colors"
            >
              <span>{sec.title}</span>
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
              ) : (
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              )}
            </button>

            {!isCollapsed && (
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/studio"
                      ? pathname === "/studio"
                      : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-500/10"
                          : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-raised)]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-cyan-400" : "text-[var(--text-muted)]"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--text)]">
      {/* Desktop Studio Sidebar */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#080b12]/95 backdrop-blur-2xl flex flex-col justify-between shrink-0 hidden lg:flex">
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
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            {renderNavItems()}
          </div>
        </div>

        {/* Footer / System Status */}
        <div className="p-4 border-t border-white/[0.08] bg-[#06080e]/60 space-y-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-mono text-slate-300">Deterministic Engine</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Studio Top Breadcrumb Bar */}
        <header className="h-14 border-b border-white/[0.08] bg-[#080b12]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/[0.05]"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-[var(--text-muted)] hidden sm:inline">{activeSection}</span>
            <span className="text-[var(--text-dim)] hidden sm:inline">/</span>
            <span className="font-bold text-white">{activeLabel}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio/projects"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] bg-[var(--surface)] hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
              <span>Projects</span>
            </Link>
            <Link
              href="/studio/forge"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Forge</span>
            </Link>
            <Link
              href="/"
              className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1 ml-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Website</span>
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-[#080b12] border-r border-white/[0.08] p-5 flex flex-col justify-between h-full z-10 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/brand/favicon.png"
                      alt="RewindVerse Symbol"
                      width={24}
                      height={24}
                    />
                    <span className="font-bold text-sm text-white">RewindStudio</span>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    aria-label="Close sidebar"
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderNavItems()}
              </div>

              <div className="pt-4 border-t border-white/[0.08] mt-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Exit to Public Website</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Studio Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
