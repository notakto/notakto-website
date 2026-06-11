"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { ToastContainerProps } from "react-toastify";
import { TOAST_DURATION } from "@/features/show-toast-with-cooldown/model/toast";
import ToastCloseButton from "@/widgets/toast-close-button/ui/ToastCloseButton";

interface CustomToastContainerProps
	extends Omit<ToastContainerProps, "toastClassName"> {
	toastClassName?: ToastContainerProps["toastClassName"];
}

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
				<ToastCloseButton closeToast={props.closeToast} />
			)}
			toastClassName={
				toastClassName ||
				(() =>
					"relative mt-10 sm:mt-0 text-[10px] font-pixel text-center w-[calc(100vw-2rem)] max-w-[300px] bg-panel text-cream border-3 border-border-pixel px-4 py-3 shadow-[3px_3px_0_var(--color-bg0)] tracking-wider mb-3")
			}
			className="pb-2"
			{...rest}
		/>
	);
}
