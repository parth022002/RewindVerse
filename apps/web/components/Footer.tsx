import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowUpRight, BookOpen, Wrench, Sparkles, Compass, GraduationCap, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#080b12]/90 text-xs text-[var(--text-muted)] mt-auto backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info & Local-First Trust Statement */}
          <div className="space-y-4">
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
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              <strong className="text-white">Every Model Has a Story.</strong> Bring data, explore algorithms,
              replay optimization dynamics, and verify model trustworthiness.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Local-First Execution · Zero Telemetry</span>
            </div>
          </div>

          {/* Product & Discovery */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore & Learn
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  Product Overview
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-cyan-300 text-cyan-400 transition-colors flex items-center gap-1.5 font-medium">
                  <Compass className="w-3 h-3" />
                  Algorithm & Visual Hub
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3" />
                  Academy & Tutorials
                </Link>
              </li>
              <li>
                <Link href="/visualizations" className="hover:text-white transition-colors">
                  2D & 3D Loss Gallery
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Rewind Studio Workspace */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Rewind Studio
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  Overview & Dashboard
                </Link>
              </li>
              <li>
                <Link href="/studio/projects" className="hover:text-white transition-colors">
                  Research Projects
                </Link>
              </li>
              <li>
                <Link href="/studio/forge" className="hover:text-violet-300 text-violet-400 transition-colors flex items-center gap-1.5 font-medium">
                  <Wrench className="w-3 h-3" />
                  Algorithm Forge
                </Link>
              </li>
              <li>
                <Link href="/studio/data" className="hover:text-white transition-colors">
                  Data Lab & Profiler
                </Link>
              </li>
              <li>
                <Link href="/studio/experiments" className="hover:text-white transition-colors">
                  Experiment Lab & Runs
                </Link>
              </li>
              <li>
                <Link href="/studio/benchmarks" className="hover:text-white transition-colors">
                  RewindBench Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Trust */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Resources & Trust
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors flex items-center gap-1">
                  How It Works <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security & Trust
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Platform Roadmap
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Settings & Storage
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/parth022002/RewindVerse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)] font-mono">
          <span>&copy; {new Date().getFullYear()} RewindVerse. Open-source under Apache 2.0.</span>
          <div className="flex items-center gap-4">
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/security" className="hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/roadmap" className="hover:text-white transition-colors">
              Roadmap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
