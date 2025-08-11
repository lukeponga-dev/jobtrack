'use server';

/**
 * @fileOverview AI-powered cover letter rewrite flow.
 *
 * - rewriteCoverLetter - A function that rewrites the cover letter based on the job description.
 * - RewriteCoverLetterInput - The input type for the rewriteCoverLetter function.
 * - RewriteCoverLetterOutput - The return type for the rewriteCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteCoverLetterInputSchema = z.object({
  coverLetter: z.string().describe('The original cover letter text.'),
  jobDescription: z.string().describe('The job description text.'),
});
export type RewriteCoverLetterInput = z.infer<typeof RewriteCoverLetterInputSchema>;

const RewriteCoverLetterOutputSchema = z.object({
  rewrittenCoverLetter: z.string().describe('The rewritten cover letter text tailored to the job description.'),
});
export type RewriteCoverLetterOutput = z.infer<typeof RewriteCoverLetterOutputSchema>;

export async function rewriteCoverLetter(input: RewriteCoverLetterInput): Promise<RewriteCoverLetterOutput> {
  return rewriteCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteCoverLetterPrompt',
  input: {schema: RewriteCoverLetterInputSchema},
  output: {schema: RewriteCoverLetterOutputSchema},
  prompt: `You are an expert resume and cover letter writer.

You will rewrite the user's cover letter to be more tailored to the job description provided.

Cover Letter: {{{coverLetter}}}

Job Description: {{{jobDescription}}}

Rewrite the cover letter to highlight the most relevant skills and experience for the job description, while maintaining a professional tone. Focus on the most important qualifications in the job description.
`,
});

const rewriteCoverLetterFlow = ai.defineFlow(
  {
    name: 'rewriteCoverLetterFlow',
    inputSchema: RewriteCoverLetterInputSchema,
    outputSchema: RewriteCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
