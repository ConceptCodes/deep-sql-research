import { z } from "zod";

// Existing research types
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

// Video generation types
export interface Insight {
  id: string;
  type: 'statistic' | 'trend' | 'comparison' | 'ranking' | 'distribution';
  title: string;
  summary: string;
  data: any;
  confidence: number; // 0-1
  metadata?: Record<string, any>;
}

export interface NarrativeOutline {
  title: string;
  sections: NarrativeSection[];
}

export interface NarrativeSection {
  id: string;
  type: 'intro' | 'key_insights' | 'comparisons' | 'outro';
  title: string;
  description: string;
  insightIds: string[];
  priority: number;
}

export interface SceneSpec {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  duration: number; // seconds
  insightIds: string[];
  layoutPreset: 'center_focus' | 'split_screen' | 'carousel' | 'timeline';
}

export interface Card {
  id: string;
  sceneId: string;
  variant: CardVariant;
  dataRef: string; // insight ID or data path
  fieldMapping: Record<string, string>; // maps data fields to card props
  motion: CardMotion;
  style: CardStyle;
  position: { x: number; y: number; width: number; height: number };
  zIndex: number;
}

export type CardVariant = 
  | 'hero_stat' 
  | 'ranked_list' 
  | 'comparison_split' 
  | 'trend_chart'
  | 'distribution_chart'
  | 'key_highlight';

export interface CardMotion {
  preset: 'cinematic_slide_up' | 'scale_pop' | 'fade_in' | 'slide_in_left' | 'slide_in_right';
  duration: number; // seconds
  delay: number; // seconds
  easing?: string;
}

export interface CardStyle {
  surface: 'glass' | 'solid' | 'gradient';
  cornerRadius: number;
  accent: string; // color token
  background: string; // color token
  typography: 'heading' | 'body' | 'caption';
}

export interface Timeline {
  scenes: TimelineScene[];
  totalDuration: number;
}

export interface TimelineScene {
  sceneId: string;
  startTime: number; // seconds from start
  duration: number; // seconds
  transition?: 'fade' | 'slide' | 'cut';
}

export interface TemplateJson {
  version: string;
  compositionId: string;
  meta: {
    title: string;
    description: string;
    generatedAt: string;
    dataSource: string;
  };
  dataBindings: {
    insights: Insight[];
  };
  narrative: NarrativeOutline;
  scenes: SceneSpec[];
  timeline: Timeline;
  cards: Card[];
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  animationProfile: {
    speed: 'slow' | 'normal' | 'fast';
    style: 'cinematic' | 'bouncy' | 'smooth';
  };
}
