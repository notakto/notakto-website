import type { SoundConfigLabelProps } from "@/services/types";

const SoundConfigLabel = ({ label, htmlFor }: SoundConfigLabelProps) => (
	<label
		htmlFor={htmlFor}
		className="
			text-red-500 text-2xl flex-1 text-left
			max-[407px]:text-[1.5rem]">
		{label}
	</label>
);

export default SoundConfigLabel;
