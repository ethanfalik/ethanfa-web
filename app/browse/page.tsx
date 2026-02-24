"use client";

import { useState, useMemo } from "react";
import { projects, rows } from "@/lib/projects";
import { Project } from "@/lib/types";
import NetflixNav from "@/components/NetflixNav";
import Billboard from "@/components/Billboard";
import ContentRow from "@/components/ContentRow";
import Modal from "@/components/Modal";

export default function BrowsePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const featuredProject = projects.find((p) => p.featured) ?? projects[0];

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.genre.some((g) => g.toLowerCase().includes(q)) ||
        p.tech.some((t) => t.toLowerCase().includes(q)) ||
        p.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isSearching = Boolean(searchQuery.trim());

  return (
    <div
      className="min-h-screen"
      style={{ background: "#141414" }}
    >
      <NetflixNav onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* Search results view */}
      {isSearching ? (
        <div className="pt-24 px-16 pb-16">
          <p className="text-[#e5e5e5] text-sm mb-6">
            {filteredProjects?.length
              ? `${filteredProjects.length} result${filteredProjects.length !== 1 ? "s" : ""} for "${searchQuery}"`
              : `No results for "${searchQuery}"`}
          </p>

          {filteredProjects && filteredProjects.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  <div
                    className={`aspect-video rounded-sm overflow-hidden ${project.thumbnail.bgClass} flex items-center justify-center relative`}
                  >
                    <span style={{ fontSize: 44 }}>{project.thumbnail.icon}</span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                      }}
                    >
                      <p className="text-white text-xs font-bold p-2 w-full truncate">
                        {project.displayTitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-[#e5e5e5] text-xs mt-1 truncate px-0.5">
                    {project.displayTitle}
                  </p>
                  <p className="text-[#808080] text-[11px] truncate px-0.5">
                    {project.type}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="text-6xl mb-6">🔍</span>
              <p className="text-white text-xl font-semibold mb-2">
                No results found
              </p>
              <p className="text-[#808080] text-sm">
                Try searching for a technology, genre, or project name
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Billboard */}
          <Billboard
            project={featuredProject}
            onMoreInfo={setSelectedProject}
          />

          {/* Content rows */}
          <div className="relative z-10" style={{ marginTop: "-2rem" }}>
            {rows.map((row) => (
              <ContentRow
                key={row.title}
                title={row.title}
                projects={row.projects}
                onOpenModal={setSelectedProject}
              />
            ))}
          </div>

          {/* Footer */}
          <footer className="px-16 py-12 mt-8">
            <div className="flex items-center gap-4 mb-6">
              {["Facebook", "Instagram", "YouTube", "Twitter"].map((icon) => (
                <div
                  key={icon}
                  className="w-6 h-6 opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                    <rect width="24" height="24" rx="4" fill="none" />
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="white">{icon[0]}</text>
                  </svg>
                </div>
              ))}
            </div>
            <div
              className="grid gap-3 mb-6 text-xs"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)",
                color: "#808080",
              }}
            >
              {[
                "Audio Description",
                "Help Centre",
                "Gift Cards",
                "Media Centre",
                "Investor Relations",
                "Jobs",
                "Terms of Use",
                "Privacy",
                "Legal Notices",
                "Cookie Preferences",
                "Corporate Information",
                "Contact Us",
              ].map((item) => (
                <span
                  key={item}
                  className="hover:underline cursor-pointer text-[#808080] hover:text-[#e5e5e5] transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-[#808080] text-xs">
              ethanfa.com · Tel Aviv, Israel
            </p>
          </footer>
        </>
      )}

      {/* Project modal */}
      {selectedProject && (
        <Modal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
