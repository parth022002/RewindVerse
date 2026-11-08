"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sparkles, Compass, BookOpen, FileText, PlayCircle, Map, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo Lockup */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-36 sm:w-44 flex items-center">
            <Image
              src="/brand/logo.png"
              alt="RewindVerse Logo"
              width={180}
              height={40}
              className="object-contain"
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
            href="/visualizations"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300"
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
            href="/security"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            Security
          </Link>
          <Link
            href="/docs"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            Docs
          </Link>
        </nav>

        {/* Right Action: Open Studio Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Launch Studio
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/5 bg-[var(--surface)] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/product"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-white hover:text-cyan-400"
          >
            Product
          </Link>
          <Link
            href="/visualizations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-cyan-300"
          >
            Visualizations & 3D
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-white"
          >
            How It Works
          </Link>
          <Link
            href="/learn"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-white"
          >
            Learn & Academy
          </Link>
          <Link
            href="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-white"
          >
            Security & Privacy
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-white"
          >
            Documentation & SDK
          </Link>
          <div className="pt-2">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Rewind Studio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
