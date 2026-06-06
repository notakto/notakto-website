import type { ChangeEventHandler } from "react";
import { PlayerInput } from "@/widgets/player-input/ui/PlayerInput";
import PlayerNameCounter from "@/widgets/player-name-counter/ui/PlayerNameCounter";

interface PlayerNameFieldProps {
	value: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	placeholder: string;
	maxLength: number;
}

export default function PlayerNameField({
	value,
	onChange,
	placeholder,
	maxLength,
}: PlayerNameFieldProps) {
	return (
		<div>
			<PlayerInput
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				maxLength={maxLength}
			/>
			<PlayerNameCounter length={value.length} maxLength={maxLength} />
		</div>
	);
}
