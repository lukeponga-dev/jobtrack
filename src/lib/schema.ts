import { z } from 'zod';

export const jobApplicationSchema = z.object({
  dateApplied: z.date({ required_error: 'Date applied is required.' }),
  jobTitle: z.string().min(1, 'Job title is required.'),
  company: z.string().min(1, 'Company is required.'),
  jobLink: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  status: z.enum(['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected']),
  proofOrNotes: z.string().optional(),
});

export const volunteerSchema = z.object({
  dateApplied: z.date({ required_error: 'Date applied is required.' }),
  volunteerRole: z.string().min(1, 'Role is required.'),
  organization: z.string().min(1, 'Organisation is required.'),
  contactLink: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  notes: z.string().optional(),
  status: z.enum(['Applied', 'Contacted', 'Active', 'Completed']),
});
