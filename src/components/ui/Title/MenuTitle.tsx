"use client";

export const MenuTitle = ({ text }: { text: string }) => {
	return (
		<h1
			aria-label={text}
			className="select-none tracking-widest relative inline-block -mb-4 md:-mb-6">
			<span className="relative z-10 text-primary font-pixel uppercase pixel-text-shadow [font-size:clamp(24px,5vw,48px)]">
				{text}
			</span>
		</h1>
	);
};

export default MenuTitle;
