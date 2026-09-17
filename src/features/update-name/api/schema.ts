import { z } from "zod";

export const UpdateNameResponseSchema = z.object({
	name: z.string(),
});

export type UpdateNameResponse = z.infer<typeof UpdateNameResponseSchema>;
