"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  Wrench,
  Layers,
  HelpCircle,
  Shield,
  FileCode,
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#080b12]/75 backdrop-blur-xl transition-all">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          <Link
            href="/product"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            Product
          </Link>
          <Link
            href="/studio/algorithms"
            className="hover:text-cyan-300 text-cyan-400/90 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Catalogue
          </Link>
          <Link
            href="/studio/forge"
            className="hover:text-violet-300 text-violet-400/90 transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            Forge
          </Link>
          <Link
            href="/visualizations"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            Visualizations
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            How It Works
          </Link>
          <Link
            href="/learn"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            Learn
          </Link>
          <Link
            href="/docs"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            Docs
          </Link>
        </nav>

        {/* Right Action: Open Studio Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-[#080b12] shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#080b12]" />
            Launch Studio
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-raised)] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#0e1422] px-5 pt-3 pb-6 space-y-3 shadow-2xl">
          <Link
            href="/product"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-white hover:text-cyan-400"
          >
            Product
          </Link>
          <Link
            href="/studio/algorithms"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <BookOpen className="w-4 h-4" />
            Algorithm Catalogue
          </Link>
          <Link
            href="/studio/forge"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-violet-400 hover:text-violet-300"
          >
            <Wrench className="w-4 h-4" />
            Algorithm Forge
          </Link>
          <Link
            href="/visualizations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-white hover:text-cyan-400"
          >
            Visualizations & 3D
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-white hover:text-cyan-400"
          >
            How It Works
          </Link>
          <Link
            href="/learn"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-white hover:text-cyan-400"
          >
            Learn & Challenges
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-white hover:text-cyan-400"
          >
            Documentation & SDK
          </Link>
          <div className="pt-2">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-[#080b12] shadow-lg shadow-cyan-500/25"
            >
              <Sparkles className="w-4 h-4 fill-[#080b12]" />
              Launch Studio Workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
