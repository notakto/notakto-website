import { auth } from "@/services/firebase";

export function useAuthToken() {
	const getToken = async (): Promise<string> => {
		const user = auth.currentUser;
		if (!user) throw new Error("User not authenticated");
		return await user.getIdToken();
	};

	return { getToken };
}
