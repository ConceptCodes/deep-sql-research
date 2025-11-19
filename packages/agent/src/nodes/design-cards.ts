import { z } from "zod";

import type { AgentStateAnnotation } from "@/agent/state";
import type { Insight, SceneSpec, Card, CardVariant, CardMotion, CardStyle } from "@shared/types";
import { generateSchemaObject } from "@/helpers/llm";

const cardSchema = z.object({
  cards: z.array(z.object({
    id: z.string(),
    sceneId: z.string(),
    variant: z.enum(['hero_stat', 'ranked_list', 'comparison_split', 'trend_chart', 'distribution_chart', 'key_highlight']),
    dataRef: z.string(),
    fieldMapping: z.record(z.string()),
    motion: z.object({
      preset: z.enum(['cinematic_slide_up', 'scale_pop', 'fade_in', 'slide_in_left', 'slide_in_right']),
      duration: z.number().nonnegative(),
      delay: z.number().nonnegative(),
      easing: z.string().optional(),
    }),
    style: z.object({
      surface: z.enum(['glass', 'solid', 'gradient']),
      cornerRadius: z.number().nonnegative(),
      accent: z.string(),
      background: z.string(),
      typography: z.enum(['heading', 'body', 'caption']),
    }),
    position: z.object({
      x: z.number(),
      y: z.number(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
    zIndex: z.number(),
  })),
});

export const designCardsNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { scenes, insights } = state;

  const prompt = `Design cards for each scene based on the scene specifications and available insights.

Scenes:
${scenes.map(s => `- [${s.id}] ${s.title} (${s.layoutPreset}): ${s.description} (insights: ${s.insightIds.join(', ')})`).join('\n')}

Available Insights:
${insights.map(i => `- [${i.id}] ${i.title} (${i.type}): ${i.summary}`).join('\n')}

Design cards following these guidelines:

1. **Card Variants**:
   - hero_stat: Large, prominent statistic or key number
   - ranked_list: Ordered list of items (3-5 items)
   - comparison_split: Two-sided comparison
   - trend_chart: Line or area chart showing change over time
   - distribution_chart: Bar or pie chart showing distribution
   - key_highlight: Important text highlight or quote

2. **Layout Strategy**:
   - center_focus: 1-2 cards, one main card
   - split_screen: 2 cards, equal or weighted split
   - carousel: 2-3 cards, horizontal arrangement
   - timeline: 1-2 cards with temporal focus

3. **Motion Presets**:
   - cinematic_slide_up: For dramatic reveals
   - scale_pop: For statistics and highlights
   - fade_in: For smooth transitions
   - slide_in_left/right: For comparisons

4. **Positioning**:
   - Use coordinates (0-100) for percentage-based positioning
   - Ensure cards don't overlap
   - Consider visual hierarchy

5. **Styling**:
   - surface: glass for modern look, solid for data-heavy, gradient for emphasis
   - cornerRadius: 8-16 for modern feel
   - typography: heading for titles, body for descriptions, caption for labels

Return a complete card design for each scene.`;

  try {
    const result = await generateSchemaObject({
      schema: cardSchema,
      prompt,
      temperature: 0.2,
    });

    const cards: Card[] = result.cards;
    
    console.log(`Designed ${cards.length} cards for ${scenes.length} scenes`);
    
    return { cards };
  } catch (error) {
    console.error('Error designing cards:', error);
    // Fallback card design
    const fallbackCards: Card[] = scenes.flatMap((scene, sceneIndex) => {
      const basePosition = { x: 10, y: 20, width: 80, height: 60 };
      
      return scene.insightIds.slice(0, 2).map((insightId: any, cardIndex: number) => ({
        id: `card_${scene.id}_${cardIndex}`,
        sceneId: scene.id,
        variant: 'hero_stat' as CardVariant,
        dataRef: insightId,
        fieldMapping: { title: 'title', value: 'summary' },
        motion: {
          preset: 'scale_pop' as const,
          duration: 0.5,
          delay: cardIndex * 0.2,
        },
        style: {
          surface: 'glass' as const,
          cornerRadius: 12,
          accent: '#3b82f6',
          background: '#1e293b',
          typography: 'heading' as const,
        },
        position: {
          ...basePosition,
          x: basePosition.x + (cardIndex * 5),
          y: basePosition.y + (cardIndex * 5),
        },
        zIndex: cardIndex + 1,
      }));
    });
    
    return { cards: fallbackCards };
  }
};
