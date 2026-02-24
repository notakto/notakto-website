import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import type { ConfirmationModalProps } from "@/services/types";

const ConfirmationModal = ({
	visible,
	title,
	message,
	onConfirm,
	onCancel,
	confirmText = "Confirm",
	cancelText = "Cancel",
}: ConfirmationModalProps) => {
	if (!visible) return null;

	return (
		<ModalOverlay>
			<div className="bg-panel pixel-border w-[95%] md:w-full max-w-md p-4 md:p-6">
				<h1 className="text-primary font-pixel uppercase tracking-widest text-sm mb-2 text-center">
					{title}
				</h1>
				<p className="my-6 text-center text-[9px] font-pixel text-cream">
					{message}
				</p>
				<div className="flex justify-center gap-4">
					<button
						type="button"
						className="bg-primary hover:bg-primary-hover text-cream px-8 py-2 text-[9px] font-pixel uppercase tracking-wider w-full mt-4 border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer"
						onClick={onConfirm}>
						{confirmText}
					</button>
					<button
						type="button"
						className="bg-bg2 hover:bg-bg3 text-cream px-8 py-2 text-[9px] font-pixel uppercase tracking-wider w-full mt-4 border-3 border-border-pixel shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer"
						onClick={onCancel}>
						{cancelText}
					</button>
				</div>
			</div>
		</ModalOverlay>
	);
};

export default ConfirmationModal;
