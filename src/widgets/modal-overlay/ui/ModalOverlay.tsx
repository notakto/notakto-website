"use client";

import type { ReactNode } from "react";

interface ModalOverlayProps {
	children?: ReactNode;
	className?: string;
}

export default function ModalOverlay({
	children,
	className = "z-50",
}: ModalOverlayProps) {
	return (
		<div
			className={`fixed inset-0 bg-bg0/85 flex items-center justify-center ${className}`}>
			{children}
		</div>
	);
}
