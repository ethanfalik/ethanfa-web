"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

// Layers: darkest (back) → brightest (front)
const LAYERS = [
  "#1E0000",
  "#4A0808",
  "#751212",
  "#A01818",
  "#C82020",
  "#E50914",
  "#FF3333",
];

const N = LAYERS.length;
const FONT: React.CSSProperties = {
  fontFamily: "'Bebas Neue', Impact, 'Arial Black', sans-serif",
  fontSize: "clamp(100px, 16vw, 210px)",
  fontWeight: 900,
  letterSpacing: "0.06em",
  lineHeight: 1,
  userSelect: "none",
  whiteSpace: "nowrap",
  display: "block",
  textAlign: "center",
};

export default function Intro() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const els = layerRefs.current.slice(0, N) as HTMLSpanElement[];

    // Initial state: all stacked at center, invisible
    gsap.set(els, { opacity: 0, y: 0 });
    gsap.set(flashRef.current, { opacity: 0 });

    const tl = gsap.timeline({ onComplete: () => router.push("/profiles") });

    // ── Brief red flash ──────────────────────────────────────────
    tl.to(flashRef.current, { opacity: 0.18, duration: 0.07, ease: "none" }, 0.25)
      .to(flashRef.current, { opacity: 0, duration: 0.35, ease: "power2.out" }, 0.32);

    // ── Fan out: back layers rise, front stays near center ───────
    // i=0 = darkest/back → goes up most; i=N-1 = brightest/front → stays at 0
    const FAN_START = 0.30;
    const FAN_STAGGER = 0.04;
    const MAX_RISE = 90; // px upward for the darkest layer

    for (let i = 0; i < N; i++) {
      const frac = i / (N - 1);           // 0 = back, 1 = front
      const yTarget = -(1 - frac) * MAX_RISE;
      const opacityTarget = 0.25 + frac * 0.75;
      tl.to(
        els[i],
        { opacity: opacityTarget, y: yTarget, duration: 0.75, ease: "power3.out" },
        FAN_START + i * FAN_STAGGER,
      );
    }

    // ── Hold at peak spread ───────────────────────────────────────
    const FAN_END = FAN_START + (N - 1) * FAN_STAGGER + 0.75;
    const COLLAPSE_START = FAN_END + 0.38;

    // ── Collapse: back layers fall back to center and vanish ─────
    tl.to(
      els.slice(0, N - 1),
      {
        y: 0,
        opacity: 0,
        duration: 0.45,
        ease: "power3.in",
        stagger: { amount: 0.14, from: "start" },
      },
      COLLAPSE_START,
    );

    // Front (brightest) layer settles cleanly at center
    tl.to(
      els[N - 1],
      { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
      COLLAPSE_START + 0.05,
    );

    // ── Glow pulse on front layer ────────────────────────────────
    tl.to(els[N - 1], {
      textShadow:
        "0 0 80px rgba(229,9,20,0.9), 0 0 40px rgba(229,9,20,0.55), 0 0 12px rgba(255,100,100,0.35)",
      duration: 0.4,
      ease: "power2.out",
    });

    // ── Hold ─────────────────────────────────────────────────────
    tl.to({}, { duration: 0.85 });

    // ── Fade to black ────────────────────────────────────────────
    tl.to(containerRef.current, { opacity: 0, duration: 0.45, ease: "power2.inOut" });

    return () => { tl.kill(); };
  }, [router]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Red radial flash */}
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(229,9,20,0.55) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Text stack */}
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Hidden spacer — establishes the container's width/height */}
        <span style={{ ...FONT, color: "transparent" }}>ethan</span>

        {/* Animated color layers (absolutely placed on top) */}
        {LAYERS.map((color, i) => (
          <span
            key={i}
            ref={(el) => { layerRefs.current[i] = el; }}
            style={{
              ...FONT,
              color,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              willChange: "transform, opacity",
            }}
          >
            ethan
          </span>
        ))}
      </div>
    </div>
  );
}
