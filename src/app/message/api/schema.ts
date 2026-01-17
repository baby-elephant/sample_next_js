import { z } from "zod";

export const createMessageBodySchema = z.object({
  subject: z.string().trim().min(1, { message: "subject is required" }).max(200),
  body: z.string().trim().min(1, { message: "body is required" }).max(4000),
});

export type CreateMessageBody = z.infer<typeof createMessageBodySchema>;