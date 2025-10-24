"use client";

interface PlayerTurnTitleProps {
	variant?: "normal" | "live";
	text: string;
}

const PlayerTurnTitle = ({
	variant = "normal",
	text,
}: PlayerTurnTitleProps) => {
	if (variant === "normal") {
		return (
			<h2 className="text-red-600 text-[80px] mb-5 text-center">{text}</h2>
		);
	} else {
		return <h1 className="text-5xl text-red-600 mb-6">{text}</h1>;
	}
};

export default PlayerTurnTitle;
