"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TOAST_DURATION } from "@/constants/toast";
import type { CustomToastContainerProps } from "@/services/types";

export function CustomToastContainer({
	position = "top-center",
	autoClose = TOAST_DURATION,
	hideProgressBar = false,
	newestOnTop = false,
	closeOnClick = false,
	pauseOnFocusLoss = false,
	draggable = true,
	pauseOnHover = true,
	closeButton = false,
	toastClassName,
	...rest
}: CustomToastContainerProps = {}) {
	return (
		<ToastContainer
			position={position}
			autoClose={autoClose}
			hideProgressBar={hideProgressBar}
			newestOnTop={newestOnTop}
			closeOnClick={closeOnClick}
			pauseOnFocusLoss={pauseOnFocusLoss}
			draggable={draggable}
			pauseOnHover={pauseOnHover}
			closeButton={(props) => (
				<button
					type="button"
					onClick={props.closeToast}
					className="absolute top-1 flex items-center justify-center right-1 h-[25px] w-[25px] text-cream font-pixel text-[8px] border border-border-pixel hover:text-pixel-white"
					aria-label="close">
					X
				</button>
			)}
			toastClassName={
				toastClassName ||
				(() =>
					"relative text-[10px] font-pixel text-center w-[calc(100vw-2rem)] max-w-[300px] bg-panel text-cream border-3 border-border-pixel px-4 py-3 shadow-[3px_3px_0_var(--color-bg0)] tracking-wider mb-3")
			}
			className="pb-2"
			{...rest}
		/>
	);
}
