import type { ReactNode } from "react";

interface BaseComponentProps {
	children?: ReactNode;
	className?: string;
}

export interface GameLayoutProps extends BaseComponentProps {}

export interface ModalOverlayProps extends BaseComponentProps {}
