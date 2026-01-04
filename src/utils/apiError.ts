import type { ErrorResponse } from "@/services/types";
export type ApiError = ErrorResponse & {
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
