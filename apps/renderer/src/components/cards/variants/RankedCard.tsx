import React from "react";
import type { CardVariantProps } from "../types";

export const RankedCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => {
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