"use client";

import React, { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  className?: string;
  density?: number; // particles per 10,000px^2
  color?: string;   // CSS color string
  speed?: number;   // base speed scaler
}

// Minimal, isolated canvas particle field. No global CSS; cleans up on unmount.
export function ParticleBackground({
  className = "",
  density = 0.12,
  color = "rgba(255,255,255,0.35)",
  speed = 0.6,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const particleCount = () => Math.max(8, Math.floor((width * height) / 10000 * density));
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

    const initParticles = () => {
      particles = Array.from({ length: particleCount() }, () => ({
        x: rnd(0, width),
        y: rnd(0, height),
        vx: rnd(-0.5, 0.5) * speed,
        vy: rnd(-0.5, 0.5) * speed,
        r: rnd(0.6, 1.6),
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width; else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; else if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    initParticles();
    step();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [color, density, speed]);

  return (
    <div className={["absolute inset-0 pointer-events-none", className].join(" ")}> 
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default ParticleBackground;
