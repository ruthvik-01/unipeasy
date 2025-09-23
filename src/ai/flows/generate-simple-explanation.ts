'use server';

/**
 * @fileOverview An AI agent that generates simple explanations of complex topics, using visuals and real-life analogies.
 *
 * - generateSimpleExplanation - A function that handles the generation of simple explanations.
 * - GenerateSimpleExplanationInput - The input type for the generateSimpleExplanation function.
 * - GenerateSimpleExplanationOutput - The return type for the generateSimpleExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSimpleExplanationInputSchema = z.object({
  topic: z.string().describe('The complex topic to be explained simply.'),
  preferredExplanationLength: z
    .string()
    .describe(
      'The length of the explanation (short, medium, long). Defaults to medium.'
    )
    .optional(),
});
export type GenerateSimpleExplanationInput = z.infer<
  typeof GenerateSimpleExplanationInputSchema
>;

const GenerateSimpleExplanationOutputSchema = z.object({
  simpleExplanation: z
    .string()
    .describe('A simplified explanation of the topic.'),
  analogy: z.string().describe('A real-life analogy to help understand the topic.'),
  visualDescription: z
    .string()
    .describe('A description of a visual representation of the topic.'),
});
export type GenerateSimpleExplanationOutput = z.infer<
  typeof GenerateSimpleExplanationOutputSchema
>;

export async function generateSimpleExplanation(
  input: GenerateSimpleExplanationInput
): Promise<GenerateSimpleExplanationOutput> {
  return generateSimpleExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSimpleExplanationPrompt',
  input: {schema: GenerateSimpleExplanationInputSchema},
  output: {schema: GenerateSimpleExplanationOutputSchema},
  prompt: `You are an expert educator, skilled at explaining complex topics in simple terms.

  The student wants to understand: {{{topic}}}

  Provide a simple explanation, a real-life analogy, and a description of a visual representation to aid understanding. The explanation should be {{preferredExplanationLength}} in length.

  Explanation:
  Analogy:
  Visual Description: `,
});

const generateSimpleExplanationFlow = ai.defineFlow(
  {
    name: 'generateSimpleExplanationFlow',
    inputSchema: GenerateSimpleExplanationInputSchema,
    outputSchema: GenerateSimpleExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
