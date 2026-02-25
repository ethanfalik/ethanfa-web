"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = Math.imul(s, 1664525) + 1013904223; return (s >>> 0) / 0xffffffff; };
}

export default function Intro() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let done = false;

    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    // ── E Geometry ─────────────────────────────────────────────────────────
    // Match Netflix scale: letter ~38% of screen height, centered
    const eH    = H  * 0.38;
    const eW    = eH * 0.72;
    const eX    = (W - eW) / 2;
    const eY    = (H - eH) / 2;
    const stemW = eW * 0.19;
    const barH  = eH * 0.18;
    const gap   = (eH - 3 * barH) / 2;

    const eCX = W / 2;
    const eCY = H / 2;

    const S = {
      stem: { x: eX, y: eY,              w: stemW,     h: eH   },
      top:  { x: eX, y: eY,              w: eW,        h: barH },
      mid:  { x: eX, y: eY + barH + gap, w: eW * 0.80, h: barH },
      bot:  { x: eX, y: eY + eH - barH,  w: eW,        h: barH },
    };

    // ── Glow off-screen canvas ──────────────────────────────────────────────
    // We draw wide dim copies of each spectrum line here, then blur+composite
    // it onto the main canvas — recreating the soft light-bleed seen in the original
    const glowCvs = document.createElement("canvas");
    glowCvs.width  = W;
    glowCvs.height = H;
    const gCtx = glowCvs.getContext("2d")!;

    // ── Spectrum Lines ──────────────────────────────────────────────────────
    // Defined as a fraction (0..1). Position interpolates from:
    //   packed  = tight column at the E's width (scaled by ZOOM_LOCK)
    //   spread  = full screen width
    const rng       = makeRng(0xABCDEF);
    const N_LINES   = 200;
    const ZOOM_LOCK = 1.85;    // zoom level held during spectrum phase
    const pHalf     = (eW * ZOOM_LOCK) / 2;   // half-width of packed column
    const sHalf     = W * 0.56;               // half-width at full spread

    type SpecLine = { frac: number; w: number; hue: number; sat: number; lit: number };
    const specLines: SpecLine[] = [];

    for (let i = 0; i < N_LINES; i++) {
      const frac = (i + 0.5) / N_LINES;  // 0..1
      const w    = 1.0 + rng() * 2.5;
      // Full visible light spectrum: red (0°) → orange → yellow → green → cyan → blue (240°) → violet (260°)
      const hue  = frac * 260 + (rng() - 0.5) * 12;
      const sat  = 90  + rng() * 10;
      const lit  = 44  + rng() * 24;
      specLines.push({ frac, w, hue, sat, lit });
    }

    function lineX(frac: number, expansion: number) {
      const off = frac - 0.5;   // −0.5 … +0.5
      const x0  = eCX + off * pHalf * 2;   // packed
      const x1  = eCX + off * sHalf * 2;   // spread
      return x0 + (x1 - x0) * expansion;
    }

    // ── Animation state ─────────────────────────────────────────────────────
    const v = {
      stemReveal: 0,
      topReveal:  0,
      midReveal:  0,
      botReveal:  0,
      zoomScale:  1,
      lineAlpha:  0,
      expansion:  0,
      eAlpha:     1,
      fadeOut:    0,
    };

    // ── Draw helpers ────────────────────────────────────────────────────────
    function clipReveal(r: {x:number;y:number;w:number;h:number}, t: number, dir: "up"|"right") {
      ctx.beginPath();
      if (dir === "up") {
        const rh = r.h * t;
        ctx.rect(r.x, r.y + r.h - rh, r.w, rh);
      } else {
        ctx.rect(r.x, r.y, r.w * t, r.h);
      }
      ctx.clip();
    }

    // ── Draw E ──────────────────────────────────────────────────────────────
    // Faithful to the Netflix ribbon: each stroke has a bright "front" face
    // and a dark "depth" face, creating genuine 3D ribbon depth.
    function drawE() {

      // Vertical stem — dark on the LEFT (shadow face), bright on the RIGHT (front face)
      if (v.stemReveal > 0) {
        ctx.save();
        clipReveal(S.stem, v.stemReveal, "up");
        const g = ctx.createLinearGradient(S.stem.x, 0, S.stem.x + S.stem.w, 0);
        g.addColorStop(0,    "#120000");   // shadow face — almost black-red
        g.addColorStop(0.20, "#720000");
        g.addColorStop(0.30, "#E50914");   // sharp transition to bright
        g.addColorStop(0.65, "#FF2828");   // highlight
        g.addColorStop(1.0,  "#C80B0B");
        ctx.fillStyle = g;
        ctx.fillRect(S.stem.x, S.stem.y, S.stem.w, S.stem.h);
        ctx.restore();
      }

      // Horizontal bars — bright on TOP (front face), dark on the BOTTOM (depth face)
      const drawBar = (r: {x:number;y:number;w:number;h:number}, reveal: number) => {
        if (reveal <= 0) return;
        ctx.save();
        clipReveal(r, reveal, "right");
        const g = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
        g.addColorStop(0,    "#FF2424");   // bright top
        g.addColorStop(0.55, "#E50914");
        g.addColorStop(0.78, "#9A0808");   // darkening
        g.addColorStop(0.90, "#600000");
        g.addColorStop(1.0,  "#0E0000");   // shadow face — almost black
        ctx.fillStyle = g;
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.restore();
      };

      drawBar(S.top, v.topReveal);
      drawBar(S.mid, v.midReveal);
      drawBar(S.bot, v.botReveal);

      // Inner junction shadows — where bars meet stem (ribbon fold crease)
      if (v.stemReveal > 0.8) {
        ctx.save();
        const jg = ctx.createLinearGradient(S.stem.x + stemW, 0, S.stem.x + stemW + stemW * 0.6, 0);
        jg.addColorStop(0, "rgba(0,0,0,0.65)");
        jg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = jg;
        if (v.topReveal > 0.05) ctx.fillRect(S.top.x + stemW, S.top.y, stemW * 0.6, S.top.h);
        if (v.midReveal > 0.05) ctx.fillRect(S.mid.x + stemW, S.mid.y, stemW * 0.6, S.mid.h);
        if (v.botReveal > 0.05) ctx.fillRect(S.bot.x + stemW, S.bot.y, stemW * 0.6, S.bot.h);
        ctx.restore();
      }
    }

    // ── Draw Spectrum ───────────────────────────────────────────────────────
    // Two-pass rendering:
    //   Pass 1 → glow canvas: wide semi-transparent ribbons, then blurred+screen-blended
    //   Pass 2 → crisp core: 1-3 px bright lines drawn on top
    function drawSpectrum() {
      const ry  = -H * 0.05;
      const rh  =  H * 1.10;
      const exp = v.expansion;

      // Pass 1: draw wide glows to offscreen canvas
      gCtx.clearRect(0, 0, W, H);
      for (const l of specLines) {
        const sx    = lineX(l.frac, exp);
        const glowW = l.w * 14 + exp * l.w * 20;
        gCtx.fillStyle = `hsl(${l.hue.toFixed(1)},${l.sat.toFixed(0)}%,${l.lit.toFixed(0)}%)`;
        gCtx.fillRect(sx - glowW / 2, ry, glowW, rh);
      }

      // Composite blurred glow (screen = additive light blending)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.filter = `blur(${10 + exp * 6}px)`;
      ctx.drawImage(glowCvs, 0, 0);
      ctx.restore();   // restores compositing & filter

      // Pass 2: crisp bright cores
      for (const l of specLines) {
        const sx     = lineX(l.frac, exp);
        const coreLit = Math.min(92, l.lit + 22);
        ctx.fillStyle = `hsl(${l.hue.toFixed(1)},100%,${coreLit}%)`;
        ctx.fillRect(sx - l.w / 2, ry, l.w, rh);
      }
    }

    // ── Render loop ─────────────────────────────────────────────────────────
    function frame() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // E — zoomed into from its centre
      if (v.eAlpha > 0.004) {
        ctx.save();
        ctx.translate(eCX, eCY);
        ctx.scale(v.zoomScale, v.zoomScale);
        ctx.translate(-eCX, -eCY);
        ctx.globalAlpha = v.eAlpha;
        drawE();
        ctx.restore();
      }

      // Spectrum — always in screen-space (no zoom transform)
      if (v.lineAlpha > 0.004) {
        ctx.globalAlpha = v.lineAlpha;
        drawSpectrum();
        ctx.globalAlpha = 1;
      }

      if (v.fadeOut > 0.004) {
        ctx.globalAlpha = v.fadeOut;
        ctx.fillStyle   = "#000";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    }

    const loop = () => { if (!done) { frame(); raf = requestAnimationFrame(loop); } };
    raf = requestAnimationFrame(loop);

    // ── GSAP Timeline ───────────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => { done = true; cancelAnimationFrame(raf); router.push("/profiles"); },
    });

    // Phase 1 — Ribbon Reveal (0 → 1.4s)
    // Stem wipes upward; bars fold out with stagger — power4.inOut for prestige
    tl.to(v, { stemReveal: 1, duration: 1.0,  ease: "power4.inOut" }, 0);
    tl.to(v, { topReveal:  1, duration: 0.58, ease: "power4.out"   }, 0.27);
    tl.to(v, { botReveal:  1, duration: 0.58, ease: "power4.out"   }, 0.35);
    tl.to(v, { midReveal:  1, duration: 0.58, ease: "power4.out"   }, 0.47);

    // Phase 2 — Kinetic Zoom (1.4 → 2.4s)
    // E scales from 1× to ZOOM_LOCK — fills frame, letter looms large before fragmenting
    tl.to(v, { zoomScale: ZOOM_LOCK, duration: 1.0, ease: "power2.inOut" }, 1.4);

    // Phase 3 — Spectrum (2.1 → 3.8s)
    // Dense column of lines materialise at E's width, then fan out to fill screen.
    // E dissolves simultaneously — letter becomes light.
    tl.to(v, { lineAlpha: 1,  duration: 0.40, ease: "power2.out"   }, 2.1);
    tl.to(v, { expansion: 1,  duration: 1.7,  ease: "power1.inOut" }, 2.1);
    tl.to(v, { eAlpha:    0,  duration: 0.45, ease: "power2.in"    }, 2.15);

    // Fade to black (3.5 → 4.2s)
    tl.to(v, { fadeOut: 1, duration: 0.7, ease: "power2.in" }, 3.5);

    return () => { done = true; tl.kill(); cancelAnimationFrame(raf); };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "block" }}
    />
  );
}
