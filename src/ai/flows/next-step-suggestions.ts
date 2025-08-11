'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating AI-powered next step suggestions for job applications.
 *
 * - suggestNextSteps - A function that generates next step suggestions.
 * - NextStepSuggestionsInput - The input type for the suggestNextSteps function.
 * - NextStepSuggestionsOutput - The return type for the suggestNextSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NextStepSuggestionsInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job application.'),
  company: z.string().describe('The company the application was submitted to.'),
  status: z.string().describe('The current status of the job application (e.g., Applied, Interviewing, Offer, Rejected, Unknown).'),
  nextSteps: z.string().describe('The next steps to take in the job application process.'),
});
export type NextStepSuggestionsInput = z.infer<typeof NextStepSuggestionsInputSchema>;

const NextStepSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of AI-powered suggestions for next steps, with reasoning.'),
});
export type NextStepSuggestionsOutput = z.infer<typeof NextStepSuggestionsOutputSchema>;

export async function suggestNextSteps(input: NextStepSuggestionsInput): Promise<NextStepSuggestionsOutput> {
  return nextStepSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nextStepSuggestionsPrompt',
  input: {schema: NextStepSuggestionsInputSchema},
  output: {schema: NextStepSuggestionsOutputSchema},
  prompt: `You are a career advisor providing suggestions for next steps in a job application process.

  Based on the job title, company, current status, and any next steps the user has already identified, provide a list of suggestions for the user with detailed reasoning.

  Job Title: {{{jobTitle}}}
  Company: {{{company}}}
  Status: {{{status}}}
  Next Steps (User):
  {{#if nextSteps}}
  {{{nextSteps}}}
  {{else}}
  None.
  {{/if}}
  `,
});

const nextStepSuggestionsFlow = ai.defineFlow(
  {
    name: 'nextStepSuggestionsFlow',
    inputSchema: NextStepSuggestionsInputSchema,
    outputSchema: NextStepSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
