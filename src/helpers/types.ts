import { z } from "zod";

export type Section = {
  title: string;
  content?: string;
  description: string;
};

export const taskSchema = z.object({
  description: z.string(),
  successCase: z.string(),
});
export type Task = z.infer<typeof taskSchema>;

export const reviewSchema = z.object({
  grade: z.enum(["pass", "fail"]),
  feedback: z.string(),
});
