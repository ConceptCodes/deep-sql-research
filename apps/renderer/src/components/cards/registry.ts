import React from "react";
import type { CardVariantProps } from "./types";
import { HeroStatCard } from "./variants/HeroStatCard";
import { RankedCard } from "./variants/RankedCard";
import { ComparisonCard } from "./variants/ComparisonCard";
import { TrendCard } from "./variants/TrendCard";
import { DistributionCard } from "./variants/DistributionCard";
import { HighlightCard } from "./variants/HighlightCard";

export const CardRegistry: Record<string, React.FC<CardVariantProps>> = {
  hero_stat: HeroStatCard,
  ranked_list: RankedCard,
  comparison_split: ComparisonCard,
  trend_chart: TrendCard,
  distribution_chart: DistributionCard,
  key_highlight: HighlightCard,
};

export const getCardComponent = (variant: string): React.FC<CardVariantProps> => {
  return CardRegistry[variant] || HeroStatCard;
};