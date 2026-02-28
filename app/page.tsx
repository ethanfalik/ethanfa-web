"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

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

    // ── N Geometry ──────────────────────────────────────────────────────────
    // Netflix N: ~65% of screen height, centered. Width/height ratio matches
    // the .pen keyframes (180px wide × 300px tall = 0.60 aspect ratio).
    const nH  = H * 0.65;
    const nW  = nH * 0.60;
    const nX  = (W - nW) / 2;
    const nY  = (H - nH) / 2;
    const sw  = nW * 0.278;   // stroke width  ≈ 50/180 of total N width
    const nCX = W / 2;
    const nCY = H / 2;

    // ── Left stroke — wipes upward (t = 0 → 1) ──────────────────────────────
    // Dark shadow face on the left, bright front face in the center-right.
    function drawLeft(t: number) {
      if (t <= 0) return;
      const revealH = nH * t;
      ctx.save();
      ctx.beginPath();
      ctx.rect(nX, nY + nH - revealH, sw, revealH);
      ctx.clip();
      const g = ctx.createLinearGradient(nX, 0, nX + sw, 0);
      g.addColorStop(0,    "#060000");
      g.addColorStop(0.14, "#4A0000");
      g.addColorStop(0.30, "#B80710");
      g.addColorStop(0.58, "#E50914");
      g.addColorStop(0.78, "#FF2222");
      g.addColorStop(1.0,  "#C80C0C");
      ctx.fillStyle = g;
      ctx.fillRect(nX, nY, sw, nH);
      ctx.restore();
    }

    // ── Diagonal — sweeps top → bottom (t = 0 → 1) ──────────────────────────
    // Parallelogram: TL=(nX,nY)  TR=(nX+sw,nY)  BR=(nX+nW,nY+nH)  BL=(nX+nW−sw,nY+nH)
    function drawDiag(t: number) {
      if (t <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, nY, W, nH * t + sw * 0.4);
      ctx.clip();

      // Horizontal gradient: dark fold on left (meets left stroke) → bright face → darker right edge
      const g = ctx.createLinearGradient(nX, 0, nX + nW, 0);
      g.addColorStop(0,    "#1A0000");
      g.addColorStop(0.12, "#8A0808");
      g.addColorStop(0.28, "#E50914");
      g.addColorStop(0.62, "#C80810");
      g.addColorStop(0.85, "#8A0000");
      g.addColorStop(1.0,  "#4A0000");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(nX,           nY);
      ctx.lineTo(nX + sw,      nY);
      ctx.lineTo(nX + nW,      nY + nH);
      ctx.lineTo(nX + nW - sw, nY + nH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // ── Right stroke — wipes upward from bottom (t = 0 → 1) ─────────────────
    // Grows from where the diagonal lands (base of N) up to full height.
    function drawRight(t: number) {
      if (t <= 0) return;
      const rx = nX + nW - sw;
      const revealH = nH * t;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, nY + nH - revealH, sw, revealH);
      ctx.clip();
      const g = ctx.createLinearGradient(rx, 0, rx + sw, 0);
      g.addColorStop(0,    "#FF2222");
      g.addColorStop(0.28, "#E50914");
      g.addColorStop(0.55, "#C00810");
      g.addColorStop(0.80, "#6E0000");
      g.addColorStop(1.0,  "#060000");
      ctx.fillStyle = g;
      ctx.fillRect(rx, nY, sw, nH);
      ctx.restore();
    }

    // ── Crease shadow where diagonal folds away from left stroke ─────────────
    function drawCrease(alpha: number) {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha * 0.75;
      const cg = ctx.createLinearGradient(nX + sw, 0, nX + sw + sw * 0.5, 0);
      cg.addColorStop(0, "rgba(0,0,0,0.9)");
      cg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(nX + sw, nY, sw * 0.5, nH);
      ctx.restore();
    }

    // ── Ambient glow (screen-blended red bloom) ──────────────────────────────
    function drawGlow(intensity: number) {
      if (intensity <= 0) return;
      ctx.save();
      ctx.globalAlpha = intensity * 0.55;
      ctx.globalCompositeOperation = "screen";
      const gr = ctx.createRadialGradient(nCX, nCY, 0, nCX, nCY, nW * 1.3);
      gr.addColorStop(0,    "rgba(229,9,20,0.85)");
      gr.addColorStop(0.35, "rgba(229,9,20,0.35)");
      gr.addColorStop(0.70, "rgba(229,9,20,0.08)");
      gr.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // ── Animation state ──────────────────────────────────────────────────────
    const v = {
      leftReveal:  0,
      diagReveal:  0,
      rightReveal: 0,
      creaseAlpha: 0,
      glowLevel:   0,
      zoom:        1,
      fadeOut:     0,
    };

    // ── Render loop ──────────────────────────────────────────────────────────
    function frame() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(nCX, nCY);
      ctx.scale(v.zoom, v.zoom);
      ctx.translate(-nCX, -nCY);

      // Draw order: glow behind N, then strokes on top, crease last
      drawGlow(v.glowLevel);
      drawDiag(v.diagReveal);
      drawLeft(v.leftReveal);
      drawRight(v.rightReveal);
      drawCrease(v.creaseAlpha);

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

    // Phase 1 — Left stroke rises from below (0 → 0.65s)
    tl.to(v, { leftReveal: 1, duration: 0.65, ease: "power3.inOut" }, 0);

    // Phase 2 — Diagonal sweeps down (0.15s), right stroke grows up from base (0.45s)
    tl.to(v, { diagReveal:  1, duration: 0.80, ease: "power2.inOut" }, 0.15);
    tl.to(v, { rightReveal: 1, duration: 0.65, ease: "power3.out"   }, 0.45);

    // Crease shadow locks in as strokes meet
    tl.to(v, { creaseAlpha: 1, duration: 0.30, ease: "power2.out" }, 0.55);

    // Phase 3 — Glow builds as N completes (0.85 → 1.45s)
    tl.to(v, { glowLevel: 1, duration: 0.60, ease: "power2.out" }, 0.85);

    // Phase 4 — Single slow cinematic push-in, carries through the fade
    tl.to(v, { zoom: 1.06, duration: 2.10, ease: "power1.inOut" }, 0.90);

    // Phase 5 — Fade to black (2.10 → 2.80s)
    tl.to(v, { fadeOut: 1, duration: 0.70, ease: "power2.in" }, 2.10);

    return () => { done = true; tl.kill(); cancelAnimationFrame(raf); };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "block" }}
    />
  );
}
