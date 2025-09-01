'use server';
/**
 * @fileOverview Generates a video from a text prompt using the Google Veo model.
 *
 * - generateVideoFromText - A function that generates a video from text.
 * - GenerateVideoFromTextInput - The input type for the generateVideoFromText function.
 * - GenerateVideoFromTextOutput - The return type for the generateVideoFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MediaPart } from '@genkit-ai/ai/model';

const GenerateVideoFromTextInputSchema = z.object({
  prompt: z
    .string()
    .describe('A description of what you want to see in the video.'),
  aspectRatio: z.string().optional().describe('The aspect ratio of the generated video.'),
});
export type GenerateVideoFromTextInput = z.infer<
  typeof GenerateVideoFromTextInputSchema
>;

const GenerateVideoFromTextOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video as a data URI.'),
});
export type GenerateVideoFromTextOutput = z.infer<
  typeof GenerateVideoFromTextOutputSchema
>;

export async function generateVideoFromText(
  input: GenerateVideoFromTextInput
): Promise<GenerateVideoFromTextOutput> {
  return generateVideoFromTextFlow(input);
}

async function mediaToDataUri(media: MediaPart): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${media.media!.url}&key=${process.env.GEMINI_API_KEY}`);
    if (!response.ok || !response.body) {
        throw new Error('Failed to download video');
    }
    const videoBuffer = await response.buffer();
    const contentType = media.media?.contentType || "video/mp4";
    return `data:${contentType};base64,${videoBuffer.toString('base64')}`;
}

const generateVideoFromTextFlow = ai.defineFlow(
  {
    name: 'generateVideoFromTextFlow',
    inputSchema: GenerateVideoFromTextInputSchema,
    outputSchema: GenerateVideoFromTextOutputSchema,
  },
  async input => {
    let {operation} = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: input.prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: input.aspectRatio || '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }

    const videoDataUri = await mediaToDataUri(video);
    return {videoDataUri: videoDataUri};
  }
);
