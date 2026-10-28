"use client";

import type { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { onAuthStateChangedListener } from "@/features/authenticate-user/api/firebase";

export function useAuthToken() {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);

	useEffect(() => {
		return onAuthStateChangedListener((nextUser) => {
			setUser(nextUser);
			setIsAuthLoading(false);
		});
	}, []);

	const getIdToken = useCallback(async (): Promise<string> => {
		if (!user) {
			throw new Error("User is not authenticated");
		}

		return user.getIdToken();
	}, [user]);

	return {
		user,
		userId: user?.uid,
		isAuthLoading,
		isAuthenticated: Boolean(user),
		getIdToken,
	};
}
