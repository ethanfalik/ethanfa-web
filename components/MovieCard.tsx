"use client";

import { useState, useRef } from "react";
import { ChevronDown, Play } from "lucide-react";
import { Project } from "@/lib/types";

interface MovieCardProps {
  project: Project;
  onOpenModal: (project: Project) => void;
  cardIndex: number;
  totalCards: number;
}

// Clean typographic project icon — no emoji
function ProjectIcon({ icon, size }: { icon: string; size: number }) {
  return (
    <span
      style={{
        fontSize: size,
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontWeight: 900,
        color: "rgba(255,255,255,0.85)",
        letterSpacing: icon.length > 2 ? "0.05em" : "-0.02em",
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {icon}
    </span>
  );
}

export default function MovieCard({ project, onOpenModal, cardIndex, totalCards }: MovieCardProps) {
  const [expanded, setExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setExpanded(true), 420);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setExpanded(false);
  };

  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      project.status === "finished"
        ? project.liveUrl || `https://${project.subdomain}.ethanfa.com`
        : `https://${project.subdomain}.ethanfa.com`,
      "_blank"
    );
  };

  const isFirst = cardIndex === 0;
  const isLast = cardIndex === totalCards - 1;

  return (
    <div
      className="relative flex-none"
      style={{ width: "calc(16.666% - 4px)", minWidth: 180 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base thumbnail */}
      <div
        className="aspect-video rounded-sm overflow-hidden cursor-pointer"
        onClick={() => onOpenModal(project)}
      >
        <div className={`w-full h-full ${project.thumbnail.bgClass} flex items-center justify-center relative`}>
          <ProjectIcon icon={project.thumbnail.icon} size={48} />

          {project.status === "wip" && (
            <div
              className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5"
              style={{ background: "rgba(255,180,0,0.15)", color: "#FFB800", border: "1px solid rgba(255,180,0,0.3)" }}
            >
              SOON
            </div>
          )}

          {!expanded && (
            <div
              className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-4"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
            >
              <p className="text-white text-xs font-semibold truncate">{project.displayTitle}</p>
            </div>
          )}
        </div>
      </div>

      {/* Expanded hover panel */}
      {expanded && (
        <div
          className="absolute z-50 rounded-sm shadow-2xl overflow-hidden animate-expandCard"
          style={{
            top: 0,
            left: isFirst ? "0" : isLast ? "auto" : "-15%",
            right: isLast ? "0" : "auto",
            width: "130%",
            transformOrigin: isFirst ? "top left" : isLast ? "top right" : "top center",
            boxShadow: "0 8px 48px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Thumbnail */}
          <div className={`aspect-video ${project.thumbnail.bgClass} flex items-center justify-center relative`}>
            <ProjectIcon icon={project.thumbnail.icon} size={64} />
            <div
              className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
            >
              <p className="text-white text-sm font-bold">{project.displayTitle}</p>
              <p className="text-white/50 text-xs">{project.type}</p>
            </div>
          </div>

          {/* Info panel */}
          <div className="bg-[#181818] px-3 pt-3 pb-3">
            {/* Buttons — only functional ones */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleLaunch}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-white/80 flex-shrink-0 transition-colors"
                title={project.status === "finished" ? "Launch" : "Preview"}
              >
                <Play size={15} fill="black" color="black" className="ml-0.5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); onOpenModal(project); }}
                className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center hover:border-white flex-shrink-0 ml-auto transition-colors"
                title="More info"
              >
                <ChevronDown size={15} className="text-white" />
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 mb-2">
              {project.status === "finished" ? (
                <span className="text-[#46D369] font-semibold text-xs">{project.matchScore}% Match</span>
              ) : (
                <span className="text-[#FFB800] font-semibold text-xs">In Development</span>
              )}
              <span className="text-white/40 text-xs">{project.year}</span>
            </div>

            {/* Genre */}
            <div className="flex flex-wrap">
              {project.genre.slice(0, 3).map((g, i) => (
                <span key={g} className="text-white/50 text-[11px]">
                  {i > 0 && <span className="mx-1 text-white/25">&middot;</span>}
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
