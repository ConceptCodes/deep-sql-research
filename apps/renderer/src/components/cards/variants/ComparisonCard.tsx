import React from "react";
import type { CardVariantProps } from "../types";

export const ComparisonCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => {
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