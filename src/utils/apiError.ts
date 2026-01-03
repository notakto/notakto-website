export type ApiError = {
	success: false;
	error: string;
	code?: number;
};
export function NormalizeApiError(
	error: unknown,
	fallbackMessage: string,
): ApiError {
	if (error instanceof Error) {
		return {
			success: false,
			error: error.message || fallbackMessage,
		};
	}
	return {
		success: false,
		error: fallbackMessage,
	};
}
