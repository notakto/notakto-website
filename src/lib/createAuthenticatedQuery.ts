import { auth } from "@/services/firebase";

export async function createAuthenticatedQuery<T>(
	queryFn: (token: string) => Promise<T>,
): Promise<T> {
	const user = auth.currentUser;
	if (!user) throw new Error("User not authenticated");

	const token = await user.getIdToken();
	return queryFn(token);
}

export async function createAuthenticatedQueryWithRefresh<T>(
	queryFn: (token: string) => Promise<T>,
): Promise<T> {
	const user = auth.currentUser;
	if (!user) throw new Error("User not authenticated");

	try {
		const token = await user.getIdToken();
		return await queryFn(token);
	} catch (error: any) {
		// On 401, force refresh token and retry once
		if (error?.status === 401 || error?.response?.status === 401) {
			const freshToken = await user.getIdToken(true);
			return await queryFn(freshToken);
		}
		throw error;
	}
}
