import Image from "next/image";

interface ProfileAvatarProps {
	src: string;
}

export default function ProfileAvatar({ src }: ProfileAvatarProps) {
	return (
		<Image
			src={src}
			alt="profile"
			width={80}
			height={80}
			className="mx-auto border-border-pixel border-3"
		/>
	);
}
