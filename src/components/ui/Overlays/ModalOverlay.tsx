"use client";
import type { ReactNode } from "react";

interface ModalOverlayProps {
	children: ReactNode;
}

export default function ModalOverlay({ children }: ModalOverlayProps) {
	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
			{children}
		</div>
	);
}
