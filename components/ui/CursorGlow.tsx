"use strict";

"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const moveGlow = (e: MouseEvent) => {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("mousemove", moveGlow);
    return () => {
      window.removeEventListener("mousemove", moveGlow);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      id="cursor-glow"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: "translate3d(-50%, -50%, 0)",
        willChange: "transform",
      }}
    />
  );
}
