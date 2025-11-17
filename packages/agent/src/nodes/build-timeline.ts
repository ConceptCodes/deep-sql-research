import type { AgentStateAnnotation } from "@/agent/state";
import type { SceneSpec, Timeline, TimelineScene } from "@shared/types";

export const buildTimelineNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { scenes } = state;

  // Build timeline by calculating start times and adding transitions
  const timelineScenes: TimelineScene[] = [];
  let currentTime = 0;

  scenes.forEach((scene, index) => {
    const timelineScene: TimelineScene = {
      sceneId: scene.id,
      startTime: currentTime,
      duration: scene.duration,
      transition: index === 0 ? undefined : 'fade', // Add fade transition between scenes
    };

    timelineScenes.push(timelineScene);
    currentTime += scene.duration;
  });

  const timeline: Timeline = {
    scenes: timelineScenes,
    totalDuration: currentTime,
  };

  console.log(`Built timeline with ${timelineScenes.length} scenes, total duration: ${currentTime}s`);

  return { timeline };
};