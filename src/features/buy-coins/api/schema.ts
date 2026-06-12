import { z } from "zod";

export const PaymentStatusSchema = z.enum([
	"created",
	"pending",
	"confirmed",
	"failed",
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const CreateChargeResponseSchema = z.object({
	chargeId: z.string(),
	hostedUrl: z.url(),
});

export type CreateChargeResponse = z.infer<typeof CreateChargeResponseSchema>;

export const PaymentStatusResponseSchema = z.object({
	chargeId: z.string(),
	packageId: z.string(),
	coins: z.number().int(),
	amountCents: z.number().int(),
	status: PaymentStatusSchema,
	hostedUrl: z.url(),
});

export type PaymentStatusResponse = z.infer<typeof PaymentStatusResponseSchema>;
