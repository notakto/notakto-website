interface SoundConfigLabelProps {
	label: string;
	htmlFor: string;
}

const SoundConfigLabel = ({ label, htmlFor }: SoundConfigLabelProps) => (
	<label htmlFor={htmlFor} className="text-red-500 text-2xl flex-1 text-left">
		{label}
	</label>
);

export default SoundConfigLabel;
