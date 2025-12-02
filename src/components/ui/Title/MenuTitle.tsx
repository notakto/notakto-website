"use client";

export const MenuTitle = ({ text }: { text: string }) => {
  return (
    <h1
      aria-label={text}
      className={[
        "select-none text-6xl md:text-7xl lg:text-8xl tracking-widest",
        "relative inline-block",
        "-mb-6 md:-mb-8 lg:-mb-10",
      ].join(" ")}
    >
      <span
        className={[
          "relative z-10",
          "text-red-600",
          "[font-size:clamp(97px,19vw,180px)]",
        ].join(" ")}
      >
        {text}
      </span>
    </h1>
  );
};

export default MenuTitle;
