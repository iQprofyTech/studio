
// Implemented the flow to generate a video from an image provided as a data URI, using the Google Veo model.

'use server';
/**
 * @fileOverview Generates a video from an input image using the Google Veo model.
 *
 * - generateVideoFromImage - A function that generates a video from an image.
 * - GenerateVideoFromImageInput - The input type for the generateVideoFromImage function.
 * - GenerateVideoFromImageOutput - The return type for the generateVideoFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MediaPart } from 'genkit/experimental/ai';

const GenerateVideoFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to use as the first frame to create a video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('A description of what you want to see in the video.'),
  aspectRatio: z.string().optional().describe('The aspect ratio of the generated video.'),
});
export type GenerateVideoFromImageInput = z.infer<
  typeof GenerateVideoFromImageInputSchema
>;

const GenerateVideoFromImageOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video as a data URI.'),
});
export type GenerateVideoFromImageOutput = z.infer<
  typeof GenerateVideoFromImageOutputSchema
>;

export async function generateVideoFromImage(
  input: GenerateVideoFromImageInput
): Promise<GenerateVideoFromImageOutput> {
  return generateVideoFromImageFlow(input);
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

const generateVideoFromImageFlow = ai.defineFlow(
  {
    name: 'generateVideoFromImageFlow',
    inputSchema: GenerateVideoFromImageInputSchema,
    outputSchema: GenerateVideoFromImageOutputSchema,
  },
  async input => {
    let {operation} = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: [
        {
          text: input.prompt,
        },
        {
          media: {
            contentType: input.photoDataUri.substring(
              5,
              input.photoDataUri.indexOf(';')
            ),
            url: input.photoDataUri,
          },
        },
      ],
      config: {
        durationSeconds: 5,
        aspectRatio: input.aspectRatio || '9:16',
        personGeneration: 'allow_adult',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
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
