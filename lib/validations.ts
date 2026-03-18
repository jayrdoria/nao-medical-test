import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.record(z.unknown()).optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.unknown()).optional(),
});

export const shareDocumentSchema = z.object({
  email: z.string().email(),
});
