import type { ReactNode } from "react";

export interface StaticPageLayoutProps {
	children: ReactNode;
	title: string;
	subtitle: string;
	maxWidth?: "sm" | "md" | "lg";
	centered?: boolean;
}
