"use client";
import type { ModalOverlayProps } from "@/services/types";

export default function ModalOverlay({ children }: ModalOverlayProps) {
	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
			{children}
		</div>
	);
}
