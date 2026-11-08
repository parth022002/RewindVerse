import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { GraduationCap, ArrowRight, BookOpen, Clock, CheckCircle } from "lucide-react";

export default function LearnPage() {
  const lessons = [
    {
      id: "ravine",
      title: "The Anisotropic Ravine Dilemma",
      topic: "Optimization Dynamics",
      level: "Beginner",
      time: "5 mins",
      desc: "Understand why gradient descent bounces back and forth across steep valley walls when curvature is ill-conditioned.",
      href: "/studio/academy",
    },
    {
      id: "momentum",
      title: "Momentum & Velocity Accumulation",
      topic: "Accelerated Optimization",
      level: "Intermediate",
      time: "8 mins",
      desc: "Discover how exponential moving averages dampen orthogonal oscillations while accelerating along the optimal trajectory.",
      href: "/studio/academy",
    },
    {
      id: "adam",
      title: "Adaptive Moments: The Mechanics of Adam",
      topic: "Adaptive Learning Rates",
      level: "Intermediate",
      time: "10 mins",
      desc: "Deconstruct how bias-corrected first and second moments rescale gradient steps across disparate coordinate scales.",
      href: "/studio/academy",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Rewind Learning Hub
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Learn Machine Learning by Replaying
          </h1>
          <p className="text-base text-[var(--text-muted)]">
            Move beyond static equations. Formulate predictions, execute real algorithms, and inspect
            the exact mathematical consequences in Rewind Studio.
          </p>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
                  <span className="text-amber-400">{lesson.topic}</span>
                  <span>•</span>
                  <span>{lesson.level}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lesson.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {lesson.desc}
                </p>
              </div>

              <Link
                href={lesson.href}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs hover:bg-amber-500/20 transition-colors"
              >
                Start Lesson <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

