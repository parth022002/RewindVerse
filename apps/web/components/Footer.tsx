import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--surface)]/60 text-xs text-[var(--text-muted)] mt-auto backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/favicon.png"
                alt="RewindVerse Symbol"
                width={26}
                height={26}
                className="object-contain"
              />
              <span className="text-base font-extrabold text-white tracking-wide">
                Rewind<span className="text-cyan-400">Verse</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
              <strong className="text-white">Every Model Has a Story.</strong> Train a model, then replay how it learned.
              Local-first, deterministic ML replay and diagnostic intelligence.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% In-Browser Privacy · Zero Data Collection</span>
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
                <Link href="/studio/lab" className="hover:text-white transition-colors text-cyan-400">
                  Interactive 3D Lab
                </Link>
              </li>
              <li>
                <Link href="/studio/import" className="hover:text-white transition-colors">
                  CSV / RVTS Importer
                </Link>
              </li>
              <li>
                <Link href="/studio/compare" className="hover:text-white transition-colors">
                  Run Compare
                </Link>
              </li>
              <li>
                <Link href="/studio/insights" className="hover:text-white transition-colors">
                  Heuristic Diagnostics
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
                  Python SDK (CLI) <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Product Roadmap
                </Link>
              </li>
              <li>
                <Link href="/examples" className="hover:text-white transition-colors">
                  Benchmark Gallery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)] font-mono">
          <span>&copy; {new Date().getFullYear()} RewindVerse. All rights reserved.</span>
          <span>One source of truth · Multiple faithful views</span>
        </div>
      </div>
    </footer>
  );
}
