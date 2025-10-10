"use client";

import type { AnimatedTitleProps } from "@/services/types";

// Simple, self-contained animated title with Tailwind-friendly classes.
// No global CSS or side effects to keep this PR atomic and easy to revert.
export function AnimatedTitle({
	text,
	className = "",
	textClassName = "",
}: AnimatedTitleProps) {
	return (
		<h1
			aria-label={text}
			className={[
				"select-none text-6xl md:text-7xl lg:text-8xl tracking-widest",
				"text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]",
				"relative inline-block",
				// subtle glow pulse
				"animate-[titleGlow_2.5s_ease-in-out_infinite]",
				className,
			].join(" ")}>
			{/* Foreground text */}
			<span className={["relative z-10", textClassName].join(" ")}>{text}</span>
			{/* Soft glow layers (pure CSS, no images) */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 blur-[6px] opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),transparent_60%)]"
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 blur-[18px] opacity-25 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),transparent_70%)]"
			/>
			<style jsx>{`
        @keyframes titleGlow {
          0%,
          100% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.4)); }
          50% { filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.85)); }
        }
      `}</style>
		</h1>
	);
}

export default AnimatedTitle;
