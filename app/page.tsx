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

    // ── E Geometry ────────────────────────────────────────────────────────
    // Netflix proportions: bold, condensed, 68% of screen height
    const eH    = H  * 0.68;
    const eW    = eH * 0.68;
    const eX    = (W - eW) / 2;
    const eY    = (H - eH) / 2;
    const stemW = eW * 0.19;
    const barH  = eH * 0.18;
    const gap   = (eH - 3 * barH) / 2;

    const S = {
      stem: { x: eX, y: eY,              w: stemW,     h: eH   },
      top:  { x: eX, y: eY,              w: eW,        h: barH },
      mid:  { x: eX, y: eY + barH + gap, w: eW * 0.80, h: barH },
      bot:  { x: eX, y: eY + eH - barH,  w: eW,        h: barH },
    };

    // Zoom target: centre of left vertical stem
    const zX = eX + stemW / 2;
    const zY = eY + eH / 2;

    // ── Film Grain Texture (pre-computed once, 256×256) ───────────────────
    const GRAIN = 256;
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = grainCanvas.height = GRAIN;
    const gc = grainCanvas.getContext("2d")!;
    const gd = gc.getImageData(0, 0, GRAIN, GRAIN);
    for (let i = 0; i < gd.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v;
      gd.data[i + 3] = (Math.random() * 38 + 8) | 0; // alpha 8-46, very subtle
    }
    gc.putImageData(gd, 0, 0);

    // ── Spectrum Ribbons (screen-space for parallax tunnel) ───────────────
    // Palette: Netflix red at center → cyan / magenta / violet / gold at edges
    const PALETTE: [number, number, number][] = [
      [185, 85, 55], // cyan
      [300, 85, 60], // magenta
      [270, 80, 55], // violet
      [45,  90, 58], // gold
      [335, 80, 50], // pink-red
      [200, 80, 50], // teal-blue
      [15,  88, 50], // orange-red
    ];

    const rng = makeRng(0xDEADBEEF);
    type Ribbon = { dx: number; w: number; h: number; s: number; l: number; speed: number };
    const ribbons: Ribbon[] = [];

    for (let i = 0; i < 55; i++) {
      const t      = i / 55;
      const dx     = (t - 0.5) * W * 1.2 + (rng() - 0.5) * (W * 1.2 / 55) * 0.7;
      const w      = H * (0.004 + rng() * 0.030);
      const absDist = Math.abs(dx) / (W * 0.6);

      let h: number, s: number, l: number;
      if (absDist < 0.28) {
        // Deep red near zoom centre (matches the stem colour)
        h = 0; s = 92 + rng() * 8; l = 28 + rng() * 22;
      } else {
        const c = PALETTE[Math.floor(rng() * PALETTE.length)];
        h = c[0] + (rng() - 0.5) * 25;
        s = c[1] + (rng() - 0.5) * 12;
        l = c[2] + (rng() - 0.5) * 12;
      }

      // Outer ribbons move faster → they're "closer to camera" in the tunnel
      const speed = 0.22 + absDist * 2.2 + rng() * 0.35;
      ribbons.push({ dx, w, h, s, l, speed });
    }
    // Draw slow (background) ribbons first so fast (foreground) ones paint on top
    ribbons.sort((a, b) => a.speed - b.speed);

    // ── Animation State ───────────────────────────────────────────────────
    const v = {
      stemReveal: 0,
      topReveal:  0,
      midReveal:  0,
      botReveal:  0,
      zoomExp:    0,    // 0→1; zoom = 35^zoomExp (expo feel)
      specAlpha:  0,    // ribbon fade-in
      specExpand: 0,    // 0→1; drives ribbon parallax spread
      eAlpha:     1,
      motionBlur: 0,    // 0 = hard clear, 1 = ghosty trail (motion blur)
      fadeOut:    0,
    };

    // ── Stroke Reveal ─────────────────────────────────────────────────────
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

    function drawStroke(r: {x:number;y:number;w:number;h:number}, reveal: number, dir: "up"|"right", grad: CanvasGradient) {
      if (reveal <= 0) return;
      ctx.save();
      clipReveal(r, reveal, dir);
      ctx.fillStyle = grad;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.restore();
    }

    function drawE() {
      // Stem: horizontal gradient (bright left → dark right = ribbon-fold illusion)
      const stemG = ctx.createLinearGradient(S.stem.x, 0, S.stem.x + S.stem.w, 0);
      stemG.addColorStop(0, "#FF2828");
      stemG.addColorStop(0.4, "#E50914");
      stemG.addColorStop(1, "#7A0000");
      drawStroke(S.stem, v.stemReveal, "up", stemG);

      // Bars: vertical gradient (bright top → dark bottom = top-lit ribbon shelf)
      const barGrad = (r: {x:number;y:number;w:number;h:number}) => {
        const g = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
        g.addColorStop(0, "#FF1A1A");
        g.addColorStop(0.5, "#E50914");
        g.addColorStop(1, "#8B0000");
        return g;
      };
      drawStroke(S.top, v.topReveal, "right", barGrad(S.top));
      drawStroke(S.mid, v.midReveal, "right", barGrad(S.mid));
      drawStroke(S.bot, v.botReveal, "right", barGrad(S.bot));

      // ── Fold shadows: 3D ribbon depth at junctions ─────────────────────
      if (v.stemReveal > 0.5) {
        ctx.save();
        // Crease at right edge of stem (where bars attach — the fold point)
        const crG = ctx.createLinearGradient(S.stem.x + stemW - 12, 0, S.stem.x + stemW, 0);
        crG.addColorStop(0, "rgba(0,0,0,0)");
        crG.addColorStop(1, "rgba(0,0,0,0.72)");
        ctx.fillStyle = crG;
        ctx.fillRect(S.stem.x + stemW - 12, S.stem.y, 12, S.stem.h);

        // Bottom-edge crease on each bar (shadow under the fold)
        ctx.globalAlpha = 0.35;
        const barCrease = (r: {x:number;y:number;w:number;h:number}) => {
          const g = ctx.createLinearGradient(0, r.y + r.h - 10, 0, r.y + r.h);
          g.addColorStop(0, "rgba(0,0,0,0)");
          g.addColorStop(1, "rgba(0,0,0,0.88)");
          return g;
        };
        if (v.topReveal > 0.1) { ctx.fillStyle = barCrease(S.top); ctx.fillRect(S.top.x + stemW, S.top.y, S.top.w - stemW, S.top.h); }
        if (v.midReveal > 0.1) { ctx.fillStyle = barCrease(S.mid); ctx.fillRect(S.mid.x + stemW, S.mid.y, S.mid.w - stemW, S.mid.h); }
        if (v.botReveal > 0.1) { ctx.fillStyle = barCrease(S.bot); ctx.fillRect(S.bot.x + stemW, S.bot.y, S.bot.w - stemW, S.bot.h); }
        ctx.restore();
      }
    }

    // ── Spectrum Ribbons ──────────────────────────────────────────────────
    function drawSpectrum() {
      const expansion = v.specExpand * 2.8;
      const ry = -H * 0.1;
      const rh = H  * 1.2;

      for (const r of ribbons) {
        // Parallax: outer (fast) ribbons fly past faster than inner (slow) ones
        const sx = W / 2 + r.dx * (1 + expansion * r.speed);
        const sw = r.w  * (1 + expansion * r.speed * 0.25);
        const color = `hsl(${r.h.toFixed(1)},${r.s.toFixed(0)}%,${r.l.toFixed(0)}%)`;

        // Core ribbon
        ctx.fillStyle = color;
        ctx.fillRect(sx - sw / 2, ry, sw, rh);

        // Light-bleed glow via screen blend (film-strip luminance effect)
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = color;
        ctx.fillRect(sx - sw * 1.8, ry, sw * 3.6, rh);
        ctx.restore();
      }
    }

    // ── Cinematic Overlays ────────────────────────────────────────────────
    function drawVignette() {
      const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.82);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.72)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    function drawGrain(alpha: number) {
      if (alpha < 0.05) return;
      ctx.save();
      ctx.globalAlpha = alpha * 0.35;
      ctx.globalCompositeOperation = "overlay";
      // Tile the pre-computed grain with a random offset each frame
      const ox = (Math.random() * GRAIN) | 0;
      const oy = (Math.random() * GRAIN) | 0;
      for (let x = -ox; x < W; x += GRAIN)
        for (let y = -oy; y < H; y += GRAIN)
          ctx.drawImage(grainCanvas, x, y);
      ctx.restore();
    }

    // ── Render ────────────────────────────────────────────────────────────
    function frame() {
      const zoom = Math.pow(35, v.zoomExp);

      // Motion blur: reduce clear opacity as zoom accelerates, creating speed trails
      const clearAlpha = 1 - v.motionBlur * 0.62;
      ctx.fillStyle = `rgba(0,0,0,${clearAlpha.toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);

      // E — in world space under the zoom transform
      if (v.eAlpha > 0.004) {
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-zX, -zY);
        ctx.globalAlpha = v.eAlpha;
        drawE();
        ctx.restore();
      }

      // Spectrum — in screen space (no zoom transform) for true parallax depth
      if (v.specAlpha > 0.004) {
        ctx.globalAlpha = v.specAlpha;
        drawSpectrum();
        ctx.globalAlpha = 1;
      }

      drawVignette();
      drawGrain(0.22 + v.specAlpha * 0.42);

      if (v.fadeOut > 0.004) {
        ctx.globalAlpha = v.fadeOut;
        ctx.fillStyle   = "#000";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    }

    const loop = () => { if (!done) { frame(); raf = requestAnimationFrame(loop); } };
    raf = requestAnimationFrame(loop);

    // ── GSAP Timeline ─────────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => { done = true; cancelAnimationFrame(raf); router.push("/profiles"); },
    });

    // Phase 1 — Ribbon Reveal (0 → 1.2s)
    // Stem wipes upward; bars fold out from the stem with staggered timing
    tl.to(v, { stemReveal: 1, duration: 1.0,  ease: "power4.inOut" }, 0);
    tl.to(v, { topReveal:  1, duration: 0.62, ease: "power4.out"   }, 0.24);
    tl.to(v, { botReveal:  1, duration: 0.62, ease: "power4.out"   }, 0.33);
    tl.to(v, { midReveal:  1, duration: 0.62, ease: "power4.out"   }, 0.46);

    // Phase 2 — Kinetic Zoom (1.2 → 2.7s)
    // expo.in: barely moves then slams forward — camera lunges into the stem
    tl.to(v, { zoomExp:    1, duration: 1.5, ease: "expo.in"   }, 1.2);
    tl.to(v, { motionBlur: 1, duration: 0.9, ease: "power2.in" }, 1.3);

    // Phase 3 — Light Spectrum (2.2 → 4.0s, overlaps zoom)
    // Ribbons materialise in screen-space; E dissolves; ribbons tunnel outward
    tl.to(v, { specAlpha:  1, duration: 0.7, ease: "power2.out"   }, 2.2);
    tl.to(v, { specExpand: 1, duration: 1.8, ease: "power1.inOut" }, 2.2);
    tl.to(v, { eAlpha:     0, duration: 0.8, ease: "power2.in"    }, 2.2);
    tl.to(v, { motionBlur: 0, duration: 0.6, ease: "power1.out"   }, 2.8);

    // Fade to black (3.6 → 4.3s)
    tl.to(v, { fadeOut: 1, duration: 0.7, ease: "power2.in" }, 3.6);

    return () => { done = true; tl.kill(); cancelAnimationFrame(raf); };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "block" }}
    />
  );
}
