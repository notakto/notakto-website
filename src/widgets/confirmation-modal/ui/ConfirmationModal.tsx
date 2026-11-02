import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";

interface ConfirmationModalProps {
	visible: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
}

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
			<div className="bg-gray-800 pixel-border w-[95%] md:w-full max-w-md p-4 md:p-6">
				<h1 className="text-rose-700  uppercase tracking-widest text-sm mb-2 text-center">
					{title}
				</h1>
				<p className="my-6 text-center text-[9px]  text-stone-300">{message}</p>
				<div className="flex justify-center gap-4">
					<button
						type="button"
						className="bg-rose-700 hover:bg-rose-600 text-stone-300 px-8 py-2 text-[9px]  uppercase tracking-wider w-full mt-4 border-3 border-zinc-600 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer"
						onClick={onConfirm}>
						{confirmText}
					</button>
					<button
						type="button"
						className="bg-slate-800 hover:bg-slate-800 text-stone-300 px-8 py-2 text-[9px]  uppercase tracking-wider w-full mt-4 border-3 border-gray-700 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer"
						onClick={onCancel}>
						{cancelText}
					</button>
				</div>
			</div>
		</ModalOverlay>
	);
};

export default ConfirmationModal;
