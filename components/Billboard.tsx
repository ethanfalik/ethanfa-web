"use client";

import { Project } from "@/lib/types";

interface BillboardProps {
  project: Project;
  onMoreInfo: (project: Project) => void;
}

export default function Billboard({ project, onMoreInfo }: BillboardProps) {
  const handlePlay = () => {
    if (project.status === "finished") {
      window.open(
        project.liveUrl || `https://${project.subdomain}.ethanfa.com`,
        "_blank"
      );
    } else {
      onMoreInfo(project);
    }
  };

  return (
    <div
      className="relative w-full flex items-center"
      style={{ height: "82vh", minHeight: 480 }}
    >
      {/* Background gradient based on project accent */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 70% 40%, ${project.thumbnail.accent}22 0%, transparent 60%),
            linear-gradient(135deg, ${project.thumbnail.accent}18 0%, #0a0a0a 55%)
          `,
        }}
      />

      {/* Giant icon in background */}
      <div
        className="absolute right-0 top-0 bottom-0 flex items-center justify-end overflow-hidden pointer-events-none"
        style={{ width: "55%" }}
      >
        <span
          style={{
            fontSize: "min(42vw, 520px)",
            lineHeight: 1,
            filter: "blur(1px)",
            opacity: 0.12,
            userSelect: "none",
          }}
        >
          {project.thumbnail.icon}
        </span>
      </div>

      {/* Billboard overlay gradients */}
      <div
        className="absolute inset-0 billboard-gradient"
        style={{
          background: `
            linear-gradient(77deg, rgba(0,0,0,0.65) 0%, transparent 80%),
            linear-gradient(to bottom, transparent 35%, rgba(20,20,20,0.55) 72%, #141414 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-12 md:px-16 max-w-[55%] pt-20">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: project.thumbnail.accent }}
          >
            Featured Project
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-white font-black mb-3 leading-none"
          style={{
            fontSize: "clamp(2.5rem, 5.5vw, 4.8rem)",
            textShadow: "2px 4px 16px rgba(0,0,0,0.6)",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          {project.displayTitle}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#46D369] font-semibold text-sm">
            {project.matchScore}% Match
          </span>
          <span className="text-[#e5e5e5] text-sm">{project.year}</span>
          <span className="border border-[#e5e5e5]/50 text-[#e5e5e5] text-xs px-1.5 py-0.5">
            {project.maturityRating}
          </span>
          <span className="text-[#e5e5e5] text-sm">{project.type}</span>
        </div>

        {/* Description */}
        <p
          className="text-[#e5e5e5] text-base leading-relaxed mb-6"
          style={{ textShadow: "1px 2px 8px rgba(0,0,0,0.5)", maxWidth: 480 }}
        >
          {project.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button className="btn-netflix-play" onClick={handlePlay}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: 22, height: 22 }}
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            {project.status === "finished" ? "Launch" : "Preview"}
          </button>

          <button
            className="btn-netflix-info"
            onClick={() => onMoreInfo(project)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: 22, height: 22 }}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
