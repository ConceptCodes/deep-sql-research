import React from "react";
import { Sequence, useCurrentFrame, interpolate, spring } from "remotion";
import type { TemplateJson, SceneSpec, Card } from "@deep-sql-research/shared";
import { CardComponent } from "./cards/CardComponent";
import { applyMotionPreset } from "../animations/motion-presets";
import { useTheme } from "../themes/theme-system";

interface DynamicWrappedVideoProps {
  template: TemplateJson;
}

export const DynamicWrappedVideo: React.FC<DynamicWrappedVideoProps> = ({ template }) => {
  const frame = useCurrentFrame();
  const theme = useTheme(template.theme);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.background,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {template.timeline.scenes.map((timelineScene, index) => {
        const scene = template.scenes.find(s => s.id === timelineScene.sceneId);
        if (!scene) return null;

        const sceneCards = template.cards.filter(card => card.sceneId === scene.id);

        return (
          <Sequence
            key={scene.id}
            from={timelineScene.startTime * 30} // Convert seconds to frames
            durationInFrames={timelineScene.duration * 30}
          >
            <SceneRenderer
              scene={scene}
              cards={sceneCards}
              insights={template.dataBindings.insights}
              theme={theme}
              frame={frame - (timelineScene.startTime * 30)}
            />
            
            {/* Scene transition */}
            {timelineScene.transition && index < template.timeline.scenes.length - 1 && (
              <TransitionEffect
                type={timelineScene.transition}
                duration={1} // 1 second transition
                startTime={timelineScene.duration - 1}
              />
            )}
          </Sequence>
        );
      })}
    </div>
  );
};

interface SceneRendererProps {
  scene: SceneSpec;
  cards: Card[];
  insights: any[];
  theme: any;
  frame: number;
}

const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, cards, insights, theme, frame }) => {
  const getLayoutStyle = (preset: string) => {
    switch (preset) {
      case "center_focus":
        return {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        };
      case "split_screen":
        return {
          display: "flex",
          height: "100%",
        };
      case "carousel":
        return {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: "20px",
        };
      case "timeline":
        return {
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        };
      default:
        return {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        };
    }
  };

  return (
    <div style={getLayoutStyle(scene.layoutPreset)}>
      {cards.map((card) => {
        const insight = insights.find(i => i.id === card.dataRef);
        if (!insight) return null;

        return (
          <CardComponent
            key={card.id}
            card={card}
            insight={insight}
            theme={theme}
            frame={frame}
          />
        );
      })}
    </div>
  );
};

interface TransitionEffectProps {
  type: "fade" | "slide" | "cut";
  duration: number;
  startTime: number;
}

const TransitionEffect: React.FC<TransitionEffectProps> = ({ type, duration, startTime }) => {
  const frame = useCurrentFrame();
  const transitionStart = startTime * 30;
  const transitionEnd = (startTime + duration) * 30;

  if (frame < transitionStart || frame > transitionEnd) {
    return null;
  }

  const progress = (frame - transitionStart) / (transitionEnd - transitionStart);

  const getTransitionStyle = () => {
    switch (type) {
      case "fade":
        return {
          opacity: 1 - progress,
        };
      case "slide":
        return {
          transform: `translateX(${progress * 100}%)`,
        };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        ...getTransitionStyle(),
      }}
    />
  );
};