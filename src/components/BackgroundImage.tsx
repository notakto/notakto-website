"use client";
import Image from "next/image";

/**
 * Renders optimized background image using Next.js <Image> component.
 * It is positioned absolutely and covers the entire viewport, sitting
 * behind all other content (z-index -10).
 */
export default function BackgroundImage() {
  return (
    <Image
      src="/background.png"
      alt="Background"
      fill
      sizes="100vw"
      quality={85}
      priority
      className="object-cover object-center -z-10"
    />
  );
}