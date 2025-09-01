import {z} from 'zod';
import {ai} from '../genkit';

const GenerateTextWithOpenAIInputSchema = z.object({
  prompt: z.string(),
  model: z.enum(['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']).optional().default('gpt-4o-mini'),
  maxTokens: z.number().optional().default(1000),
  temperature: z.number().min(0).max(2).optional().default(0.7),
});

const GenerateTextWithOpenAIOutputSchema = z.object({
  text: z.string(),
  model: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
});

export type GenerateTextWithOpenAIInput = z.infer<
  typeof GenerateTextWithOpenAIInputSchema
>;
export type GenerateTextWithOpenAIOutput = z.infer<
  typeof GenerateTextWithOpenAIOutputSchema
>;

export async function generateTextWithOpenAI(
  input: GenerateTextWithOpenAIInput
): Promise<GenerateTextWithOpenAIOutput> {
  return generateTextWithOpenAIFlow(input);
}

const generateTextWithOpenAIFlow = ai.defineFlow(
  {
    name: 'generateTextWithOpenAIFlow',
    inputSchema: GenerateTextWithOpenAIInputSchema,
    outputSchema: GenerateTextWithOpenAIOutputSchema,
  },
  async (input) => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.');
    }

    const modelName = `openai/${input.model}`;
    
    const response = await ai.generate({
      model: modelName,
      prompt: input.prompt,
      config: {
        maxOutputTokens: input.maxTokens,
        temperature: input.temperature,
      },
    });

    return {
      text: response.text,
      model: input.model,
      usage: response.usage ? {
        promptTokens: response.usage.inputTokens || 0,
        completionTokens: response.usage.outputTokens || 0,
        totalTokens: (response.usage.inputTokens || 0) + (response.usage.outputTokens || 0),
      } : undefined,
    };
  }
);
