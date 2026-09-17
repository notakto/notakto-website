import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "@/features/authenticate-user/model/userStore";
import { useProfile } from "@/features/manage-user-profile/model/profileStore";
import updateUsername from "@/features/update-username/api/updateUsernameApis";
import ProfileDetailLabel from "@/widgets/profile-detail-label/ui/ProfileDetailLabel";

interface ProfileNameRowProps {
	value: string;
}

export default function ProfileUsernameRow({ value }: ProfileNameRowProps) {
	const [editing, setEditing] = useState(false);
	const [username, setUsername] = useState(value);
	const [loading, setLoading] = useState(false);

	const user = useUser((state) => state.user);
	const setProfileUsername = useProfile((state) => state.setUsername);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editing) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [editing]);

	const handleCancel = () => {
		setUsername(value);
		setEditing(false);
	};

	const handleUpdate = async () => {
		const trimmedUsername = username.trim();

		if (!trimmedUsername) {
			toast.error("Username cannot be empty");
			return;
		}

		if (trimmedUsername === value) {
			toast.error("Username cannot be same as before");
			return;
		}

		try {
			setLoading(true);

			const idToken = await user?.getIdToken();

			if (!idToken) {
				throw new Error("User is not authenticated");
			}

			await updateUsername(idToken, trimmedUsername);

			setUsername(trimmedUsername);
			setProfileUsername(trimmedUsername);
			setEditing(false);

			toast.success("Username updated!");
		} catch (error) {
			console.error(error);

			toast.error(
				error instanceof Error ? error.message : "Failed to update username",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleUpdate();
		}

		if (e.key === "Escape") {
			handleCancel();
		}
	};

	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex min-w-0 items-center gap-3 font-pixel text-[12px] text-cream-dim">
				<ProfileDetailLabel label="Username" />

				{editing ? (
					<input
						ref={inputRef}
						type="text"
						value={username}
						disabled={loading}
						onChange={(e) => setUsername(e.target.value)}
						onKeyDown={handleKeyDown}
						className="
							h-8 w-48
							border border-cream
							bg-bg0
							px-2
							font-pixel text-[11px] text-cream
							outline-none
							focus:border-primary
						"
					/>
				) : (
					<span className="truncate text-cream">{username}</span>
				)}
			</div>

			{editing ? (
				<div className="flex shrink-0 gap-2">
					{/* SAVE */}
					<button
						type="button"
						onClick={handleUpdate}
						disabled={loading}
						className="
							flex h-8 min-w-14.5
							items-center justify-center
							border border-primary
							bg-[#c43c3c]
							px-2
							font-pixel text-[8px] text-cream
							shadow-[2px_2px_0_var(--color-bg0)]
							disabled:cursor-not-allowed
							disabled:opacity-70
						">
						{loading ? (
							<div className="flex items-end gap-0.75">
								<span className="size-1 animate-bounce bg-cream" />
								<span className="size-1 animate-bounce bg-cream [animation-delay:100ms]" />
								<span className="size-1 animate-bounce bg-cream [animation-delay:200ms]" />
							</div>
						) : (
							"SAVE"
						)}
					</button>

					{/* CANCEL */}
					<button
						type="button"
						onClick={handleCancel}
						disabled={loading}
						className="
							h-8
							border border-border-light
							bg-bg2
							px-2
							font-pixel text-[8px] text-cream-dim
							shadow-[2px_2px_0_var(--color-bg0)]
							hover:text-cream
							disabled:cursor-not-allowed
							disabled:opacity-50
						">
						CANCEL
					</button>
				</div>
			) : (
				/* EDIT */
				<button
					type="button"
					onClick={() => setEditing(true)}
					aria-label="Edit username"
					className="
						flex size-8 shrink-0
						items-center justify-center
						border border-border-light
						bg-bg2
						shadow-[2px_2px_0_var(--color-bg0)]
					">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						aria-hidden="true">
						<path
							fill="#e4d8c0"
							d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L17.625 2.175L21.8 6.45l-14.55 14.55z"
						/>
					</svg>
				</button>
			)}
		</div>
	);
}
