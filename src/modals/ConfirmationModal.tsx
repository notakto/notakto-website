import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import { SettingButton } from "@/components/ui/Buttons/SettingButton";
import { MenuTitle } from "@/components/ui/Title/MenuTitle";

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
		// FIX: Remove the 'onClick' prop. This component is not clickable.
		<ModalOverlay>
			<div className="p-8 bg-white rounded-lg shadow-xl w-11/12 max-w-md">
				<MenuTitle text={title} />
				<p className="my-6 text-center text-lg">{message}</p>
				<div className="flex justify-center gap-4">
					<SettingButton onClick={onConfirm}>{confirmText}</SettingButton>
					<SettingButton onClick={onCancel}>{cancelText}</SettingButton>
				</div>
			</div>
		</ModalOverlay>
	);
};

export default ConfirmationModal;