import React from "react";
import type { Card, Insight } from "@deep-sql-research/shared";
import { applyMotionPreset } from "../../animations/motion-presets";
import { getCardComponent } from "./registry";

interface CardComponentProps {
  card: Card;
  insight: Insight;
  theme: any;
  frame: number;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, insight, theme, frame }) => {
  const motionStyle = applyMotionPreset(card.motion, frame);
  
  const getSurfaceColor = (surface: string, theme: any) => {
    switch (surface) {
      case "glass":
        return "rgba(30, 41, 59, 0.8)"; // Semi-transparent surface
      case "solid":
        return theme.surface;
      case "gradient":
        return `linear-gradient(135deg, ${theme.surface}, ${theme.accent})`;
      default:
        return theme.surface;
    }
  };

  const getCardStyle = () => {
    const baseStyle = {
      position: "absolute" as const,
      left: `${card.position.x}%`,
      top: `${card.position.y}%`,
      width: `${card.position.width}%`,
      height: `${card.position.height}%`,
      zIndex: card.zIndex,
      borderRadius: `${card.style.cornerRadius}px`,
      backgroundColor: getSurfaceColor(card.style.surface, theme),
      border: `1px solid ${card.style.accent}`,
      padding: "24px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      textAlign: "center" as const,
      color: "#ffffff",
      backdropFilter: card.style.surface === "glass" ? "blur(10px)" : "none",
      ...motionStyle,
    };

    return baseStyle;
  };

  const getTypographyStyle = () => {
    switch (card.style.typography) {
      case "heading":
        return {
          fontSize: "48px",
          fontWeight: "bold",
          lineHeight: 1.2,
        };
      case "body":
        return {
          fontSize: "24px",
          fontWeight: "normal",
          lineHeight: 1.4,
        };
      case "caption":
        return {
          fontSize: "18px",
          fontWeight: "normal",
          lineHeight: 1.3,
        };
      default:
        return {
          fontSize: "24px",
          fontWeight: "normal",
          lineHeight: 1.4,
        };
    }
  };

  const SpecificCardComponent = getCardComponent(card.variant);

  return (
    <div style={getCardStyle()}>
      <SpecificCardComponent insight={insight} typographyStyle={getTypographyStyle()} />
    </div>
  );
};
