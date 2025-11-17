import { Annotation } from "@langchain/langgraph";
import type { Task, Insight, TemplateJson } from "@shared/types";

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
  insights: Annotation<Insight[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  templateJson: Annotation<TemplateJson | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
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
  hasEnoughInfo: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
  reasoning: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  missingInfo: Annotation<string[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  narrative: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  scenes: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  cards: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  timeline: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  templateJson: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});
