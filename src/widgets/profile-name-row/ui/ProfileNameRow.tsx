import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "@/features/authenticate-user/model/userStore";
import updateUsername from "@/features/update-username/api/updateUsernameApis";
import PixelLoadingIndicator from "@/widgets/pixel-loading-indicator/PixelLoadingIndicator";
import ProfileDetailLabel from "@/widgets/profile-detail-label/ui/ProfileDetailLabel";

interface ProfileNameRowProps {
	value: string;
}

export default function ProfileNameRow({ value }: ProfileNameRowProps) {
	const [disabled, setDisabled] = useState<boolean>(true);
	const [username, setUsername] = useState<string>(value);
	const [loading, setLoading] = useState<boolean>(false);

	const user = useUser((state) => state.user);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!disabled) {
			inputRef.current?.focus();
		}
	}, [disabled]);

	const handleClick = async () => {
		if (!username.trim()) {
			toast.error("Username cannot be empty");
			return;
		} else if (username === value) {
			toast.error("Username cannot be same as before");
			return;
		}

		try {
			setLoading(true);

			const idToken = await user?.getIdToken();

			if (!idToken) {
				throw new Error("User is not authenticated");
			}

			const _response = await updateUsername(idToken, username);

			toast("Username updated successfully!");

			setDisabled(true);
		} catch (error) {
			console.error(error);

			toast.error(
				error instanceof Error ? error.message : "Failed to update username",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-between gap-20 text-center">
			<div className="font-pixel text-[8px] text-cream-dim">
				<ProfileDetailLabel label={"NAME"} />

				<input
					ref={inputRef}
					className={`text-cream ${disabled ? "border-none" : "border"}`}
					type="text"
					value={username}
					disabled={disabled || loading}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>

			{disabled ? (
				<button
					type="button"
					className="cursor-pointer border border-border-light shadow-[2px_2px_0_var(--color-bg0)]"
					onClick={() => setDisabled(false)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						aria-hidden="true"
						viewBox="0 0 24 24">
						<path
							fill="#e4d8c0"
							d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L17.625 2.175L21.8 6.45L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
						/>
					</svg>
				</button>
			) : (
				<div className="border py-2 border-border-light shadow-[3px_3px_0_var(--color-bg0)] flex items-center justify-center">
					<button
						onClick={handleClick}
						disabled={loading}
						type="button"
						className="text-[8px] cursor-pointer">
						{loading ? (
							<PixelLoadingIndicator title="Updating Name" />
						) : (
							"Update Name"
						)}
					</button>
				</div>
			)}
		</div>
	);
}
