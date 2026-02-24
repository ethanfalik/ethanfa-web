"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const MAX_STRANDS = 18;

// Deterministic strand palette — all reds with variation
const STRAND_COLORS = [
  "#FF3333", "#E50914", "#CC0011", "#FF5533", "#DD1122",
  "#BB0808", "#FF4422", "#EE2222", "#AA0000", "#FF6644",
  "#CC2200", "#FF2244", "#DD0000", "#EE4433", "#FF4400",
  "#CC1100", "#EE1111", "#DD3322",
];

// Pre-computed, deterministic per-strand properties
const STRANDS = Array.from({ length: MAX_STRANDS }, (_, i) => ({
  color: STRAND_COLORS[i],
  // Slight non-uniform jitter for organic spacing, no Math.random
  frac: (i / (MAX_STRANDS - 1) - 0.5) * (1 + Math.sin(i * 2.1) * 0.1),
  widthMult: 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7)),
}));

export default function Intro() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // E geometry — large, centered
    const eH = H * 0.60;
    const eW = eH * 0.52;
    const T  = cy - eH / 2;
    const B  = cy + eH / 2;
    const L  = cx - eW / 2;
    const R  = cx + eW / 2;
    const M  = cy;
    const MR = L + eW * 0.70; // middle bar is shorter

    // Stroke segments in natural draw order
    const SEGS: [number, number, number, number][] = [
      [L, T, L, B],   // ① vertical bar (top → bottom)
      [L, T, R, T],   // ② top bar
      [L, M, MR, M],  // ③ middle bar
      [L, B, R, B],   // ④ bottom bar
    ];

    const SEG_LENS  = SEGS.map(([x1,y1,x2,y2]) => Math.hypot(x2-x1, y2-y1));
    const TOTAL_LEN = SEG_LENS.reduce((a, b) => a + b, 0);
    const SEG_FRACS = SEG_LENS.map(l => l / TOTAL_LEN);

    // All animated values live in one plain object — GSAP tweens them directly
    const v = {
      drawT:   0,   // 0 = nothing, 1 = E fully drawn
      zoom:    1,
      strandN: 1,   // active strand count
      spread:  0,   // perpendicular strand spread (logical px)
      strokeW: 52,  // base stroke width shared across strands
      fade:    0,   // black overlay (0 = clear, 1 = black)
    };

    function frame() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      if (v.drawT > 0) {
        ctx.save();

        // Zoom centered on the E
        ctx.translate(cx, cy);
        ctx.scale(v.zoom, v.zoom);
        ctx.translate(-cx, -cy);

        const n     = Math.max(1, Math.round(v.strandN));
        const baseW = Math.max(0.8, v.strokeW / n);

        for (let i = 0; i < n; i++) {
          const strand = STRANDS[i % MAX_STRANDS];
          const offset = (n === 1 ? 0 : strand.frac) * v.spread;
          const lw     = baseW * (n === 1 ? 1 : strand.widthMult);

          ctx.strokeStyle = n === 1 ? "#E50914" : strand.color;
          ctx.lineWidth   = lw;
          ctx.lineCap     = "round";

          let rem = v.drawT;
          for (let seg = 0; seg < SEGS.length; seg++) {
            if (rem <= 0) break;
            const frac = SEG_FRACS[seg];
            const t    = Math.min(1, rem / frac);
            rem -= frac;

            const [x1, y1, x2, y2] = SEGS[seg];
            const len = Math.hypot(x2 - x1, y2 - y1);
            // Perpendicular unit vector for strand offset
            const px = -(y2 - y1) / len;
            const py =  (x2 - x1) / len;

            ctx.beginPath();
            ctx.moveTo(x1 + px * offset,              y1 + py * offset);
            ctx.lineTo(x1 + (x2-x1)*t + px * offset, y1 + (y2-y1)*t + py * offset);
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // Fade-to-black overlay
      if (v.fade > 0) {
        ctx.fillStyle = `rgba(0,0,0,${v.fade})`;
        ctx.fillRect(0, 0, W, H);
      }
    }

    let raf: number;
    const loop = () => { frame(); raf = requestAnimationFrame(loop); };
    loop();

    const tl = gsap.timeline({
      onComplete: () => { cancelAnimationFrame(raf); router.push("/profiles"); },
    });

    // ── Phase 1: Draw the E quickly ──────────────────────────────
    tl.to(v, { drawT: 1, duration: 0.52, ease: "power2.inOut" }, 0.25);

    // ── Phase 2: Un-draw + zoom in + strands multiply ────────────
    // drawT uses power4.in: stays near 1 for most of the phase,
    // then retracts fast at the very end — so strands are visible
    // up close for a long time before disappearing
    tl.to(v, {
      drawT: 0,
      duration: 2.3,
      ease: "power4.in",
    }, 0.95);

    tl.to(v, {
      zoom:    28,
      strandN: MAX_STRANDS,
      spread:  36,
      strokeW: 7,
      duration: 2.3,
      ease: "power2.in",
    }, 0.95);

    // ── Phase 3: Fade to black (overlaps with end of phase 2) ────
    tl.to(v, { fade: 1, duration: 0.55, ease: "power2.in" }, 2.65);

    return () => { tl.kill(); cancelAnimationFrame(raf); };
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
