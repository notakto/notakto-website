import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface BaseComponentProps {
	children?: ReactNode;
	className?: string;
}

export interface BaseButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
}

export interface GameLayoutProps extends BaseComponentProps {}

export interface ModalOverlayProps extends BaseComponentProps {}
