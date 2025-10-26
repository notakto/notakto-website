"use client";

import { useEffect, useState } from "react";

export function usePersistentState<T>(
	key: string,
	defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(() => {
		if (typeof window === "undefined") {
			return defaultValue;
		}
		try {
			const stickyValue = window.localStorage.getItem(key);
			return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
		} catch {
			return defaultValue;
		}
	});

	useEffect(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error setting localStorage key “${key}”:`, error);
		}
	}, [key, value]);

	return [value, setValue];
}