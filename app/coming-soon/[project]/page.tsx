import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import Link from "next/link";

interface PageProps {
  params: Promise<{ project: string }>;
}

const comingSoonData: Record<
  string,
  {
    releaseHint: string;
    features: string[];
    status: string;
  }
> = {
  signlingo: {
    releaseHint: "2025",
    features: [
      "Real-time hand landmark detection via MediaPipe",
      "TensorFlow.js ML model trained on crowdsourced ASL data",
      "Duolingo-style lessons with instant feedback",
      "Cross-platform desktop app (Windows, Mac, Linux)",
      "Offline-capable — no internet required to practice",
      "Firebase backend for progress tracking & data sharing",
    ],
    status: "In active development",
  },
  poop: {
    releaseHint: "2025",
    features: [
      "Apple Liquid Glass UI with modern SwiftUI design",
      "Send emoji messages to friends in real time",
      "Push notifications via Firebase Cloud Messaging",
      "Friend system with shareable invite links",
      "User onboarding with custom avatar upload",
      "User blocking and privacy controls",
    ],
    status: "Backend configuration in progress",
  },
};

export default async function ComingSoonPage({ params }: PageProps) {
  const { project: projectId } = await params;
  const project = getProjectById(projectId);

  if (!project || !comingSoonData[projectId]) {
    notFound();
  }

  const data = comingSoonData[projectId];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#141414" }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-12 py-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}
      >
        <Link href="https://ethanfa.com">
          <span
            style={{
              color: "#E50914",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 30,
              letterSpacing: "-0.01em",
            }}
          >
            ethan
          </span>
        </Link>
        <Link
          href="https://ethanfa.com/browse"
          className="text-sm text-[#e5e5e5] hover:text-white transition-colors"
        >
          ← Back to projects
        </Link>
      </nav>

      {/* Hero */}
      <div
        className={`relative w-full flex items-center justify-center bg-gradient-to-br ${project.thumbnail.gradient}`}
        style={{ height: "55vh", minHeight: 340 }}
      >
        {/* Big background icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            style={{
              fontSize: "min(50vw, 380px)",
              opacity: 0.09,
              filter: "blur(2px)",
              userSelect: "none",
            }}
          >
            {project.thumbnail.icon}
          </span>
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, #141414 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-8">
          <span
            className="text-8xl block mb-4"
            style={{ filter: "drop-shadow(0 0 30px rgba(0,0,0,0.5))" }}
          >
            {project.thumbnail.icon}
          </span>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: project.thumbnail.accent }}
          >
            Coming Soon
          </p>
          <h1
            className="text-white font-black"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              letterSpacing: "0.03em",
              textShadow: "2px 4px 20px rgba(0,0,0,0.7)",
            }}
          >
            {project.displayTitle}
          </h1>
          <p className="text-[#d2d2d2] text-base mt-2">{project.tagline}</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 px-12 md:px-24 py-12 max-w-4xl mx-auto w-full">
        {/* Status badge */}
        <div className="flex items-center gap-3 mb-8">
          <span
            className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
            style={{
              background: "rgba(255,180,0,0.12)",
              color: "#FFB800",
              border: "1px solid rgba(255,180,0,0.3)",
            }}
          >
            {data.status}
          </span>
          <span className="text-[#808080] text-sm">
            Expected: {data.releaseHint}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#d2d2d2] text-base leading-relaxed mb-10">
          {project.longDescription}
        </p>

        {/* What to expect */}
        <div className="mb-10">
          <h2
            className="text-white font-bold mb-5"
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "1.5rem",
              letterSpacing: "0.05em",
            }}
          >
            What to Expect
          </h2>
          <ul className="space-y-3">
            {data.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${project.thumbnail.accent}33`, color: project.thumbnail.accent }}
                >
                  ✓
                </span>
                <span className="text-[#d2d2d2] text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech stack */}
        <div className="mb-10">
          <h2
            className="text-white font-bold mb-4"
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "1.5rem",
              letterSpacing: "0.05em",
            }}
          >
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-sm px-3 py-1.5 rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#e5e5e5",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Back CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="https://ethanfa.com/browse"
            className="btn-netflix-info inline-flex"
            style={{ textDecoration: "none" }}
          >
            ← Browse Other Projects
          </Link>
          <a
            href="https://github.com/ethanfalik"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-netflix-info inline-flex"
          >
            GitHub Profile
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-12 py-8 border-t border-white/5">
        <p className="text-[#808080] text-xs text-center">
          ethanfa.com · Ethan Falik · Tel Aviv, Israel
        </p>
      </footer>
    </div>
  );
}
