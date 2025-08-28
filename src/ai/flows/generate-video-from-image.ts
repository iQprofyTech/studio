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
import * as fs from 'fs';

const GenerateVideoFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to use as the first frame to create a video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('A description of what you want to see in the video.'),
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
        aspectRatio: '9:16',
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

    // const fetch = (await import('node-fetch')).default;
    // Add API key before fetching the video.
    // const videoDownloadResponse = await fetch(
    //   `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
    // );
    // if (
    //   !videoDownloadResponse ||
    //   videoDownloadResponse.status !== 200 ||
    //   !videoDownloadResponse.body
    // ) {
    //   throw new Error('Failed to fetch video');
    // }

    // Readable.from(videoDownloadResponse.body).pipe(fs.createWriteStream(path));
    return {videoDataUri: video.media!.url};
  }
);
