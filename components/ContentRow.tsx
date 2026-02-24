"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/lib/types";
import MovieCard from "./MovieCard";

interface ContentRowProps {
  title: string;
  projects: Project[];
  onOpenModal: (project: Project) => void;
}

const CARDS_PER_PAGE = 6;

export default function ContentRow({ title, projects, onOpenModal }: ContentRowProps) {
  const [page, setPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(projects.length / CARDS_PER_PAGE);
  const visibleProjects = projects.slice(
    page * CARDS_PER_PAGE,
    (page + 1) * CARDS_PER_PAGE
  );

  const paginate = (direction: "left" | "right") => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setPage((prev) => {
      if (direction === "right") return (prev + 1) % totalPages;
      return (prev - 1 + totalPages) % totalPages;
    });
    setTimeout(() => setIsTransitioning(false), 350);
  };

  if (projects.length === 0) return null;

  return (
    <div className="relative mb-2 group/row" style={{ paddingBottom: "3rem" }}>
      {/* Row title */}
      <h2
        className="text-white font-bold mb-2 cursor-pointer hover:text-[#e5e5e5] transition-colors"
        style={{
          paddingLeft: "4rem",
          fontSize: "clamp(0.9rem, 1.3vw, 1.25rem)",
        }}
      >
        {title}
        {/* Netflix-style pager dots */}
        {totalPages > 1 && (
          <span className="ml-3 inline-flex gap-1 align-middle opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                className="inline-block w-2 h-[2px] transition-colors"
                style={{
                  background: i === page ? "#fff" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </span>
        )}
      </h2>

      {/* Scroll container */}
      <div
        className="relative"
        style={{ paddingLeft: "4rem", paddingRight: "4rem" }}
      >
        {/* Left arrow */}
        {page > 0 && (
          <button
            onClick={() => paginate("left")}
            className="absolute left-0 top-0 bottom-0 z-40 w-16 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            style={{
              background: "rgba(20,20,20,0.5)",
              backdropFilter: "blur(2px)",
            }}
          >
            <ChevronLeft size={32} className="text-white" />
          </button>
        )}

        {/* Cards */}
        <div
          ref={rowRef}
          className="flex gap-1 overflow-visible"
          style={{
            opacity: isTransitioning ? 0.6 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {visibleProjects.map((project, i) => (
            <MovieCard
              key={project.id}
              project={project}
              onOpenModal={onOpenModal}
              cardIndex={i}
              totalCards={visibleProjects.length}
            />
          ))}
        </div>

        {/* Right arrow */}
        {totalPages > 1 && page < totalPages - 1 && (
          <button
            onClick={() => paginate("right")}
            className="absolute right-0 top-0 bottom-0 z-40 w-16 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            style={{
              background: "rgba(20,20,20,0.5)",
              backdropFilter: "blur(2px)",
            }}
          >
            <ChevronRight size={32} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
