import {z} from 'zod';
import {ai} from '../genkit';

const GenerateImageWithDALLEInputSchema = z.object({
  prompt: z.string(),
  model: z.enum(['dall-e-3', 'dall-e-2']).optional().default('dall-e-3'),
  size: z.enum(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']).optional().default('1024x1024'),
  quality: z.enum(['standard', 'hd']).optional().default('standard'),
  style: z.enum(['vivid', 'natural']).optional().default('vivid'),
});

const GenerateImageWithDALLEOutputSchema = z.object({
  imageUrl: z.string(),
  revisedPrompt: z.string().optional(),
  model: z.string(),
});

export type GenerateImageWithDALLEInput = z.infer<
  typeof GenerateImageWithDALLEInputSchema
>;
export type GenerateImageWithDALLEOutput = z.infer<
  typeof GenerateImageWithDALLEOutputSchema
>;

export async function generateImageWithDALLE(
  input: GenerateImageWithDALLEInput
): Promise<GenerateImageWithDALLEOutput> {
  return generateImageWithDALLEFlow(input);
}

const generateImageWithDALLEFlow = ai.defineFlow(
  {
    name: 'generateImageWithDALLEFlow',
    inputSchema: GenerateImageWithDALLEInputSchema,
    outputSchema: GenerateImageWithDALLEOutputSchema,
  },
  async (input) => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.');
    }

    // DALL-E requires special handling as it's an image generation model
    // We'll use the OpenAI SDK directly for image generation
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const response = await openai.images.generate({
        model: input.model,
        prompt: input.prompt,
        n: 1,
        size: input.size,
        quality: input.model === 'dall-e-3' ? input.quality : undefined,
        style: input.model === 'dall-e-3' ? input.style : undefined,
      });

      const imageData = response.data[0];
      
      return {
        imageUrl: imageData.url || '',
        revisedPrompt: imageData.revised_prompt,
        model: input.model,
      };
    } catch (error) {
      throw new Error(`DALL-E image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);
