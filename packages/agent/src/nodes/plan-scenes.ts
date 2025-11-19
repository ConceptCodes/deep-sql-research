import { z } from "zod";

import type { AgentStateAnnotation } from "@/agent/state";
import type { Insight, NarrativeOutline, SceneSpec } from "@shared/types";
import { generateSchemaObject } from "@/helpers/llm";

const sceneSchema = z.object({
  scenes: z.array(z.object({
    id: z.string(),
    sectionId: z.string(),
    title: z.string(),
    description: z.string(),
    duration: z.number().positive(),
    insightIds: z.array(z.string()),
    layoutPreset: z.enum(['center_focus', 'split_screen', 'carousel', 'timeline']),
  })),
});

export const planScenesNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { narrative, insights } = state;

  const prompt = `Plan individual scenes for a video presentation based on the narrative outline and available insights.

Narrative: ${narrative.title}

Sections:
${narrative.sections.map((s: any) => `- [${s.id}] ${s.title} (${s.type}): ${s.description} (insights: ${s.insightIds.join(', ')})`).join('\n')}

Available Insights:
${insights.map(i => `- [${i.id}] ${i.title} (${i.type}): ${i.summary}`).join('\n')}

Create scenes following these guidelines:
1. Each narrative section should become 1-2 scenes
2. Scene duration: 3-8 seconds for simple content, 8-15 seconds for complex content
3. Choose appropriate layout presets:
   - center_focus: Single key insight or statistic
   - split_screen: Comparing two insights
   - carousel: Multiple related insights
   - timeline: Showing progression or trends
4. Assign relevant insight IDs to each scene
5. Create engaging, descriptive scene titles
6. Ensure smooth flow between scenes

Scene Planning Strategy:
- Intro scenes: Use center_focus, shorter duration (3-5s)
- Key insights: Use center_focus or carousel, medium duration (5-10s)
- Comparisons: Use split_screen, longer duration (8-12s)
- Outro: Use center_focus, shorter duration (4-6s)

Return a complete scene plan.`;

  try {
    const result = await generateSchemaObject({
      schema: sceneSchema,
      prompt,
      temperature: 0.3,
    });

    const scenes: SceneSpec[] = result.scenes;
    
    console.log(`Planned ${scenes.length} scenes for narrative`);
    
    return { scenes };
  } catch (error) {
    console.error('Error planning scenes:', error);
    // Fallback scene planning
    const fallbackScenes: SceneSpec[] = narrative.sections.map((section: any, index: number) => ({
      id: `scene_${section.id}`,
      sectionId: section.id,
      title: section.title,
      description: section.description,
      duration: section.type === 'intro' || section.type === 'outro' ? 5 : 8,
      insightIds: section.insightIds,
      layoutPreset: section.type === 'comparisons' ? 'split_screen' : 'center_focus' as const,
    }));
    
    return { scenes: fallbackScenes };
  }
};
