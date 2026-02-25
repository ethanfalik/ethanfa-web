"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

// ─── Letter geometry (Bebas Neue at font-size 200, viewBox 660×220) ──────────
// Widths are measured estimates; tweak if letters overlap/gap too much
const LETTERS: { id: string; x: number }[] = [
  { id: "E", x: 8   },
  { id: "T", x: 118 },
  { id: "H", x: 228 },
  { id: "A", x: 366 },
  { id: "N", x: 498 },
];

const PRIMARY = "#E50914";
const FONT = "'Bebas Neue', Impact, 'Arial Black', sans-serif";

export default function Intro() {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Initial state ────────────────────────────────────────────────────────
    LETTERS.forEach(({ id }) => {
      // Base starts squished to zero height (grows upward on reveal)
      gsap.set(`#base-${id}`, { scaleY: 0, transformOrigin: "50% 100%" });
      // Shadow starts fully opaque
      gsap.set(`#shadow-${id}`, { opacity: 1 });
    });

    const tl = gsap.timeline({
      onComplete: () => router.push("/profiles"),
    });

    // ── Per-letter animation (staggered) ────────────────────────────────────
    // Mirrors the CodePen: base scales in, shadow fades out
    LETTERS.forEach(({ id }, i) => {
      const t = i * 0.16;

      // Base letter grows upward from baseline
      tl.to(
        `#base-${id}`,
        { scaleY: 1, duration: 0.24, ease: "power3.out", transformOrigin: "50% 100%" },
        t,
      );

      // Shadow gradient fades away, revealing bright red letter
      tl.to(
        `#shadow-${id}`,
        { opacity: 0, duration: 0.82, ease: "power2.inOut" },
        t + 0.06,
      );
    });

    // ── Hold then fade out ───────────────────────────────────────────────────
    const lastEnd = (LETTERS.length - 1) * 0.16 + 0.82 + 0.06;
    tl.to({}, { duration: 0.5 }, lastEnd)
      .to(wrapRef.current, { opacity: 0, duration: 0.45, ease: "power2.inOut" });

    return () => { tl.kill(); };
  }, [router]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <svg
        viewBox="0 0 660 220"
        style={{ width: "min(90vw, 860px)", overflow: "visible" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/*
           * Per-letter shadow gradient:
           * dark/opaque at the BOTTOM of each letter (offset 0% = y1 = bottom),
           * transparent at the TOP (offset 100% = y2 = top).
           * This replicates the CodePen's shadow-start / shadow-end stops.
           */}
          {LETTERS.map(({ id }) => (
            <linearGradient
              key={id}
              id={`grad-${id}`}
              x1="0"
              y1="1"
              x2="0"
              y2="0"
              gradientUnits="objectBoundingBox"
            >
              {/* shadow-start: dark, opaque (bottom) */}
              <stop offset="0%"   stopColor="black" stopOpacity={0.65} />
              {/* shadow-end: transparent (top) */}
              <stop offset="100%" stopColor="black" stopOpacity={0}    />
            </linearGradient>
          ))}
        </defs>

        {LETTERS.map(({ id, x }) => (
          <g key={id}>
            {/* ── Base (bright red, grows upward on reveal) ── */}
            <text
              id={`base-${id}`}
              x={x}
              y={205}
              fontSize={200}
              fontFamily={FONT}
              fontWeight={900}
              fill={PRIMARY}
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            >
              {id}
            </text>

            {/* ── Shadow (dark gradient, fades to 0 on reveal) ── */}
            <text
              id={`shadow-${id}`}
              x={x}
              y={205}
              fontSize={200}
              fontFamily={FONT}
              fontWeight={900}
              fill={`url(#grad-${id})`}
              style={{ pointerEvents: "none" }}
            >
              {id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
