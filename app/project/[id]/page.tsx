import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import Link from "next/link";
import { Github } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Extra details for showcase pages (subdomain project pages)
const projectShowcaseData: Record<
  string,
  { highlights: string[]; links: { label: string; href: string }[] }
> = {
  rustplusplus: {
    highlights: [
      "Real-time alerts for Patrol Heli, Cargo Ship, Bradley APC, and more",
      "Smart switch & alarm control directly from Discord",
      "Two-way game ↔ Discord chat bridge",
      "Storage monitor tracking with threshold alerts",
      "BattleMetrics player tracking integration",
      "Multi-language support via Crowdin",
      "Docker-ready for easy self-hosting",
      "Production-grade at v1.22.0 with 100+ commands",
    ],
    links: [
      { label: "View on GitHub", href: "https://github.com/ethanfalik/rustplusplus" },
      { label: "npm Package", href: "https://npmjs.com" },
    ],
  },
  "emoji-reactor": {
    highlights: [
      "MediaPipe Face Mesh detects 468 facial landmarks in real time",
      "MediaPipe Pose tracks full-body skeleton",
      "Raises hands → 🙌, Smile → 😊, Neutral → 😐",
      "Runs fully local — no cloud, no latency",
      "Customisable: swap emoji images or tune thresholds",
      "Pure Python with zero web dependencies",
      "Works with any webcam",
    ],
    links: [
      { label: "View on GitHub", href: "https://github.com/ethanfalik" },
    ],
  },
};

export default async function ProjectShowcasePage({ params }: PageProps) {
  const { id } = await params;
  const project = getProjectById(id);
  const showcase = projectShowcaseData[id];

  if (!project || !showcase) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ background: "#141414" }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-12 py-6"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}
      >
        <Link href="https://ethanfa.com">
          <span
            style={{
              color: "#E50914",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 30,
            }}
          >
            ethan
          </span>
        </Link>
        <Link
          href="https://ethanfa.com/browse"
          className="text-sm text-[#e5e5e5] hover:text-white transition-colors"
        >
          ← All Projects
        </Link>
      </nav>

      {/* Hero */}
      <div
        className={`relative w-full flex items-end bg-gradient-to-br ${project.thumbnail.gradient}`}
        style={{ height: "65vh", minHeight: 380 }}
      >
        {/* Background icon */}
        <div className="absolute inset-0 flex items-center justify-end pr-16 overflow-hidden pointer-events-none">
          <span
            style={{
              fontSize: "min(45vw, 420px)",
              opacity: 0.1,
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
              "linear-gradient(77deg, rgba(0,0,0,0.65) 0%, transparent 75%), linear-gradient(to bottom, transparent 35%, rgba(20,20,20,0.55) 70%, #141414 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-12 md:px-16 pb-10 max-w-[55%]">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: project.thumbnail.accent }}
          >
            {project.type}
          </p>
          <h1
            className="text-white font-black leading-none mb-3"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              textShadow: "2px 4px 20px rgba(0,0,0,0.6)",
              letterSpacing: "0.02em",
            }}
          >
            {project.displayTitle}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#46D369] font-semibold text-sm">
              {project.matchScore}% Match
            </span>
            <span className="text-[#e5e5e5] text-sm">{project.year}</span>
          </div>

          <p className="text-[#e5e5e5] text-base leading-relaxed mb-6" style={{ maxWidth: 480 }}>
            {project.description}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            {showcase.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-netflix-info inline-flex items-center gap-2"
              >
                <Github size={16} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-12 md:px-16 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2
                className="text-white font-bold mb-4"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1.6rem", letterSpacing: "0.05em" }}
              >
                About
              </h2>
              <p className="text-[#d2d2d2] text-sm leading-relaxed">
                {project.longDescription}
              </p>
            </section>

            <section>
              <h2
                className="text-white font-bold mb-4"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1.6rem", letterSpacing: "0.05em" }}
              >
                Highlights
              </h2>
              <ul className="space-y-2.5">
                {showcase.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: `${project.thumbnail.accent}33`, color: project.thumbnail.accent }}
                    >
                      ✓
                    </span>
                    <span className="text-[#d2d2d2] text-sm">{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-5 text-sm">
            <div>
              <span className="text-[#808080]">Genre: </span>
              {project.genre.map((g, i) => (
                <span key={g} className="text-[#e5e5e5]">{i > 0 && ", "}{g}</span>
              ))}
            </div>
            <div>
              <span className="text-[#808080]">Tech: </span>
              {project.tech.map((t, i) => (
                <span key={t} className="text-[#e5e5e5]">{i > 0 && ", "}{t}</span>
              ))}
            </div>
            <div>
              <span className="text-[#808080]">Status: </span>
              <span className="text-[#46D369] font-semibold">Live</span>
            </div>
            <div>
              <span className="text-[#808080]">By: </span>
              <a
                href="https://github.com/ethanfalik"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e5e5e5] hover:text-white hover:underline transition-colors"
              >
                Ethan Falik
              </a>
            </div>

            <div className="pt-2">
              {showcase.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#e5e5e5] hover:text-white transition-colors text-sm"
                >
                  <Github size={14} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
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
