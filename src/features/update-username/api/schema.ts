import { z } from "zod";

export const UpdateUsernameResponseSchema = z.object({
	username: z.string(),
});

export type UpdateUsernameResponse = z.infer<
	typeof UpdateUsernameResponseSchema
>;
