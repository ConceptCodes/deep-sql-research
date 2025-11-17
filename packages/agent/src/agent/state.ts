import { Annotation } from "@langchain/langgraph";
import type { Task } from "@shared/types";

export const InputStateAnnotation = Annotation.Root({
  goal: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  dbUrl: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
});

export const OutputStateAnnotation = Annotation.Root({
  finalReport: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
});

export const QueryStateAnnotation = Annotation.Root({
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

export const TaskStateAnnotation = Annotation.Root({
  feedback: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  currentTask: Annotation<Task>({
    reducer: (x, y) => y ?? x,
    default: () => ({
      description: "",
      successCase: "",
    }),
  }),

  ...QueryStateAnnotation.spec,
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,
  ...OutputStateAnnotation.spec,
  ...TaskStateAnnotation.spec,

  tasks: Annotation<Task[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
});
