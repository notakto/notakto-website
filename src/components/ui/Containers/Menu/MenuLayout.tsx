export const MenuLayout = ({ children }: { children: React.ReactNode }) => (
  <div  style={{
    backgroundImage:
      "url('/background.png')",
  }}
  className="flex-1 min-h-dvh bg-neutral-950 bg-no-repeat bg-cover bg-center flex items-center justify-center">
    {children}
  </div>
);