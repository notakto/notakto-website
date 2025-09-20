export const MenuLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 min-h-dvh bg-[url('/background.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
    {children}
  </div>
);