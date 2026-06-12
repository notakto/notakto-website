export const MenuLayout = ({ children }: { children: React.ReactNode }) => (
	<div
		className="
			h-[calc(100dvh-3.5rem)]
			md:h-dvh
			bg-bg0
			flex
			flex-col
			items-center
			justify-center
			overflow-hidden
		">
		{children}
	</div>
);
