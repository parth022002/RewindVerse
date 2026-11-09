"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Compass,
  GraduationCap,
  FileText,
  Shield,
  Milestone,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#080b12]/85 backdrop-blur-2xl transition-all shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo Lockup */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-36 sm:w-44 flex items-center">
            <Image
              src="/brand/logo.png"
              alt="RewindVerse Logo"
              width={180}
              height={40}
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links — 4 Primary Pillars */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
        >
          <Link
            href="/product"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isActive("/product")
                ? "text-cyan-300 font-bold bg-white/[0.06] shadow-sm shadow-cyan-500/10"
                : "hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            Product
          </Link>

          <Link
            href="/explore"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isActive("/explore")
                ? "text-cyan-300 font-bold bg-cyan-500/10 border border-cyan-500/30 shadow-sm shadow-cyan-500/20"
                : "hover:text-cyan-300 hover:bg-white/[0.03]"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explore</span>
          </Link>

          <Link
            href="/learn"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isActive("/learn")
                ? "text-cyan-300 font-bold bg-white/[0.06] shadow-sm shadow-cyan-500/10"
                : "hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Learn</span>
          </Link>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="hover:text-white hover:bg-white/[0.03] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              aria-expanded={resourcesOpen}
            >
              <span>Resources</span>
              <ChevronDown className="w-3 h-3 transition-transform" />
            </button>

            {resourcesOpen && (
              <div className="absolute top-full left-0 w-52 p-2 rounded-xl border border-white/[0.1] bg-[#0c1220]/95 backdrop-blur-2xl shadow-2xl space-y-1 z-50">
                <Link
                  href="/security"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Security & Trust</span>
                </Link>
                <Link
                  href="/roadmap"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Milestone className="w-3.5 h-3.5 text-violet-400" />
                  <span>Platform Roadmap</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Primary Action: Open Studio */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-[#080b12] shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#080b12]" />
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-raised)] transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.1] bg-[#0c1220]/95 backdrop-blur-2xl px-5 pt-3 pb-6 space-y-3 shadow-2xl">
          <Link
            href="/product"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-white hover:text-cyan-400"
          >
            Product Overview
          </Link>

          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Hub</span>
          </Link>

          <Link
            href="/learn"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-white hover:text-cyan-400"
          >
            Academy & Learning
          </Link>

          <div className="pt-2 pb-1 border-t border-white/[0.06] space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
              Resources
            </span>
            <Link
              href="/security"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1.5 text-xs text-[var(--text-muted)] hover:text-white"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security & Privacy</span>
            </Link>
            <Link
              href="/roadmap"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1.5 text-xs text-[var(--text-muted)] hover:text-white"
            >
              <Milestone className="w-3.5 h-3.5 text-violet-400" />
              <span>Platform Roadmap</span>
            </Link>
          </div>

          <div className="pt-3">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-[#080b12] shadow-lg shadow-cyan-500/25"
            >
              <Sparkles className="w-4 h-4 fill-[#080b12]" />
              <span>Open Rewind Studio</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
