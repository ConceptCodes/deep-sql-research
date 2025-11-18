import React from "react";
import type { CardVariantProps } from "../types";

export const HeroStatCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => (
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