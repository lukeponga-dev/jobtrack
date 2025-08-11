import type { z } from 'zod';
import type { jobApplicationSchema } from '@/lib/schema';

export type JobApplication = z.infer<typeof jobApplicationSchema> & { id: string };

export type VolunteerData = {
  role: string;
  organisation: string;
  location: string;
  link: string;
};
