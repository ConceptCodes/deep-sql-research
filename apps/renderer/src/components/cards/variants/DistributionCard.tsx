import React from "react";
import type { CardVariantProps } from "../types";

export const DistributionCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => (
  <div style={{ width: "100%", height: "100%" }}>
    <div style={{ ...typographyStyle, textAlign: "center", marginBottom: "20px" }}>
      {insight.title}
    </div>
    <div style={{ ...typographyStyle, textAlign: "center" }}>
      📊 {insight.summary}
    </div>
  </div>
);