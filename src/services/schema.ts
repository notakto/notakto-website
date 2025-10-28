import { z } from "zod";

export const SignInResponseSchema = z.object({
	uid: z.string(),
	name: z.string(),
	email: z.email(),
	profile_pic: z.url().nullable(),
	new_account: z.boolean(),
});

export type SignInResponse = z.infer<typeof SignInResponseSchema>;
