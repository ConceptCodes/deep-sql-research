import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { openai } from "@ai-sdk/openai";
import { generateText, generateObject } from "ai";
import type { LanguageModel } from "ai";
import { z } from "zod";

// Provider configuration
type ProviderType = "openai" | "lmstudio";

// Default model configuration
const DEFAULT_MODEL = "gpt-4o-mini";
const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || "openai/gpt-oss-20b";

function getProvider(): ProviderType {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  return provider === "lmstudio" ? "lmstudio" : "openai";
}

function createModel(): LanguageModel {
  const provider = getProvider();

  switch (provider) {
    case "lmstudio":
      // LM Studio uses OpenAI-compatible API
      const lmstudioProvider = createOpenAICompatible({
        name: "lmstudio",
        baseURL: process.env.LMSTUDIO_BASE_URL || "http://localhost:1234/v1",
      });
      return lmstudioProvider(LMSTUDIO_MODEL);

    case "openai":
    default:
      const openaiProvider = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      return openaiProvider("gpt-4o-mini");
  }
}

export const llm = createModel();

// Helper function to get model name for current provider
export function getModelName(): string {
  const provider = getProvider();
  return provider === "lmstudio" ? LMSTUDIO_MODEL : DEFAULT_MODEL;
}

// Helper function to check if provider is available
export function isProviderAvailable(): boolean {
  const provider = getProvider();

  switch (provider) {
    case "lmstudio":
      return !!process.env.LMSTUDIO_BASE_URL;
    case "openai":
    default:
      return !!process.env.OPENAI_API_KEY;
  }
}

// Provider-aware structured generation helper
export async function generateSchemaObject<T>(options: {
  schema: z.ZodSchema<T>;
  prompt: string;
  system?: string;
  temperature?: number;
}): Promise<T> {
  const { schema, prompt, system, temperature = 0 } = options;
  const provider = getProvider();
  const model = createModel();

  if (provider === "lmstudio") {
    // LM Studio lacks native response_format/json_schema support, so coerce via text
    const result = await generateText({
      model,
      prompt: `${system ? `${system}\n\n` : ""}${prompt}\n\nIMPORTANT: Respond with ONLY a valid JSON object that matches this schema. Do not include code fences or extra text.`,
      temperature,
    });

    try {
      let jsonText = result.text.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```json\n?/, "").replace(/```\n?$/, "");
      }
      return schema.parse(JSON.parse(jsonText));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse LM Studio response as JSON: ${errorMessage}\nRaw response: ${result.text}`);
    }
  }

  // Default: use provider native structured output
  const result = await generateObject({
    model,
    schema,
    prompt,
    system,
    temperature,
  });

  return result.object;
}

// Helper function for structured output that works with both providers
export async function generateStructuredOutput<T>(
  schema: z.ZodSchema<T>,
  prompt: string,
  system?: string
): Promise<T> {
  const provider = getProvider();
  const model = createModel();

  if (provider === "lmstudio") {
    // For LM Studio, use generateText with manual JSON parsing
    const schemaExample = {
      tasks: [
        {
          description: "Task description here",
          successCase: "What success looks like"
        }
      ]
    };
    
    const result = await generateText({
      model,
      prompt: `${system ? `${system}\n\n` : ""}${prompt}\n\nIMPORTANT: Respond with ONLY a valid JSON object that matches this exact structure: ${JSON.stringify(schemaExample, null, 2)}\n\nDo not include any explanations, markdown formatting, or code blocks. Just the raw JSON.`,
      temperature: 0,
    });

    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonText = result.text.trim();
      
      // Remove markdown code block markers if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/, '').replace(/```\n?$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/, '').replace(/```\n?$/, '');
      }
      
      return schema.parse(JSON.parse(jsonText));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse LM Studio response as JSON: ${errorMessage}\nRaw response: ${result.text}`);
    }
  } else {
    // For OpenAI, use generateObject directly
    const result = await generateObject({
      model,
      schema,
      prompt,
      system,
      temperature: 0,
    });

    return result.object;
  }
}

// Export provider info for debugging
export const providerInfo = {
  type: getProvider(),
  modelName: getModelName(),
  available: isProviderAvailable(),
};
