
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";

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
			<div className="bg-black w-full max-w-md p-6">
				<h1 className="text-red-500 text-4xl mb-2 text-center">{title}</h1>
				<p className="my-6 text-center text-lg text-white">{message}</p>
				<div className="flex justify-center gap-4">
					<button
                        type="button"
						className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-xl w-full mt-4"
						onClick={onConfirm}>
						{confirmText}
					</button>
					<button
                        type="button"
						className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-xl w-full mt-4"
						onClick={onCancel}>
						{cancelText}
					</button>
				</div>
			</div>
		</ModalOverlay>
	);
};

export default ConfirmationModal;
