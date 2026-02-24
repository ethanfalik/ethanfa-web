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
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => router.push("/profiles"),
    });

    gsap.set(textRef.current, { opacity: 0, y: 12 });
    gsap.set(flashRef.current, { opacity: 0, scale: 0.4 });
    gsap.set(scanRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(ringRef.current, { opacity: 0, scale: 0.1 });

    tl
      // Flash
      .to(flashRef.current, { opacity: 1, scale: 1.2, duration: 0.15, ease: "power4.out" }, 0.3)
      .to(flashRef.current, { opacity: 0, scale: 4, duration: 0.5, ease: "power2.out" }, 0.38)

      // Text appears
      .to(textRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.36)

      // Scan line
      .to(scanRef.current, { scaleX: 1, duration: 0.5, ease: "power1.inOut" }, 0.65)

      // Single clean ring expands
      .to(ringRef.current, { opacity: 0.5, scale: 1.8, duration: 0.7, ease: "power2.out" }, 0.72)
      .to(ringRef.current, { opacity: 0, duration: 0.5, ease: "power1.in" }, 1.2)

      // Glow peak
      .to(textRef.current, {
        textShadow: "0 0 40px rgba(229,9,20,0.8), 0 0 80px rgba(229,9,20,0.3)",
        duration: 0.3,
      }, 0.8)

      // Hold then fade
      .to({}, { duration: 0.4 })
      .to(containerRef.current, { opacity: 0, duration: 0.5, ease: "power2.inOut" });

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
      {/* Flash */}
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(229,9,20,0.6) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Single expanding ring */}
      <div
        ref={ringRef}
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          border: "1.5px solid #E50914",
          pointerEvents: "none",
        }}
      />

      {/* Text + scan */}
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
            textShadow: "0 0 20px rgba(229,9,20,0.2)",
          }}
        >
          ethan
        </h1>

        <div
          ref={scanRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
