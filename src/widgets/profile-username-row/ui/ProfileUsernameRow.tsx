import { Check, Pencil, X } from "lucide-react";
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

	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex min-w-0 items-center gap-0.5 font-pixel md:text-[12px] text-[10px] text-cream-dim">
				<ProfileDetailLabel label="Username" />

				{editing ? (
					<input
						ref={inputRef}
						type="text"
						value={username}
						disabled={loading}
						onChange={(e) => setUsername(e.target.value)}
						className="
							h-8 w-[85%] md:w-68
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
						aria-label="Save username"
						title="Save"
						className="
							flex size-8 shrink-0
							items-center justify-center
							border border-primary
							bg-[#c43c3c]
							text-cream
							shadow-[2px_2px_0_var(--color-bg0)]
							transition-colors
							hover:bg-[#d44a4a]
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
							<Check size={16} strokeWidth={2.5} />
						)}
					</button>

					{/* CANCEL */}
					<button
						type="button"
						onClick={handleCancel}
						disabled={loading}
						aria-label="Cancel editing"
						title="Cancel"
						className="
							flex size-8 shrink-0
							items-center justify-center
							border border-border-light
							bg-bg2
							text-cream-dim
							shadow-[2px_2px_0_var(--color-bg0)]
							transition-colors
							hover:text-cream
							disabled:cursor-not-allowed
							disabled:opacity-50
						">
						<X size={16} strokeWidth={2.5} />
					</button>
				</div>
			) : (
				/* EDIT */
				<button
					type="button"
					onClick={() => setEditing(true)}
					aria-label="Edit username"
					title="Edit username"
					className="
						flex size-8 shrink-0
						items-center justify-center
						border border-border-light
						bg-bg2
						text-cream
						shadow-[2px_2px_0_var(--color-bg0)]
						transition-colors
						hover:text-primary
					">
					<Pencil size={16} strokeWidth={2} />
				</button>
			)}
		</div>
	);
}
