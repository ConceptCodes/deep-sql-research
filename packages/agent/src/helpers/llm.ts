import { createOpenAI } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

// Provider configuration
type ProviderType = 'openai' | 'lmstudio';

function getProvider(): ProviderType {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  return provider === 'lmstudio' ? 'lmstudio' : 'openai';
}

function createModel(): LanguageModel {
  const provider = getProvider();
  
  switch (provider) {
    case 'lmstudio':
      // LM Studio uses OpenAI-compatible API
      const lmstudioProvider = createOpenAICompatible({
        name: 'lmstudio',
        baseURL: process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1',
      });
      return lmstudioProvider(LMSTUDIO_MODEL);

    case 'openai':
    default:
      const openaiProvider = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      return openaiProvider('gpt-4o-mini');
  }
}

// Default model configuration
const DEFAULT_MODEL = 'gpt-4o-mini';
const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || 'gpt-oss-20b';

export const llm = createModel();

// Helper function to get model name for current provider
export function getModelName(): string {
  const provider = getProvider();
  return provider === 'lmstudio' ? LMSTUDIO_MODEL : DEFAULT_MODEL;
}

// Helper function to check if provider is available
export function isProviderAvailable(): boolean {
  const provider = getProvider();
  
  switch (provider) {
    case 'lmstudio':
      return !!(process.env.LMSTUDIO_BASE_URL);
    case 'openai':
    default:
      return !!(process.env.OPENAI_API_KEY);
  }
}

// Export provider info for debugging
export const providerInfo = {
  type: getProvider(),
  modelName: getModelName(),
  available: isProviderAvailable(),
};
