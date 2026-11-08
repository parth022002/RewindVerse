import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowUpRight, BookOpen, Wrench, Sparkles, Cpu, RotateCcw } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#080b12]/90 text-xs text-[var(--text-muted)] mt-auto backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/brand/favicon.png"
                alt="RewindVerse Symbol"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="text-base font-extrabold text-white tracking-wide">
                Rewind<span className="text-cyan-400">Verse</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
              <strong className="text-white">Every Model Has a Story.</strong> Train a model, then replay how it learned.
              Deterministic in-browser ML simulation, 2D/3D loss landscapes, and safe algorithm customization.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% In-Browser Privacy · Zero Third-Party Telemetry</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Studio Workspace
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  Studio Home
                </Link>
              </li>
              <li>
                <Link href="/studio/forge" className="hover:text-cyan-300 text-cyan-400 transition-colors flex items-center gap-1.5 font-medium">
                  <Wrench className="w-3 h-3" />
                  Algorithm Forge
                </Link>
              </li>
              <li>
                <Link href="/studio/algorithms" className="hover:text-purple-300 text-purple-400 transition-colors flex items-center gap-1.5 font-medium">
                  <BookOpen className="w-3 h-3" />
                  Algorithm Catalogue
                </Link>
              </li>
              <li>
                <Link href="/studio/lab" className="hover:text-white transition-colors">
                  Interactive Optimizer Lab
                </Link>
              </li>
              <li>
                <Link href="/studio/replay/sample" className="hover:text-white transition-colors">
                  Replay Viewer
                </Link>
              </li>
              <li>
                <Link href="/studio/compare" className="hover:text-white transition-colors">
                  Dual-Run Compare
                </Link>
              </li>
              <li>
                <Link href="/studio/insights" className="hover:text-white transition-colors">
                  Diagnostic Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Specs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Resources & Specs
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors flex items-center gap-1">
                  RVTS Specification <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white transition-colors flex items-center gap-1">
                  Python SDK & CLI <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  Product Architecture
                </Link>
              </li>
              <li>
                <Link href="/visualizations" className="hover:text-white transition-colors">
                  2D & 3D Standards
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Product Roadmap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)] font-mono">
          <span>&copy; {new Date().getFullYear()} RewindVerse. Open-source under Apache 2.0.</span>
          <div className="flex items-center gap-4">
            <Link href="/security" className="hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <a
              href="https://github.com/parth022002/RewindVerse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
