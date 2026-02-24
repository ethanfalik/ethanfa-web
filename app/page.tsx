"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function Intro() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const arc1Ref = useRef<HTMLDivElement>(null);
  const arc2Ref = useRef<HTMLDivElement>(null);
  const arc3Ref = useRef<HTMLDivElement>(null);
  const arc4Ref = useRef<HTMLDivElement>(null);
  const arc5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => router.push("/profiles"),
    });

    // Initial state — everything hidden
    gsap.set(textRef.current, { opacity: 0, y: 15, scale: 1.08 });
    gsap.set(flashRef.current, { opacity: 0, scale: 0.3 });
    gsap.set(scanRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(
      [
        arc1Ref.current,
        arc2Ref.current,
        arc3Ref.current,
        arc4Ref.current,
        arc5Ref.current,
      ],
      { opacity: 0, scale: 0.05 }
    );

    tl
      // Phase 1: white/red flash from center
      .to(
        flashRef.current,
        { opacity: 1, scale: 1.5, duration: 0.18, ease: "power4.out" },
        0.35
      )
      .to(
        flashRef.current,
        { opacity: 0, scale: 5, duration: 0.55, ease: "power2.out" },
        0.45
      )

      // Phase 2: "ethan" text materialises
      .to(
        textRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
        0.42
      )

      // Phase 3: scan line sweeps across
      .to(
        scanRef.current,
        { scaleX: 1, duration: 0.55, ease: "power1.inOut" },
        0.72
      )

      // Phase 4: sound-wave arcs pulse outward (staggered)
      .to(
        arc1Ref.current,
        { opacity: 0.7, scale: 1.2, duration: 0.6, ease: "power2.out" },
        0.7
      )
      .to(arc1Ref.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.1)
      .to(
        arc2Ref.current,
        { opacity: 0.55, scale: 2.0, duration: 0.65, ease: "power2.out" },
        0.82
      )
      .to(arc2Ref.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.25)
      .to(
        arc3Ref.current,
        { opacity: 0.45, scale: 3.0, duration: 0.7, ease: "power2.out" },
        0.96
      )
      .to(arc3Ref.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.42)
      .to(
        arc4Ref.current,
        { opacity: 0.3, scale: 4.5, duration: 0.75, ease: "power2.out" },
        1.08
      )
      .to(arc4Ref.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.58)
      .to(
        arc5Ref.current,
        { opacity: 0.2, scale: 6.5, duration: 0.8, ease: "power2.out" },
        1.2
      )
      .to(arc5Ref.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.72)

      // Phase 5: text glow peak
      .to(
        textRef.current,
        {
          textShadow:
            "0 0 50px rgba(229,9,20,0.95), 0 0 100px rgba(229,9,20,0.6), 0 0 180px rgba(229,9,20,0.25)",
          duration: 0.35,
        },
        0.85
      )

      // Phase 6: hold, then fade to black
      .to({}, { duration: 0.45 })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.55,
        ease: "power2.inOut",
      });

    return () => {
      tl.kill();
    };
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
      {/* Flash burst */}
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(229,9,20,0.75) 38%, transparent 68%)",
          pointerEvents: "none",
        }}
      />

      {/* Sound wave arcs — same base size, scaled by GSAP */}
      <div
        ref={arc1Ref}
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "2.5px solid #E50914",
          pointerEvents: "none",
        }}
      />
      <div
        ref={arc2Ref}
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "2px solid #FF5E00",
          pointerEvents: "none",
        }}
      />
      <div
        ref={arc3Ref}
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "2px solid #FFB800",
          pointerEvents: "none",
        }}
      />
      <div
        ref={arc4Ref}
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,100,150,0.8)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={arc5Ref}
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.4)",
          pointerEvents: "none",
        }}
      />

      {/* Main text + scan line */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <h1
          ref={textRef}
          style={{
            fontSize: "clamp(90px, 16vw, 240px)",
            fontWeight: 900,
            color: "#E50914",
            fontFamily: "'Bebas Neue', Impact, 'Arial Black', sans-serif",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            userSelect: "none",
            textShadow: "0 0 30px rgba(229,9,20,0.35)",
          }}
        >
          ethan
        </h1>

        {/* Scan shimmer line */}
        <div
          ref={scanRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
