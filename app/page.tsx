"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
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

    // ── E Geometry ──────────────────────────────────────────────────────────
    // Netflix-style: bold, condensed. Height ~68% of screen height.
    const eH    = H * 0.68;
    const eW    = eH * 0.68;
    const eX    = (W - eW) / 2;
    const eY    = (H - eH) / 2;
    const stemW = eW * 0.19;
    const barH  = eH * 0.18;
    const gap   = (eH - 3 * barH) / 2;

    // Named rects for each stroke of the E
    const S = {
      stem: { x: eX, y: eY,              w: stemW,     h: eH   },
      top:  { x: eX, y: eY,              w: eW,        h: barH },
      mid:  { x: eX, y: eY + barH + gap, w: eW * 0.80, h: barH },
      bot:  { x: eX, y: eY + eH - barH,  w: eW,        h: barH },
    };

    // Zoom target: centre of left vertical stroke
    const zX = eX + stemW / 2;
    const zY = eY + eH / 2;

    // ── Spectrum Ribbons ─────────────────────────────────────────────────────
    const rng   = seededRng(77331);
    const N     = 90;
    type Ribbon = { cx: number; w: number; hue: number; sat: number; lit: number };
    const ribbons: Ribbon[] = [];

    const rL    = eX - eW * 0.6;
    const rR    = eX + eW + eW * 0.6;
    const rSpan = rR - rL;

    for (let i = 0; i < N; i++) {
      const t  = i / N;
      const cx = rL + t * rSpan + (rng() - 0.5) * (rSpan / N) * 0.8;
      const w  = eH * (0.006 + rng() * 0.032);

      // Distance from zoom center drives color shift:
      // center = deep red → outer = purple / magenta → edge = deep blue
      const dist = Math.abs(cx - zX) / (rSpan * 0.5);
      let hue: number;
      if (dist < 0.5) {
        hue = 0;
      } else if (dist < 0.82) {
        hue = ((dist - 0.5) / 0.32) * 295;      // red → purple/magenta
      } else {
        hue = 260 + ((dist - 0.82) / 0.18) * 55; // purple → deep blue
      }
      const sat = 78 + rng() * 22;
      const lit = 20 + rng() * 42;

      ribbons.push({ cx, w, hue, sat, lit });
    }

    // ── Animated values ───────────────────────────────────────────────────────
    const v = {
      stemReveal: 0,
      topReveal:  0,
      midReveal:  0,
      botReveal:  0,
      zoomExp:    0,   // 0→1; actual zoom = 40^zoomExp
      specAlpha:  0,
      eAlpha:     1,
      fadeOut:    0,
    };

    // ── Draw Helpers ─────────────────────────────────────────────────────────
    function clipReveal(
      r: { x: number; y: number; w: number; h: number },
      t: number,
      dir: "up" | "right"
    ) {
      ctx.beginPath();
      if (dir === "up") {
        const rh = r.h * t;
        ctx.rect(r.x, r.y + r.h - rh, r.w, rh);
      } else {
        ctx.rect(r.x, r.y, r.w * t, r.h);
      }
      ctx.clip();
    }

    function drawStroke(
      r: { x: number; y: number; w: number; h: number },
      reveal: number,
      dir: "up" | "right",
      stops: [number, string][]
    ) {
      if (reveal <= 0) return;
      ctx.save();
      clipReveal(r, reveal, dir);
      // Stem gets a horizontal gradient (bright left → dark right = ribbon-fold illusion)
      // Bars get a vertical gradient (bright top → dark bottom = top-lit shelf look)
      const grad = dir === "up"
        ? ctx.createLinearGradient(r.x, r.y, r.x + r.w, r.y)
        : ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
      for (const [stop, color] of stops) grad.addColorStop(stop, color);
      ctx.fillStyle = grad;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.restore();
    }

    const STEM_G: [number, string][] = [[0, "#FF2424"], [0.45, "#E50914"], [1, "#8A0000"]];
    const BAR_G:  [number, string][] = [[0, "#FF1A1A"], [0.5,  "#E50914"], [1, "#8B0000"]];

    function drawE() {
      // Vertical stem — wipes upward
      drawStroke(S.stem, v.stemReveal, "up",    STEM_G);
      // Horizontal bars — extend rightward from stem
      drawStroke(S.top,  v.topReveal,  "right", BAR_G);
      drawStroke(S.mid,  v.midReveal,  "right", BAR_G);
      drawStroke(S.bot,  v.botReveal,  "right", BAR_G);

      // Subtle fold shadows at bar/stem junctions — ribbon-depth illusion
      if (v.stemReveal > 0.5) {
        ctx.save();
        ctx.globalAlpha = 0.30;
        ctx.fillStyle = "#000";
        ctx.fillRect(S.stem.x + stemW - 4, S.stem.y, 4, S.stem.h);
        if (v.topReveal > 0.08) ctx.fillRect(S.top.x + stemW, S.top.y + barH - 4, S.top.w - stemW, 4);
        if (v.midReveal > 0.08) ctx.fillRect(S.mid.x + stemW, S.mid.y + barH - 4, S.mid.w - stemW, 4);
        if (v.botReveal > 0.08) ctx.fillRect(S.bot.x + stemW, S.bot.y + barH - 4, S.bot.w - stemW, 4);
        ctx.restore();
      }
    }

    function drawSpectrum() {
      const ry = eY - eH * 0.15;
      const rh = eH * 1.3;

      for (const r of ribbons) {
        const color = `hsl(${r.hue.toFixed(1)},${r.sat.toFixed(0)}%,${r.lit.toFixed(0)}%)`;
        const rx = r.cx - r.w / 2;

        // Core ribbon
        ctx.fillStyle = color;
        ctx.fillRect(rx, ry, r.w, rh);

        // Light-bleed glow (film-strip effect)
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = color;
        ctx.fillRect(rx - r.w * 0.8, ry, r.w * 2.6, rh);
        ctx.restore();
      }
    }

    // ── Render Loop ──────────────────────────────────────────────────────────
    function frame() {
      const zoom = Math.pow(40, v.zoomExp);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-zX, -zY);

      if (v.eAlpha > 0.004) {
        ctx.globalAlpha = v.eAlpha;
        drawE();
        ctx.globalAlpha = 1;
      }

      if (v.specAlpha > 0.004) {
        ctx.globalAlpha = v.specAlpha;
        drawSpectrum();
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      if (v.fadeOut > 0.004) {
        ctx.globalAlpha = v.fadeOut;
        ctx.fillStyle   = "#000";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    }

    const loop = () => { if (!done) { frame(); raf = requestAnimationFrame(loop); } };
    raf = requestAnimationFrame(loop);

    // ── GSAP Timeline ────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => { done = true; cancelAnimationFrame(raf); router.push("/profiles"); },
    });

    // Phase 1 — Stroke Reveal (0 → ~1.5s)
    // Stem wipes upward; bars extend right with slight stagger
    tl.to(v, { stemReveal: 1, duration: 1.0,  ease: "power4.inOut" }, 0);
    tl.to(v, { topReveal:  1, duration: 0.65, ease: "power4.out"   }, 0.28);
    tl.to(v, { botReveal:  1, duration: 0.65, ease: "power4.out"   }, 0.36);
    tl.to(v, { midReveal:  1, duration: 0.65, ease: "power4.out"   }, 0.48);

    // Phase 2 — Kinetic Zoom (1.5 → 4.0s)
    // Exponential: 40^0=1 → 40^1=40 zoom, targeting the left stroke
    tl.to(v, { zoomExp: 1, duration: 2.5, ease: "power2.in" }, 1.5);

    // Phase 3 — Spectrum (2.5 → 4.0s, overlaps zoom)
    // E dissolves as vertical ribbons materialise in its place
    tl.to(v, { specAlpha: 1, duration: 0.9, ease: "power1.out"   }, 2.5);
    tl.to(v, { eAlpha:    0, duration: 1.0, ease: "power1.inOut" }, 2.5);

    // Fade to black (3.8 → 4.5s)
    tl.to(v, { fadeOut: 1, duration: 0.7, ease: "power2.in" }, 3.8);

    return () => { done = true; tl.kill(); cancelAnimationFrame(raf); };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "block" }}
    />
  );
}
