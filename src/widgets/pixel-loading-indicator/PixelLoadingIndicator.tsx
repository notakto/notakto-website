interface PixelLoadingIndicatorProps {
	title?: string;
}

const PixelLoadingIndicator = ({
	title = "Loading...",
}: PixelLoadingIndicatorProps) => {
	const blocks = [0, 1, 2, 3, 4];

	return (
		<div className="inline-flex flex-col items-center gap-5 bg-bg2 px-4 py-3">
			<style>{`
        @keyframes pixel-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>

			<div className="flex items-end gap-1">
				{blocks.map((i) => (
					<span
						key={i}
						className="size-3"
						style={{
							backgroundColor: "#c43c3c",
							boxShadow: "0 0 4px #c43c3c",
							animation: "pixel-bounce 1s steps(4) infinite",
							animationDelay: `${i * 100}ms`,
						}}
					/>
				))}
			</div>

			{title && <p className="text-xs">{title}</p>}
		</div>
	);
};

export default PixelLoadingIndicator;
