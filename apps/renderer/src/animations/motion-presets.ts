import { spring, interpolate } from "remotion";
import type { CardMotion } from "@deep-sql-research/shared";

export const applyMotionPreset = (motion: CardMotion, frame: number) => {
  const { preset, duration, delay, easing } = motion;
  const durationInFrames = duration * 30; // Convert to frames at 30fps
  const delayInFrames = delay * 30;
  
  // Calculate progress within the animation
  const animationFrame = frame - delayInFrames;
  const progress = Math.max(0, Math.min(1, animationFrame / durationInFrames));
  
  switch (preset) {
    case "cinematic_slide_up":
      return {
        transform: `translateY(${(1 - progress) * 50}px)`,
        opacity: progress,
      };
      
    case "scale_pop":
      const scale = spring({
        frame: animationFrame,
        fps: 30,
        config: { damping: 12, stiffness: 80, mass: 1 },
      });
      return {
        transform: `scale(${scale})`,
        opacity: progress,
      };
      
    case "fade_in":
      return {
        opacity: progress,
      };
      
    case "slide_in_left":
      return {
        transform: `translateX(${(1 - progress) * -100}px)`,
        opacity: progress,
      };
      
    case "slide_in_right":
      return {
        transform: `translateX(${(1 - progress) * 100}px)`,
        opacity: progress,
      };
      
    default:
      return {};
  }
};

export const getTransitionPreset = (type: "fade" | "slide" | "cut", progress: number) => {
  switch (type) {
    case "fade":
      return {
        opacity: 1 - progress,
      };
    case "slide":
      return {
        transform: `translateX(${progress * 100}%)`,
      };
    case "cut":
      return {
        opacity: progress > 0.5 ? 0 : 1,
      };
    default:
      return {};
  }
};