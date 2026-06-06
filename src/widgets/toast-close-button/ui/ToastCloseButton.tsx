interface ToastCloseButtonProps {
	closeToast?: () => void;
}

export default function ToastCloseButton({
	closeToast,
}: ToastCloseButtonProps) {
	return (
		<button
			type="button"
			onClick={closeToast}
			className="absolute top-1 flex items-center justify-center right-1 h-[25px] w-[25px] text-cream font-pixel text-[8px] border border-border-pixel hover:text-pixel-white"
			aria-label="close">
			X
		</button>
	);
}
