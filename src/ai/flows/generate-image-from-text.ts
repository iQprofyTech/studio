'use server';
/**
 * @fileOverview An image generation AI agent.
 *
 * - generateImageFromText - A function that handles the image generation process.
 * - GenerateImageFromTextInput - The input type for the generateImageFromText function.
 * - GenerateImageFromTextOutput - The return type for the generateImageFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromTextInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate an image from.'),
});
export type GenerateImageFromTextInput = z.infer<
  typeof GenerateImageFromTextInputSchema
>;

const GenerateImageFromTextOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageFromTextOutput = z.infer<
  typeof GenerateImageFromTextOutputSchema
>;

export async function generateImageFromText(
  input: GenerateImageFromTextInput
): Promise<GenerateImageFromTextOutput> {
  return generateImageFromTextFlow(input);
}

const generateImageFromTextFlow = ai.defineFlow(
  {
    name: 'generateImageFromTextFlow',
    inputSchema: GenerateImageFromTextInputSchema,
    outputSchema: GenerateImageFromTextOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: `Generate an image of: ${input.prompt}`,
    });
    if (!media?.url) {
        throw new Error("Image generation failed. This could be due to content safety filters.");
    }
    return {imageDataUri: media.url};
  }
);
