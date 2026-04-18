import type { ToastContainerProps } from "react-toastify";

// Toast components
export interface CustomToastContainerProps
	extends Omit<ToastContainerProps, "toastClassName"> {
	toastClassName?: ToastContainerProps["toastClassName"];
}
