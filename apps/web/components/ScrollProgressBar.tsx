"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    let frameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.min(
            1,
            Math.max(0, window.scrollY / totalHeight)
          );
          setScrollProgress(progress);
        }
        setShowScrollTop(window.scrollY > 420);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Laser Top Scroll Progress Indicator */}
      <div
        role="progressbar"
        aria-label="Page reading progress"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] pointer-events-none origin-left"
        style={{
          transform: `scaleX(${scrollProgress})`,
          background:
            "linear-gradient(90deg, #00f2fe 0%, #38bdf8 50%, #8b5cf6 100%)",
          boxShadow:
            "0 0 10px rgba(0, 242, 254, 0.7), 0 0 20px rgba(139, 92, 246, 0.4)",
          transition: "transform 75ms ease-out",
        }}
      />

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top of page"
          className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-[#080b14]/80 hover:bg-[#0c1220] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white shadow-lg shadow-cyan-500/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}
    </>
  );
}
