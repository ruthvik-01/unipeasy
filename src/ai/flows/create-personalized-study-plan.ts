'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating a personalized study plan.
 *
 * The flow takes syllabus, timeframe, learning pace, and past exam papers as input
 * and generates a prioritized Pomodoro-based timetable to maximize the student's exam score.
 *
 * @exports createPersonalizedStudyPlan - An async function that calls the flow.
 * @exports CreatePersonalizedStudyPlanInput - The input type for the createPersonalizedStudyPlan function.
 * @exports CreatePersonalizedStudyPlanOutput - The return type for the createPersonalizedStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreatePersonalizedStudyPlanInputSchema = z.object({
  syllabus: z.string().describe('The syllabus for the exam.'),
  timeframe: z.string().describe('The amount of time available for studying (e.g., "2 weeks").'),
  learningPace: z.string().describe('The student\'s learning pace (e.g., "slow", "medium", "fast").'),
  pastExamPapers: z.string().describe('Past exam papers, including questions and answers.'),
});
export type CreatePersonalizedStudyPlanInput = z.infer<typeof CreatePersonalizedStudyPlanInputSchema>;

const CreatePersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A prioritized Pomodoro-based timetable for studying.'),
});
export type CreatePersonalizedStudyPlanOutput = z.infer<typeof CreatePersonalizedStudyPlanOutputSchema>;

export async function createPersonalizedStudyPlan(input: CreatePersonalizedStudyPlanInput): Promise<CreatePersonalizedStudyPlanOutput> {
  return createPersonalizedStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPersonalizedStudyPlanPrompt',
  input: {schema: CreatePersonalizedStudyPlanInputSchema},
  output: {schema: CreatePersonalizedStudyPlanOutputSchema},
  prompt: `You are an AI Exam Strategist. Your goal is to generate a personalized and prioritized study plan for a student based on their syllabus, timeframe, learning pace, and past exam papers.

  Syllabus: {{{syllabus}}}
  Timeframe: {{{timeframe}}}
  Learning Pace: {{{learningPace}}}
  Past Exam Papers: {{{pastExamPapers}}}

  Based on this information, create a prioritized Pomodoro-based timetable to maximize the student's exam score in the limited time they have.
  The study plan should be clear, concise, and easy to follow. It should include specific topics to study, the amount of time to spend on each topic, and the order in which to study them. Consider the student's learning pace when allocating time to each topic.
  Return the study plan as a text.
  `,
});

const createPersonalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'createPersonalizedStudyPlanFlow',
    inputSchema: CreatePersonalizedStudyPlanInputSchema,
    outputSchema: CreatePersonalizedStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
