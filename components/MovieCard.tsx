"use client";

import { useState, useRef } from "react";
import { Plus, ThumbsUp, ChevronDown, Play } from "lucide-react";
import { Project } from "@/lib/types";

interface MovieCardProps {
  project: Project;
  onOpenModal: (project: Project) => void;
  cardIndex: number;
  totalCards: number;
}

export default function MovieCard({
  project,
  onOpenModal,
  cardIndex,
  totalCards,
}: MovieCardProps) {
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

  // Edge-aware expansion direction
  const isFirst = cardIndex === 0;
  const isLast = cardIndex === totalCards - 1;
  const expandLeft = isFirst ? "0" : isLast ? "auto" : "-15%";
  const expandRight = isLast ? "0" : "auto";
  const transformOrigin = isFirst
    ? "top left"
    : isLast
    ? "top right"
    : "top center";

  return (
    <div
      className="relative flex-none"
      style={{ width: "calc(16.666% - 4px)", minWidth: 180 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base card thumbnail */}
      <div
        className="aspect-video rounded-sm overflow-hidden cursor-pointer transition-transform duration-200"
        style={{ transform: expanded ? "scale(1.02)" : "scale(1)" }}
        onClick={() => onOpenModal(project)}
      >
        <div
          className={`w-full h-full ${project.thumbnail.bgClass} flex items-center justify-center relative`}
        >
          <span style={{ fontSize: 52 }}>{project.thumbnail.icon}</span>

          {/* WIP badge */}
          {project.status === "wip" && (
            <div
              className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(255,180,0,0.85)",
                color: "#000",
              }}
            >
              COMING SOON
            </div>
          )}

          {/* Title overlay on base card */}
          {!expanded && (
            <div
              className="absolute bottom-0 left-0 right-0 p-2"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              }}
            >
              <p className="text-white text-xs font-semibold truncate">
                {project.displayTitle}
              </p>
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
            left: expandLeft,
            right: expandRight,
            width: "130%",
            transformOrigin,
            boxShadow: "0 8px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Expanded thumbnail */}
          <div
            className={`aspect-video ${project.thumbnail.bgClass} flex items-center justify-center relative`}
          >
            <span style={{ fontSize: 70 }}>{project.thumbnail.icon}</span>
            <div
              className="absolute bottom-0 left-0 right-0 p-3"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              }}
            >
              <p className="text-white text-sm font-bold">{project.displayTitle}</p>
              <p className="text-white/60 text-xs">{project.type}</p>
            </div>
          </div>

          {/* Info panel */}
          <div className="bg-[#181818] px-3 pt-3 pb-3">
            {/* Action buttons row */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleLaunch}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-white/80 flex-shrink-0 transition-colors"
                title={project.status === "finished" ? "Launch" : "Preview"}
              >
                <Play size={16} fill="black" color="black" className="ml-0.5" />
              </button>

              <button
                className="w-9 h-9 rounded-full border-2 border-white/40 flex items-center justify-center hover:border-white flex-shrink-0 transition-colors"
                title="Add to list"
              >
                <Plus size={16} className="text-white" />
              </button>

              <button
                className="w-9 h-9 rounded-full border-2 border-white/40 flex items-center justify-center hover:border-white flex-shrink-0 transition-colors"
                title="Looks good"
              >
                <ThumbsUp size={14} className="text-white" />
              </button>

              {/* More info — pushed to the right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(project);
                }}
                className="w-9 h-9 rounded-full border-2 border-white/40 flex items-center justify-center hover:border-white flex-shrink-0 ml-auto transition-colors"
                title="More info"
              >
                <ChevronDown size={16} className="text-white" />
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center flex-wrap gap-1.5 mb-2">
              {project.status === "finished" ? (
                <span className="text-[#46D369] font-semibold text-xs">
                  {project.matchScore}% Match
                </span>
              ) : (
                <span className="text-[#FFB800] font-semibold text-xs">
                  In Development
                </span>
              )}
              <span
                className="border text-[10px] px-1 rounded"
                style={{
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {project.maturityRating}
              </span>
              <span className="text-white/50 text-xs">{project.year}</span>
            </div>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-0">
              {project.genre.slice(0, 3).map((g, i) => (
                <span key={g} className="text-white/55 text-[11px]">
                  {i > 0 && (
                    <span className="mx-1 text-white/30">&middot;</span>
                  )}
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
