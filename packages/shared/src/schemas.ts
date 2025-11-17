import { z } from 'zod';

// Insight schema
export const insightSchema = z.object({
  id: z.string(),
  type: z.enum(['statistic', 'trend', 'comparison', 'ranking', 'distribution']),
  title: z.string(),
  summary: z.string(),
  data: z.any(),
  confidence: z.number().min(0).max(1),
  metadata: z.record(z.any()).optional(),
});

// Narrative schemas
export const narrativeSectionSchema = z.object({
  id: z.string(),
  type: z.enum(['intro', 'key_insights', 'comparisons', 'outro']),
  title: z.string(),
  description: z.string(),
  insightIds: z.array(z.string()),
  priority: z.number(),
});

export const narrativeOutlineSchema = z.object({
  title: z.string(),
  sections: z.array(narrativeSectionSchema),
});

// Scene schemas
export const sceneSpecSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.number().positive(),
  insightIds: z.array(z.string()),
  layoutPreset: z.enum(['center_focus', 'split_screen', 'carousel', 'timeline']),
});

// Card schemas
export const cardMotionSchema = z.object({
  preset: z.enum(['cinematic_slide_up', 'scale_pop', 'fade_in', 'slide_in_left', 'slide_in_right']),
  duration: z.number().nonnegative(),
  delay: z.number().nonnegative(),
  easing: z.string().optional(),
});

export const cardStyleSchema = z.object({
  surface: z.enum(['glass', 'solid', 'gradient']),
  cornerRadius: z.number().nonnegative(),
  accent: z.string(),
  background: z.string(),
  typography: z.enum(['heading', 'body', 'caption']),
});

export const cardSchema = z.object({
  id: z.string(),
  sceneId: z.string(),
  variant: z.enum(['hero_stat', 'ranked_list', 'comparison_split', 'trend_chart', 'distribution_chart', 'key_highlight']),
  dataRef: z.string(),
  fieldMapping: z.record(z.string()),
  motion: cardMotionSchema,
  style: cardStyleSchema,
  position: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  zIndex: z.number(),
});

// Timeline schemas
export const timelineSceneSchema = z.object({
  sceneId: z.string(),
  startTime: z.number().nonnegative(),
  duration: z.number().positive(),
  transition: z.enum(['fade', 'slide', 'cut']).optional(),
});

export const timelineSchema = z.object({
  scenes: z.array(timelineSceneSchema),
  totalDuration: z.number().positive(),
});

// Template schema
export const templateJsonSchema = z.object({
  version: z.string(),
  compositionId: z.string(),
  meta: z.object({
    title: z.string(),
    description: z.string(),
    generatedAt: z.string(),
    dataSource: z.string(),
  }),
  dataBindings: z.object({
    insights: z.array(insightSchema),
  }),
  narrative: narrativeOutlineSchema,
  scenes: z.array(sceneSpecSchema),
  timeline: timelineSchema,
  cards: z.array(cardSchema),
  theme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    surface: z.string(),
  }),
  animationProfile: z.object({
    speed: z.enum(['slow', 'normal', 'fast']),
    style: z.enum(['cinematic', 'bouncy', 'smooth']),
  }),
});

// Validation functions
export const validateInsight = (data: unknown) => insightSchema.safeParse(data);
export const validateNarrativeOutline = (data: unknown) => narrativeOutlineSchema.safeParse(data);
export const validateSceneSpec = (data: unknown) => sceneSpecSchema.safeParse(data);
export const validateCard = (data: unknown) => cardSchema.safeParse(data);
export const validateTimeline = (data: unknown) => timelineSchema.safeParse(data);
export const validateTemplateJson = (data: unknown) => templateJsonSchema.safeParse(data);