"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, X } from "lucide-react";

interface NetflixNavProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export default function NetflixNav({ onSearch, searchQuery = "" }: NetflixNavProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => document.getElementById("nav-search-input")?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setInputValue("");
    onSearch?.("");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 transition-all duration-500"
      style={{
        height: 68,
        background: scrolled
          ? "rgba(20,20,20,0.97)"
          : "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(4px)" : "none",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-10">
        <button
          onClick={() => router.push("/browse")}
          className="flex-shrink-0"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span
            style={{
              color: "#E50914",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 32,
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            ethan
          </span>
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Home", href: "/browse" },
            { label: "About", href: "/about" },
            { label: "GitHub", href: "https://github.com/ethanfalik", external: true },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.external) window.open(link.href, "_blank");
                else router.push(link.href);
              }}
              className="text-sm text-[#e5e5e5] hover:text-white transition-colors duration-150"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2 border border-white/60 bg-black/80 px-3 py-1.5 animate-fadeIn">
              <Search size={16} className="text-white flex-shrink-0" />
              <input
                id="nav-search-input"
                type="text"
                value={inputValue}
                onChange={handleSearchChange}
                placeholder="Titles, genres, tech..."
                className="bg-transparent text-white text-sm outline-none w-48 placeholder:text-white/40"
              />
              <button onClick={closeSearch}>
                <X size={16} className="text-white/60 hover:text-white" />
              </button>
            </div>
          ) : (
            <button onClick={openSearch} className="text-white hover:text-white/80 transition-colors">
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Bell */}
        <button className="text-white hover:text-white/80 transition-colors">
          <Bell size={20} />
        </button>

        {/* Profile avatar */}
        <button
          onClick={() => router.push("/profiles")}
          className="flex-shrink-0"
        >
          <div
            className="w-8 h-8 rounded-sm overflow-hidden"
            style={{ background: "#8B0000" }}
          >
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <rect width="32" height="32" fill="#8B0000" />
              <rect x="6" y="9" width="20" height="13" rx="1.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
              <polyline
                points="10,18 14,14 10,10"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <line x1="15" y1="18" x2="20" y2="18" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="13" y="22" width="6" height="2" fill="rgba(255,255,255,0.9)" />
              <line x1="9" y1="24" x2="23" y2="24" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  );
}
