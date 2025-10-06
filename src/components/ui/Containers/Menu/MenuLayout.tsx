export const MenuLayout = ({ children }: { children: React.ReactNode }) => (
	<div className="flex-col min-h-screen bg-black bg-[url('/background.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
		{children}
	</div>
);
