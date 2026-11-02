"use client";

import type { ReactNode } from "react";

interface ModalOverlayProps {
	children?: ReactNode;
}

export default function ModalOverlay({ children }: ModalOverlayProps) {
	return (
		<div className="fixed inset-0 bg-slate-950/85 flex items-center justify-center z-50">
			{children}
		</div>
	);
}
