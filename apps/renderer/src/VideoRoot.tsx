import { Composition } from "remotion";
import { DynamicWrappedVideo, type DynamicWrappedVideoProps } from "./components/DynamicWrappedVideo";

// Sample template data - in production this would come from the agent
const sampleTemplate = {
  version: "1.0.0",
  compositionId: "sample_video",
  meta: {
    title: "Data Insights Sample",
    description: "Sample video presentation",
    generatedAt: new Date().toISOString(),
    dataSource: "Sample Database",
  },
  dataBindings: {
    insights: [
      {
        id: "insight_1",
        type: "statistic",
        title: "Total Users",
        summary: "The platform has reached 1 million active users",
        data: { value: 1000000 },
        confidence: 0.95,
      },
      {
        id: "insight_2", 
        type: "trend",
        title: "Growth Rate",
        summary: "User growth increased by 25% this quarter",
        data: { growth: 0.25 },
        confidence: 0.88,
      },
    ],
  },
  narrative: {
    title: "Platform Performance Overview",
    sections: [
      {
        id: "intro",
        type: "intro",
        title: "Introduction",
        description: "Overview of platform performance",
        insightIds: ["insight_1"],
        priority: 1,
      },
      {
        id: "key_insights",
        type: "key_insights", 
        title: "Key Metrics",
        description: "Important performance indicators",
        insightIds: ["insight_1", "insight_2"],
        priority: 2,
      },
    ],
  },
  scenes: [
    {
      id: "scene_intro",
      sectionId: "intro",
      title: "Welcome",
      description: "Introduction to platform performance",
      duration: 5,
      insightIds: ["insight_1"],
      layoutPreset: "center_focus",
    },
    {
      id: "scene_metrics",
      sectionId: "key_insights",
      title: "Key Metrics",
      description: "Important performance indicators",
      duration: 8,
      insightIds: ["insight_1", "insight_2"],
      layoutPreset: "carousel",
    },
  ],
  timeline: {
    scenes: [
      {
        sceneId: "scene_intro",
        startTime: 0,
        duration: 5,
        transition: undefined,
      },
      {
        sceneId: "scene_metrics", 
        startTime: 5,
        duration: 8,
        transition: "fade",
      },
    ],
    totalDuration: 13,
  },
  cards: [
    {
      id: "card_hero_1",
      sceneId: "scene_intro",
      variant: "hero_stat",
      dataRef: "insight_1",
      fieldMapping: { title: "title", value: "summary" },
      motion: {
        preset: "scale_pop",
        duration: 0.5,
        delay: 0,
      },
      style: {
        surface: "glass",
        cornerRadius: 16,
        accent: "#3b82f6",
        background: "#1e293b",
        typography: "heading",
      },
      position: { x: 20, y: 30, width: 60, height: 40 },
      zIndex: 1,
    },
  ],
  theme: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b", 
    background: "#0f172a",
    surface: "#1e293b",
  },
  animationProfile: {
    speed: "normal",
    style: "cinematic",
  },
};

export const VideoRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DynamicWrappedVideo"
        component={DynamicWrappedVideo as React.FC<any>}
        durationInFrames={sampleTemplate.timeline.totalDuration * 30} // 30 fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ template: sampleTemplate }}
      />
    </>
  );
};