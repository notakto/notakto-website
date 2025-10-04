import BackgroundImage from "@/components/BackgroundImage";

export const MenuLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex-col min-h-screen bg-black flex items-center justify-center">
    <BackgroundImage />
    {children}
  </div>
);