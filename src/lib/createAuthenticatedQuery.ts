export function createAuthenticatedQuery<T>(
	getIdToken: () => Promise<string>,
	queryFn: (idToken: string) => Promise<T>,
): () => Promise<T> {
	return async () => {
		const idToken = await getIdToken();
		return queryFn(idToken);
	};
}
