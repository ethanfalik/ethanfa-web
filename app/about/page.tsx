"use client";

import { useRouter } from "next/navigation";
import NetflixNav from "@/components/NetflixNav";
import { Github, Mail, MapPin, ExternalLink } from "lucide-react";

const skills = {
  Languages: ["TypeScript", "JavaScript", "Python", "Swift"],
  "Web & Mobile": ["Next.js", "React", "Node.js", "SwiftUI"],
  "AI / ML": ["TensorFlow.js", "MediaPipe", "Gemini AI"],
  "Tools & Infra": ["Firebase", "Cloudflare Workers", "Docker", "Discord.js"],
  "Animation": ["GSAP", "Three.js", "Framer Motion"],
};

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: "#141414" }}>
      <NetflixNav />

      {/* Hero / Billboard-style header */}
      <div
        className="relative w-full flex items-end"
        style={{
          height: "78vh",
          minHeight: 460,
          background: `
            radial-gradient(ellipse at 65% 35%, rgba(0,64,135,0.35) 0%, transparent 60%),
            linear-gradient(135deg, rgba(0,48,100,0.3) 0%, #0a0a0a 55%)
          `,
        }}
      >
        {/* Abstract background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Decorative concentric rings */}
          {[300, 520, 740, 960].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                right: -size * 0.2,
                top: "50%",
                transform: "translateY(-50%)",
                borderColor: `rgba(0,100,200,${0.08 - i * 0.015})`,
              }}
            />
          ))}

          {/* Big initials */}
          <div
            className="absolute right-16 top-1/2 -translate-y-1/2 font-black text-[24vw] leading-none select-none pointer-events-none"
            style={{
              color: "rgba(0,64,135,0.08)",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            EF
          </div>
        </div>

        {/* Overlay gradients */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(77deg, rgba(0,0,0,0.65) 0%, transparent 75%),
              linear-gradient(to bottom, transparent 30%, rgba(20,20,20,0.6) 70%, #141414 100%)
            `,
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-12 md:px-16 pb-10 max-w-[60%]">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#4a9eff" }}
            >
              Developer
            </span>
          </div>

          {/* Name */}
          <h1
            className="text-white font-black leading-none mb-3"
            style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              textShadow: "2px 4px 24px rgba(0,0,0,0.6)",
              letterSpacing: "0.02em",
            }}
          >
            Ethan Falik
          </h1>

          {/* Location + meta */}
          <div className="flex items-center flex-wrap gap-4 mb-4">
            <span className="text-[#46D369] font-semibold text-sm">
              Open to opportunities
            </span>
            <span className="flex items-center gap-1.5 text-[#e5e5e5] text-sm">
              <MapPin size={13} />
              Tel Aviv, Israel
            </span>
            <span className="border border-[#e5e5e5]/50 text-[#e5e5e5] text-xs px-1.5 py-0.5">
              All Ages
            </span>
          </div>

          {/* Bio */}
          <p
            className="text-[#e5e5e5] text-base leading-relaxed mb-6"
            style={{ textShadow: "1px 2px 8px rgba(0,0,0,0.5)", maxWidth: 500 }}
          >
            Building things from Tel Aviv. I love creating software that blends great design with interesting tech — from Discord bots and AI tools to iOS apps and computer vision experiments.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://github.com/ethanfalik"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-netflix-play"
            >
              <Github size={20} />
              GitHub
            </a>
            <a
              href="mailto:ethan.falik.1@gmail.com"
              className="btn-netflix-info"
            >
              <Mail size={18} />
              Email Me
            </a>
            <button
              className="btn-netflix-info"
              onClick={() => router.push("/browse")}
            >
              <ExternalLink size={18} />
              View Projects
            </button>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="px-12 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: About */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2
                className="text-white font-bold text-xl mb-4"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1.6rem", letterSpacing: "0.05em" }}
              >
                About
              </h2>
              <p className="text-[#d2d2d2] text-sm leading-relaxed mb-3">
                I&apos;m a self-driven developer based in Tel Aviv with a passion for building polished, functional software. I thrive at the intersection of design and engineering — whether it&apos;s crafting smooth UI animations, integrating AI/ML models, or architecting real-time systems.
              </p>
              <p className="text-[#d2d2d2] text-sm leading-relaxed">
                My projects span Discord bots with 1000+ lines of TypeScript, iOS apps built with SwiftUI and Firebase, computer vision tools powered by MediaPipe and TensorFlow.js, and web apps deployed to Cloudflare Workers. I care about the details: good code, fast performance, and experiences that feel right.
              </p>
            </section>

            {/* Skills grid */}
            <section>
              <h2
                className="text-white font-bold mb-4"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1.6rem", letterSpacing: "0.05em" }}
              >
                Skills
              </h2>
              <div className="space-y-3">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="flex gap-4 text-sm">
                    <span className="text-[#808080] w-36 flex-shrink-0">{category}:</span>
                    <span className="text-[#e5e5e5]">{items.join(", ")}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Info card */}
          <div className="space-y-6">
            {/* Cast-style info */}
            <div className="text-sm space-y-3">
              <div>
                <span className="text-[#808080]">Name: </span>
                <span className="text-[#e5e5e5]">Ethan Falik</span>
              </div>
              <div>
                <span className="text-[#808080]">Based in: </span>
                <span className="text-[#e5e5e5]">Tel Aviv, Israel</span>
              </div>
              <div>
                <span className="text-[#808080]">Speciality: </span>
                <span className="text-[#e5e5e5]">
                  Full-Stack, AI/ML, Mobile
                </span>
              </div>
              <div>
                <span className="text-[#808080]">Contact: </span>
                <a
                  href="mailto:ethan.falik.1@gmail.com"
                  className="text-[#e5e5e5] hover:text-white hover:underline transition-colors"
                >
                  ethan.falik.1@gmail.com
                </a>
              </div>
              <div>
                <span className="text-[#808080]">GitHub: </span>
                <a
                  href="https://github.com/ethanfalik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e5e5e5] hover:text-white hover:underline transition-colors"
                >
                  github.com/ethanfalik
                </a>
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-[#808080] text-sm mb-2">Genres:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Full-Stack Dev",
                  "AI/ML",
                  "Mobile",
                  "Automation",
                  "Real-Time Apps",
                  "Open Source",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-sm"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "#e5e5e5",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More like this — projects preview */}
      <div className="px-12 md:px-16 pb-16">
        <h2
          className="text-white font-bold mb-4"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1.6rem", letterSpacing: "0.05em" }}
        >
          More From Ethan
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {["rustplusplus", "calc01", "emoji-reactor", "signlingo", "poop"].map(
            (id) => {
              const gradients: Record<string, string> = {
                rustplusplus: "from-orange-950 via-red-950 to-black",
                calc01: "from-blue-950 via-violet-950 to-black",
                "emoji-reactor": "from-purple-950 via-pink-950 to-black",
                signlingo: "from-teal-950 via-cyan-950 to-black",
                poop: "from-amber-950 via-yellow-950 to-black",
              };
              const icons: Record<string, string> = {
                rustplusplus: "🦀",
                calc01: "∑",
                "emoji-reactor": "😊",
                signlingo: "🤟",
                poop: "💩",
              };
              return (
                <button
                  key={id}
                  onClick={() => router.push("/browse")}
                  className="cursor-pointer group"
                  style={{ background: "none", border: "none" }}
                >
                  <div
                    className={`aspect-video rounded-sm bg-gradient-to-br ${gradients[id]} flex items-center justify-center overflow-hidden relative`}
                  >
                    <span style={{ fontSize: 38 }}>{icons[id]}</span>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
