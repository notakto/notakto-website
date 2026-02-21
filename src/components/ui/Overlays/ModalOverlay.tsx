"use client";
import type { ModalOverlayProps } from "@/services/types";

export default function ModalOverlay({ children }: ModalOverlayProps) {
	return (
		<div className="fixed inset-0 bg-bg0/85 flex items-center justify-center z-50">
			{children}
		</div>
	);
}
