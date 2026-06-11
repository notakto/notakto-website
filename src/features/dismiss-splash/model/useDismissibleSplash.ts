"use client";

import { useEffect, useState } from "react";
import { useSplash } from "@/features/dismiss-splash/model/splashStore";

export function useDismissibleSplash() {
	const { hasSeenSplash, setHasSeenSplash } = useSplash();
	const [phase, setPhase] = useState(0);
	const [visible, setVisible] = useState(!hasSeenSplash);

	useEffect(() => {
		if (hasSeenSplash) {
			setVisible(false);
			return;
		}

		const bootTimer = setTimeout(() => setPhase(1), 800);
		const titleTimer = setTimeout(() => setPhase(2), 2200);
		const promptTimer = setTimeout(() => setPhase(3), 3400);

		return () => {
			clearTimeout(bootTimer);
			clearTimeout(titleTimer);
			clearTimeout(promptTimer);
		};
	}, [hasSeenSplash]);

	const dismiss = () => {
		setHasSeenSplash(true);
		setVisible(false);
	};

	return { visible, phase, onDismiss: dismiss };
}
