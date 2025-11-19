import { Annotation } from "@langchain/langgraph";
import type { Insight, Task, NarrativeOutline, SceneSpec, Card, TemplateJson } from "@shared/types";

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
    reducer: (x, y) => {
      if (!x) return y;
      if (!y) return x;
      return [...x, ...y];
    },
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
  params: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  results: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  error: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  analysis: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});

export const TaskStateAnnotation = Annotation.Root({
  ...QueryStateAnnotation.spec,
  currentTask: Annotation<Task>({
    reducer: (x, y) => y ?? x,
    default: () => ({} as Task),
  }),
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,
  ...OutputStateAnnotation.spec,
  ...TaskStateAnnotation.spec,
  
  tasks: Annotation<Task[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),

  feedback: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),

  hasEnoughInfo: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),

  // Narrative & Template State
  narrative: Annotation<NarrativeOutline>({
    reducer: (x, y) => y ?? x,
    default: () => ({} as NarrativeOutline),
  }),
  scenes: Annotation<SceneSpec[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  cards: Annotation<Card[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  timeline: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});
