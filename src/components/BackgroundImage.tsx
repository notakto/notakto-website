import Image from "next/image";

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
