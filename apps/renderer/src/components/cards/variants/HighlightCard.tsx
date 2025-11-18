import React from "react";
import type { CardVariantProps } from "../types";

export const HighlightCard: React.FC<CardVariantProps> = ({ insight, typographyStyle }) => (
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