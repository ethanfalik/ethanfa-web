"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

// Deterministic PRNG — no Math.random so strands are the same every run
function makePRNG(seed: number) {
  let s = seed >>> 0;
  return (): number => {
    s = Math.imul(s, 1664525) + 1013904223;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function Intro() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let done = false;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width;
    const H = canvas.height;

    // ── E geometry (Bebas Neue — sharp, blocky, no curves) ─────────────────
    const fontSize = Math.round(H * 0.70);
    const FONT = `900 ${fontSize}px 'Bebas Neue', Impact, 'Arial Black', sans-serif`;
    ctx.font = FONT;
    ctx.textBaseline = "alphabetic";

    const charW = ctx.measureText("E").width;
    const eX    = (W - charW) / 2;             // left edge of glyph
    const base  = H / 2 + fontSize * 0.37;     // text baseline
    const eTop  = base  - fontSize * 0.76;      // visual cap top
    const eBot  = base;                         // visual cap bottom

    // Zoom target: centre of the left vertical stroke
    const zX = eX + charW * 0.11;
    const zY = (eTop + eBot) / 2;

    // ── Strands ─────────────────────────────────────────────────────────────
    // Horizontal lines drawn ON TOP of the E.
    // At low zoom they look like fine texture; as zoom increases you see
    // individual lines and the spaces between them.
    const N_STRANDS = 90;
    const rng = makePRNG(54321);
    const eH = eBot - eTop;

    const strands = Array.from({ length: N_STRANDS }, (_, i) => {
      const frac  = (i + 0.5) / N_STRANDS;
      const jitter = (rng() - 0.5) * (eH / N_STRANDS) * 0.4;
      const y  = eTop + frac * eH + jitter;

      // Each strand extends a bit beyond the E edges
      const x0 = eX - charW * (0.22 + rng() * 0.18);
      const x1 = eX + charW + charW * (0.08 + rng() * 0.28);

      // Thickness: 0.7–4.9 px (world units)
      const thick = 0.7 + rng() * 4.2;

      // Colour: broad red spectrum — dark crimson → bright red → orange-red
      const hue  = rng() * 28;        //  0°–28° (red to red-orange)
      const sat  = 68 + rng() * 32;   // 68%–100%
      const lit  = 20 + rng() * 44;   // 20%–64% (very dark to bright)

      // Stagger: each strand starts appearing at a slightly different time
      const delay = rng() * 0.58;

      return { y, x0, x1, thick, delay, color: `hsl(${hue.toFixed(1)},${sat.toFixed(0)}%,${lit.toFixed(0)}%)` };
    });

    // ── Animated values (tweened by GSAP) ──────────────────────────────────
    const v = {
      zoomExp:     0,   // 0→1; actual zoom = 55^zoomExp (exponential feel)
      strandAlpha: 0,   // 0→1 drives per-strand fade-in
      eAlpha:      1,   // E opacity
      fadeOut:     0,   // black overlay
    };

    // ── Render ──────────────────────────────────────────────────────────────
    function frame() {
      const zoom = Math.pow(55, v.zoomExp);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // Apply zoom centred on the left stroke
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-zX, -zY);

      // ── Letter E (under strands) ─────────────────────────────────────────
      if (v.eAlpha > 0.004) {
        ctx.globalAlpha  = v.eAlpha;
        ctx.fillStyle    = "#E50914";
        ctx.font         = FONT;
        ctx.textBaseline = "alphabetic";
        ctx.fillText("E", eX, base);
        ctx.globalAlpha  = 1;
      }

      // ── Strands (over E) ──────────────────────────────────────────────────
      // lineCap "butt" = square ends, no rounding anywhere
      ctx.lineCap  = "butt";
      ctx.lineJoin = "miter";

      for (const s of strands) {
        const raw = v.strandAlpha - s.delay;
        if (raw <= 0) continue;
        // Each strand fades in over 0.18 of the strandAlpha range
        const sa = Math.min(1, raw / 0.18);
        ctx.globalAlpha  = sa;
        ctx.strokeStyle  = s.color;
        ctx.lineWidth    = s.thick;
        ctx.beginPath();
        ctx.moveTo(s.x0, s.y);
        ctx.lineTo(s.x1, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // Black fade-out overlay (applied after restore so it covers everything)
      if (v.fadeOut > 0.004) {
        ctx.globalAlpha = v.fadeOut;
        ctx.fillStyle   = "#000";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    }

    const loop = () => {
      if (!done) { frame(); raf = requestAnimationFrame(loop); }
    };
    raf = requestAnimationFrame(loop);

    // ── GSAP timeline ────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        done = true;
        cancelAnimationFrame(raf);
        router.push("/profiles");
      },
    });

    // Zoom: full 4.5 s, power2.in = starts slow, accelerates naturally
    // Using zoomExp so the perceptual zoom is exponential (each doubling feels equal)
    tl.to(v, { zoomExp: 1, duration: 4.5, ease: "power2.in" }, 0);

    // Strands: appear starting t=0.18 (zoom barely begun — strands look tiny)
    // They complete fading in by ~t=2.0
    tl.to(v, { strandAlpha: 1, duration: 2.1, ease: "power1.out" }, 0.18);

    // E fades: starts at t=2.4 when zoom ≈ 3× and first individual lines
    // are becoming visible; gone by t=4.0 when zoom ≈ 16×
    tl.to(v, { eAlpha: 0, duration: 1.6, ease: "power1.inOut" }, 2.4);

    // Fade to black: t=3.9 → 4.6 (overlaps with final deep zoom into spaces)
    tl.to(v, { fadeOut: 1, duration: 0.7, ease: "power2.in" }, 3.9);

    return () => {
      done = true;
      tl.kill();
      cancelAnimationFrame(raf);
    };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9999,
        display: "block",
      }}
    />
  );
}
