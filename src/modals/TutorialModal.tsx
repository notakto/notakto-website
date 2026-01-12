import { useTranslations } from "next-intl";
import { TutorialButton } from "@/components/ui/Buttons/TutorialButton";
import TutorialContainer from "@/components/ui/Containers/Tutorial/TutorialContainer";
import TutorialList from "@/components/ui/List/TutorialList";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import TutorialTitle from "@/components/ui/Title/TutorialTitle";
import type { TutorialModalProps } from "@/services/types";

const TutorialModal = ({ visible, onClose }: TutorialModalProps) => {
	const t = useTranslations("Tutorial");

	if (!visible) return null;
	const rules = [
		t("rules.0"),
		t("rules.1"),
		t("rules.2"),
		t("rules.3"),
		t("rules.4"),
		t("rules.5"),
	];

	return (
		<ModalOverlay>
			<TutorialContainer>
				<TutorialTitle text={t("title")} />

				<TutorialList items={rules} />

				<TutorialButton onClick={onClose}>{t("close")}</TutorialButton>
			</TutorialContainer>
		</ModalOverlay>
	);
};

export default TutorialModal;
