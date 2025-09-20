export const MenuLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 min-h-screen bg-[url('/background.png')] bg-no-repeat bg-cover flex items-center justify-center">
    {children}
  </div>
);