"use client";

import { useEffect } from "react";
import { X, Play, ExternalLink, Github } from "lucide-react";
import { Project } from "@/lib/types";

interface ModalProps {
  project: Project;
  onClose: () => void;
}

export default function Modal({ project, onClose }: ModalProps) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleLaunch = () => {
    window.open(
      project.status === "finished"
        ? project.liveUrl || `https://${project.subdomain}.ethanfa.com`
        : `https://${project.subdomain}.ethanfa.com`,
      "_blank"
    );
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-3xl mx-4 overflow-y-auto animate-slideUp"
        style={{
          background: "#181818",
          borderRadius: 8,
          maxHeight: "90vh",
          boxShadow: "0 8px 64px rgba(0,0,0,0.9)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
          style={{ background: "rgba(20,20,20,0.7)" }}
        >
          <X size={20} className="text-white" />
        </button>

        {/* Hero area */}
        <div
          className={`relative w-full ${project.thumbnail.bgClass}`}
          style={{ height: 360 }}
        >
          {/* Background icon */}
          <div className="absolute inset-0 flex items-center justify-end overflow-hidden pr-16">
            <span
              style={{
                fontSize: 220,
                opacity: 0.15,
                filter: "blur(2px)",
                userSelect: "none",
              }}
            >
              {project.thumbnail.icon}
            </span>
          </div>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #181818 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(77deg, rgba(0,0,0,0.5) 0%, transparent 70%)",
            }}
          />

          {/* Title area */}
          <div className="absolute bottom-0 left-0 p-8">
            <h2
              className="text-white font-black leading-none mb-4"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                letterSpacing: "0.02em",
                textShadow: "1px 2px 12px rgba(0,0,0,0.6)",
              }}
            >
              {project.displayTitle}
            </h2>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button className="btn-netflix-play" onClick={handleLaunch}>
                <Play size={20} />
                {project.status === "finished" ? "Launch" : "Preview"}
              </button>

              {project.githubUrl && (
                <button
                  className="btn-netflix-info"
                  onClick={() =>
                    window.open(project.githubUrl, "_blank")
                  }
                >
                  <Github size={18} />
                  GitHub
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left: meta + description */}
            <div className="col-span-2">
              {/* Meta row */}
              <div className="flex items-center flex-wrap gap-3 mb-4">
                {project.status === "finished" ? (
                  <span className="text-[#46D369] font-bold text-sm">
                    {project.matchScore}% Match
                  </span>
                ) : (
                  <span className="text-[#FFB800] font-bold text-sm">
                    In Development
                  </span>
                )}
                <span className="text-[#e5e5e5] text-sm">{project.year}</span>
                <span
                  className="border text-[11px] px-1.5 py-0.5 rounded"
                  style={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {project.maturityRating}
                </span>
                {project.status === "wip" && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,180,0,0.15)", color: "#FFB800", border: "1px solid #FFB80044" }}>
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className="text-[#d2d2d2] text-sm leading-relaxed"
                style={{ lineHeight: 1.7 }}
              >
                {project.longDescription}
              </p>
            </div>

            {/* Right: genres + tech */}
            <div className="col-span-1 text-sm space-y-4">
              <div>
                <span className="text-[#808080]">Genre: </span>
                {project.genre.map((g, i) => (
                  <span key={g} className="text-[#e5e5e5]">
                    {i > 0 && ", "}
                    {g}
                  </span>
                ))}
              </div>

              <div>
                <span className="text-[#808080]">Built with: </span>
                {project.tech.map((t, i) => (
                  <span key={t} className="text-[#e5e5e5]">
                    {i > 0 && ", "}
                    {t}
                  </span>
                ))}
              </div>

              <div>
                <span className="text-[#808080]">Type: </span>
                <span className="text-[#e5e5e5]">{project.type}</span>
              </div>

              <div>
                <span className="text-[#808080]">Status: </span>
                <span
                  className="font-semibold"
                  style={{
                    color:
                      project.status === "finished" ? "#46D369" : "#FFB800",
                  }}
                >
                  {project.status === "finished" ? "Live" : "In Development"}
                </span>
              </div>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#e5e5e5] hover:text-white transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>View on GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
