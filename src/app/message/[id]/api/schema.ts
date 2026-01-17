import { z } from "zod";

export const messageIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, { message: "id must be a numeric string" });


  export const updateMessageBodySchema = z
    .object({
      subject: z.string().trim().min(1, { message: "subject is required" }).max(200).optional(),
      body: z.string().trim().min(1, { message: "body is required" }).max(4000).optional(),
    })
    .refine((value) => value.subject !== undefined || value.body !== undefined, {
      message: "Either subject or body is required",
    });
  
  export type UpdateMessageBody = z.infer<typeof updateMessageBodySchema>;
  