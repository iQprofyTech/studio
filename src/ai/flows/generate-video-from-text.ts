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

const GenerateVideoFromTextInputSchema = z.object({
  prompt: z
    .string()
    .describe('A description of what you want to see in the video.'),
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
        aspectRatio: '16:9',
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

    // Veo returns a GCS URL that is not directly usable by the client.
    // For this prototype, we'll just pass the URL but it won't play.
    // A real implementation would need to download the video to the server
    // and then provide it to the client, e.g., as a base64 data URI.
    return {videoDataUri: video.media!.url};
  }
);
