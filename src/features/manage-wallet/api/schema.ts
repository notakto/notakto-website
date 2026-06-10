import { z } from "zod";

export const GetWalletResponseSchema = z.object({
	coins: z.number().int(),
	xp: z.number().int(),
	success: z.boolean(),
	error: z.string().optional(),
});

export type GetWalletResponse = z.infer<typeof GetWalletResponseSchema>;
