"use client";

import type React from "react";
import { useUser } from "@/features/authenticate-user/model/userStore";
import AuthLoadingScreen from "@/widgets/auth-loading-screen/ui/AuthLoadingScreen";

interface AuthLoadingBoundaryProps {
	children: React.ReactNode;
}

export default function AuthLoadingBoundary({
	children,
}: AuthLoadingBoundaryProps) {
	const authReady = useUser((state) => state.authReady);
	const isAuthLoading = !authReady;

	return (
		<>
			<div inert={isAuthLoading} aria-busy={isAuthLoading}>
				{children}
			</div>
			<AuthLoadingScreen visible={isAuthLoading} />
		</>
	);
}
