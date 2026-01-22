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

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('An array of 4 multiple-choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
});

const GenerateSimpleExplanationOutputSchema = z.object({
  simpleExplanation: z
    .string()
    .describe('A simplified explanation of the topic.'),
  analogy: z.string().describe('A real-life analogy to help understand the topic.'),
  mindMap: z
    .string()
    .describe('A mind map of the topic in a hierarchical tree structure using markdown format.'),
  quiz: z.array(QuizQuestionSchema).describe('A 5-question multiple-choice quiz based on the topic.'),
});
export type GenerateSimpleExplanationOutput = z.infer<
  typeof GenerateSimpleExplanationOutputSchema
>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export async function generateSimpleExplanation(
  input: GenerateSimpleExplanationInput
): Promise<GenerateSimpleExplanationOutput> {
  return generateSimpleExplanationFlow(input);
}

const explanationPrompt = ai.definePrompt({
  name: 'generateSimpleExplanationPrompt',
  input: {schema: GenerateSimpleExplanationInputSchema},
  output: {
    schema: GenerateSimpleExplanationOutputSchema,
  },
  prompt: `You are an expert educator, skilled at explaining complex topics in simple terms that are easy to study and remember.

  The student wants to understand: {{{topic}}}

  Provide a simple explanation, a real-life analogy, a mind map, and a 5-question multiple-choice quiz to aid understanding. The explanation should be {{preferredExplanationLength}} in length. 

  **IMPORTANT FORMATTING RULES FOR BETTER READABILITY:**
  
  For the simple explanation:
  - Use clear markdown formatting for easy studying
  - Break content into short, digestible paragraphs (2-3 sentences each)
  - Use **bold** for key terms and important concepts
  - Use bullet points (- ) for listing related items
  - Add line breaks between paragraphs for visual separation
  - Structure the explanation with an introduction, main points, and summary
  - Use numbered lists (1. 2. 3.) for sequential steps or processes
  
  For the analogy:
  - Format with markdown for clarity
  - Use **bold** for the key comparison points
  - Break into multiple paragraphs if the analogy is detailed
  
  For the mind map:
  - Generate it in a hierarchical tree structure using markdown lists
  - Start with the main topic and branch out into key concepts, sub-topics, and important details
  - This structure should be easy to remember and visually clear

  For the quiz, provide 5 multiple-choice questions with 4 options each. Ensure the correct answer is one of the options.`,
});

const generateSimpleExplanationFlow = ai.defineFlow(
  {
    name: 'generateSimpleExplanationFlow',
    inputSchema: GenerateSimpleExplanationInputSchema,
    outputSchema: GenerateSimpleExplanationOutputSchema,
    retries: 3,
  },
  async input => {
    const {output} = await explanationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate explanation.');
    }
    
    return output;
  }
);
