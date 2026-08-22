const PixelLoadingIndicator = () => {
	const blocks = [0, 1, 2, 3, 4];

	return (
		<div className="inline-flex items-end gap-1 bg-bg2 px-4 py-3">
			<style>{`
        @keyframes pixel-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
			{blocks.map((i) => (
				<span
					key={i}
					className="size-2.5"
					style={{
						backgroundColor: "#c43c3c",
						boxShadow: "0 0 4px #c43c3c",
						animation: "pixel-bounce 1s steps(4) infinite",
						animationDelay: `${i * 100}ms`,
					}}
				/>
			))}
		</div>
	);
};

export default PixelLoadingIndicator;
