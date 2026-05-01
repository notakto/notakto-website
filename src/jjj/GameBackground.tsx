"use client";
import { motion } from "framer-motion";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useShortcutStore } from "@/services/store";

const particleChars = ["X", "O", "0", "1", "#", "+"];

export const GameBackground: React.FC = () => {
	const [isMounted, setIsMounted] = useState(false);
	const { shortcutsEnabled } = useShortcutStore();
	const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	const [lottieData, setLottieData] = useState<object | null>(null);
	const particleIds = useRef(
		Array.from({ length: 20 }).map((_, i) => `particle-${i}-${Math.random()}`),
	);

	useEffect(() => {
		setIsMounted(true);
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useEffect(() => {
		if (!isMounted) return;
		// Updated to a high-quality gaming transition lottie
		fetch(
			"https://lottie.host/df23145d-9c3f-4e0e-9fd8-8c54c338f0d8/G0zO7I8R3R.json",
		)
			.then((res) => res.json())
			.then((data: object) => setLottieData(data));
	}, [isMounted]);

	const lottieRef = useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		if (lottieRef.current) {
			lottieRef.current.setSpeed(shortcutsEnabled ? 1.5 : 0.5);
		}
	}, [shortcutsEnabled]);

	if (!isMounted) return null;

	return (
		<div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black">
			{/* Lottie Animation Layer */}
			{lottieData && (
				<div
					className="absolute inset-0 opacity-30 transition-all duration-1000"
					style={{
						mixBlendMode: "overlay",
						filter: shortcutsEnabled
							? "hue-rotate(0deg) saturate(1.5)"
							: "hue-rotate(180deg) opacity(0.5)",
					}}>
					<Lottie
						lottieRef={lottieRef}
						animationData={lottieData}
						loop={true}
						style={{ width: "100%", height: "100%" }}
					/>
				</div>
			)}

			{/* Mouse Reactive Particles */}
			<div className="absolute inset-0">
				{particleIds.current.map((id, i) => (
					<Particle i={i} key={id} mousePos={mousePos} />
				))}
			</div>
		</div>
	);
};

const Particle = ({
	i,
	mousePos,
}: {
	i: number;
	mousePos: { x: number; y: number };
}) => {
	const char = particleChars[i % particleChars.length];
	const initialX = useRef(Math.random() * 100);
	const initialY = useRef(Math.random() * 100);

	// Parallax effect based on mouse position
	const moveX =
		(mousePos.x -
			(typeof window !== "undefined" ? window.innerWidth : 1000) / 2) *
		(0.01 + Math.random() * 0.05);
	const moveY =
		(mousePos.y -
			(typeof window !== "undefined" ? window.innerHeight : 800) / 2) *
		(0.01 + Math.random() * 0.05);

	return (
		<motion.div
			className="absolute text-white/5 font-mono select-none"
			style={{
				left: `${initialX.current}%`,
				top: `${initialY.current}%`,
				fontSize: i % 2 === 0 ? "24px" : "48px",
			}}
			animate={{
				x: moveX,
				y: moveY,
				rotate: [0, 360],
			}}
			transition={{
				rotate: {
					duration: 20 + Math.random() * 20,
					repeat: Infinity,
					ease: "linear",
				},
				x: { type: "spring", damping: 20 },
				y: { type: "spring", damping: 20 },
			}}>
			{char}
		</motion.div>
	);
};
