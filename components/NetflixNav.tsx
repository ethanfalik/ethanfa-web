"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

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
      {/* Logo + nav links */}
      <div className="flex items-center gap-10">
        <button
          onClick={() => router.push("/browse")}
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

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Home",   href: "/browse" },
            { label: "About",  href: "/about" },
            { label: "GitHub", href: "https://github.com/ethanfalik", external: true },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => link.external ? window.open(link.href, "_blank") : router.push(link.href)}
              className="text-sm text-[#e5e5e5] hover:text-white transition-colors duration-150"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right side — search + profile avatar */}
      <div className="flex items-center gap-4">
        {searchOpen ? (
          <div className="flex items-center gap-2 border border-white/60 bg-black/80 px-3 py-1.5 animate-fadeIn">
            <Search size={15} className="text-white flex-shrink-0" />
            <input
              id="nav-search-input"
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
              placeholder="Titles, genres, tech..."
              className="bg-transparent text-white text-sm outline-none w-48 placeholder:text-white/40"
            />
            <button onClick={closeSearch}>
              <X size={15} className="text-white/60 hover:text-white" />
            </button>
          </div>
        ) : (
          <button onClick={openSearch} className="text-white hover:text-white/70 transition-colors">
            <Search size={19} />
          </button>
        )}

        {/* Profile avatar — goes back to profile select */}
        <button onClick={() => router.push("/profiles")} className="flex-shrink-0">
          <div className="w-8 h-8 rounded-sm overflow-hidden" style={{ background: "#1a1a1a" }}>
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <rect width="32" height="32" fill="#1a1a1a" />
              {/* </> in small */}
              <polyline points="9.5,12 5,16 9.5,20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
              <polyline points="22.5,12 27,16 22.5,20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
              <line x1="20" y1="10" x2="12" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  );
}
