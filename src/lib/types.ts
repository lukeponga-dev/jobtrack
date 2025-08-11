import type { z } from 'zod';
import type { jobApplicationSchema, volunteerSchema } from '@/lib/schema';

export type JobApplication = z.infer<typeof jobApplicationSchema> & { id: string };

export type VolunteerRole = z.infer<typeof volunteerSchema> & { id: string };
