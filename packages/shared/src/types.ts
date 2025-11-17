import { z } from "zod";

export type Section = {
  title: string;
  content?: string;
  description: string;
  results: Results[];
};

export type Results = {
  query: string;
  task: string;
  data: any[];
};

export const taskSchema = z.object({
  description: z.string(),
  successCase: z.string(),
});
export type Task = z.infer<typeof taskSchema>;

export const reviewSchema = z.object({
  grade: z.enum(["pass", "fail"]).describe("Grade for the task review"),
  feedback: z.string().optional().describe("Feedback if the grade is 'fail'"),
});
