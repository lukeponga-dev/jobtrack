import { z } from 'zod';

export const jobApplicationSchema = z.object({
  dateApplied: z.date({ required_error: 'Date applied is required.' }),
  jobTitle: z.string().min(1, 'Job title is required.'),
  company: z.string().min(1, 'Company is required.'),
  jobLink: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected', 'Unknown']),
  nextSteps: z.string().optional(),
});
