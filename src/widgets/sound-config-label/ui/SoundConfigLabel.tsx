interface SoundConfigLabelProps {
	label: string;
	htmlFor: string;
}

const SoundConfigLabel = ({ label, htmlFor }: SoundConfigLabelProps) => (
	<label
		htmlFor={htmlFor}
		className="text-cream font-pixel uppercase tracking-wider text-[8px] flex-1 text-left">
		{label}
	</label>
);

export default SoundConfigLabel;
