import React from "react";
import { useCurrentFrame, spring } from "remotion";
import type { Card, CardVariant, Insight } from "@deep-sql-research/shared";
import { applyMotionPreset } from "../../animations/motion-presets";
import { useTheme } from "../../themes/theme-system";

interface CardComponentProps {
  card: Card;
  insight: Insight;
  theme: any;
  frame: number;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, insight, theme, frame }) => {
  const motionStyle = applyMotionPreset(card.motion, frame);
  
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

  const renderCardContent = () => {
    switch (card.variant) {
      case "hero_stat":
        return <HeroStatCard insight={insight} typographyStyle={getTypographyStyle()} />;
      case "ranked_list":
        return <RankedCard insight={insight} typographyStyle={getTypographyStyle()} />;
      case "comparison_split":
        return <ComparisonCard insight={insight} typographyStyle={getTypographyStyle()} />;
      case "trend_chart":
        return <TrendCard insight={insight} typographyStyle={getTypographyStyle()} />;
      case "distribution_chart":
        return <DistributionCard insight={insight} typographyStyle={getTypographyStyle()} />;
      case "key_highlight":
        return <HighlightCard insight={insight} typographyStyle={getTypographyStyle()} />;
      default:
        return <HeroStatCard insight={insight} typographyStyle={getTypographyStyle()} />;
    }
  };

  return (
    <div style={getCardStyle()}>
      {renderCardContent()}
    </div>
  );
};

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

// Card variant components
interface CardVariantProps {
  insight: Insight;
  typographyStyle: any;
}

const HeroStatCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => (
  <div>
    <div style={{ ...typographyStyle, marginBottom: "16px" }}>
      {insight.title}
    </div>
    <div style={{ ...typographyStyle, fontSize: "72px", fontWeight: "bold", color: "#3b82f6" }}>
      {insight.data?.value || insight.data?.count || "N/A"}
    </div>
    <div style={{ ...typographyStyle, fontSize: "20px", marginTop: "16px", opacity: 0.8 }}>
      {insight.summary}
    </div>
  </div>
);

const RankedCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => {
  const items = insight.data?.items || [
    { label: "Item 1", value: 100 },
    { label: "Item 2", value: 85 },
    { label: "Item 3", value: 72 },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ ...typographyStyle, marginBottom: "20px", textAlign: "center" }}>
        {insight.title}
      </div>
      {items.map((item: any, index: number) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: index < items.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}
        >
          <span style={{ ...typographyStyle, fontSize: "18px" }}>
            {index + 1}. {item.label}
          </span>
          <span style={{ ...typographyStyle, fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const ComparisonCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => {
  const data = insight.data || { left: "Option A", right: "Option B" };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div style={{ flex: 1, padding: "20px", borderRight: "2px solid #3b82f6" }}>
        <div style={{ ...typographyStyle, textAlign: "center", marginBottom: "20px" }}>
          {data.left}
        </div>
      </div>
      <div style={{ flex: 1, padding: "20px" }}>
        <div style={{ ...typographyStyle, textAlign: "center", marginBottom: "20px" }}>
          {data.right}
        </div>
      </div>
    </div>
  );
};

const TrendCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => (
  <div style={{ width: "100%", height: "100%" }}>
    <div style={{ ...typographyStyle, textAlign: "center", marginBottom: "20px" }}>
      {insight.title}
    </div>
    <div style={{ ...typographyStyle, textAlign: "center" }}>
      📈 {insight.summary}
    </div>
  </div>
);

const DistributionCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => (
  <div style={{ width: "100%", height: "100%" }}>
    <div style={{ ...typographyStyle, textAlign: "center", marginBottom: "20px" }}>
      {insight.title}
    </div>
    <div style={{ ...typographyStyle, textAlign: "center" }}>
      📊 {insight.summary}
    </div>
  </div>
);

const HighlightCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => (
  <div style={{ width: "100%", height: "100%" }}>
    <div style={{ 
      ...typographyStyle, 
      textAlign: "center", 
      fontSize: "32px",
      fontWeight: "bold",
      color: "#f59e0b",
      padding: "20px"
    }}>
      "{insight.summary}"
    </div>
  </div>
);