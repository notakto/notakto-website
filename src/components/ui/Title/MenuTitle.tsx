interface MenuTitleProps {
  text: string;
  subtitle?: string;
}

export const MenuTitle = ({ text, subtitle = "The Ultimate Reverse Tic-Tac-Toe" }: MenuTitleProps) => (
  <div className="text-center mb-8">
    <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse tracking-wider">
      {text}
    </h1>
    <p className="text-cyan-300 text-lg md:text-xl mt-2 tracking-wide font-light opacity-80">
      {subtitle}
    </p>
    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4"></div>
  </div>
);