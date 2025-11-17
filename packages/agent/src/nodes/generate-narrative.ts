import { z } from "zod";
import { generateObject } from 'ai';

import type { AgentStateAnnotation } from "@/agent/state";
import type { Insight, NarrativeOutline } from "@shared/types";
import { llm } from "@/helpers/llm";

const narrativeSchema = z.object({
  title: z.string(),
  sections: z.array(z.object({
    id: z.string(),
    type: z.enum(['intro', 'key_insights', 'comparisons', 'outro']),
    title: z.string(),
    description: z.string(),
    insightIds: z.array(z.string()),
    priority: z.number(),
  })),
});

export const generateNarrativeNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { goal, insights } = state;

  const prompt = `Create a narrative outline for a data-driven video presentation based on the user's goal and gathered insights.

Goal: ${goal}

Available Insights:
${insights.map(i => `- [${i.id}] ${i.title} (${i.type}): ${i.summary}`).join('\n')}

Create a compelling narrative structure with these sections:
1. **intro**: Hook the viewer, introduce the topic, set context
2. **key_insights**: Present the most important findings and statistics
3. **comparisons**: Show interesting comparisons or rankings (if available)
4. **outro**: Summarize key takeaways and provide a strong conclusion

Guidelines:
- Each section should have a clear, engaging title
- Assign relevant insight IDs to each section
- Use priority numbers (1=highest) to indicate importance
- Keep descriptions concise but informative
- Ensure the narrative flows logically from intro to conclusion
- Focus on creating a story that would work well in a video format

Return a complete narrative outline.`;

  try {
    const result = await generateObject({
      model: llm,
      schema: narrativeSchema,
      prompt,
      temperature: 0.4,
    });

    const narrative: NarrativeOutline = result.object;
    
    console.log(`Generated narrative: "${narrative.title}" with ${narrative.sections.length} sections`);
    
    return { narrative };
  } catch (error) {
    console.error('Error generating narrative:', error);
    // Fallback narrative
    const fallbackNarrative: NarrativeOutline = {
      title: `Data Insights: ${goal}`,
      sections: [
        {
          id: 'intro',
          type: 'intro',
          title: 'Introduction',
          description: 'Overview of the data analysis',
          insightIds: [],
          priority: 1,
        },
        {
          id: 'key_insights',
          type: 'key_insights',
          title: 'Key Findings',
          description: 'Main insights from the data',
          insightIds: insights.slice(0, 3).map(i => i.id),
          priority: 2,
        },
        {
          id: 'outro',
          type: 'outro',
          title: 'Conclusion',
          description: 'Summary of key takeaways',
          insightIds: insights.slice(0, 2).map(i => i.id),
          priority: 3,
        },
      ],
    };
    
    return { narrative: fallbackNarrative };
  }
};