'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating a personalized study plan.
 *
 * The flow takes syllabus, timeframe, learning pace, and past exam papers as input
 * and generates a prioritized timetable with clear study and break intervals to maximize the student's exam score.
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

const StudyPlanItemSchema = z.object({
  day: z.string().describe('Day of the study plan (e.g., "Day 1", "Week 1 - Monday").'),
  topic: z.string().describe('The topic to study.'),
  studyBlocks: z.string().describe('A clear description of study and break periods (e.g., "2 study blocks of 25 mins with a 5 min break").'),
  priority: z.string().describe('Priority of the topic (e.g., "High", "Medium", "Low").'),
  maxTimeToCover: z.string().describe('The maximum time to spend on this topic, in a human-readable format (e.g., "4 hours", "90 minutes").'),
});

const CreatePersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z.array(StudyPlanItemSchema).describe('A prioritized timetable for studying, structured as a list of items.'),
});
export type CreatePersonalizedStudyPlanOutput = z.infer<typeof CreatePersonalizedStudyPlanOutputSchema>;

export async function createPersonalizedStudyPlan(input: CreatePersonalizedStudyPlanInput): Promise<CreatePersonalizedStudyPlanOutput> {
  return createPersonalizedStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPersonalizedStudyPlanPrompt',
  input: {schema: CreatePersonalizedStudyPlanInputSchema},
  output: {schema: CreatePersonalizedStudyPlanOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI Exam Strategist. Your goal is to generate a personalized and prioritized study plan for a student based on their syllabus, timeframe, learning pace, and past exam papers.

  Syllabus: {{{syllabus}}}
  Timeframe: {{{timeframe}}}
  Learning Pace: {{{learningPace}}}
  Past Exam Papers: {{{pastExamPapers}}}

  Based on this information, create a prioritized timetable to maximize the student's exam score in the limited time they have.
  The study plan should be clear, concise, and easy to follow. Instead of using "Pomodoro sessions," explicitly define the study periods and breaks. For example, "2 study blocks of 25 mins with a 5 min break in between". A standard study block is 25 minutes, followed by a 5-minute break. After four blocks, suggest a longer break of 15-30 minutes.
  
  The plan should include:
  - The day/date.
  - The specific topic to study.
  - The study blocks and breaks (e.g., "3 study blocks of 25 mins with 5 min breaks").
  - The priority of the topic.
  - The maximum total time to cover the topic (e.g., "90 minutes").
  
  Consider the student's learning pace when allocating time. Return the study plan as a structured array of study items.
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
