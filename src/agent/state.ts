import { Annotation } from "@langchain/langgraph";
import type { Task } from "../helpers/types";

export const InputStateAnnotation = Annotation.Root({
  goal: Annotation<string>,
});

export const OutputStateAnnotation = Annotation.Root({
  finalReport: Annotation<string>,
});

export const TaskStateAnnotation = Annotation.Root({
  feedback: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  currentTask: Annotation<{
    description: string;
    success: string;
  }>({
    reducer: (x, y) => y ?? x,
    default: () => ({
      description: "",
      success: "",
    }),
  }),
  query: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  params: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  error: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  results: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,
  ...OutputStateAnnotation.spec,
  ...TaskStateAnnotation.spec,

  feedback: Annotation<string>({
    reducer: (a, b) => b ?? a,
    default: () => "",
  }),

  tasks: Annotation<Task[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
});
