
"use client";

import * as React from 'react';
import { useState } from 'react';
import type { JobApplication, VolunteerRole } from '@/lib/types';
import JobApplicationForm from '@/components/job-application-form';
import JobApplicationTable from '@/components/job-application-table';
import VolunteerCard from '@/components/volunteer-card';
import CoverLetterRewriter from '@/components/cover-letter-rewriter';
import { Input } from '@/components/ui/input';
import VolunteerApplicationForm from '@/components/volunteer-application-form';

const initialJobData: JobApplication[] = [
    { id: '1', dateApplied: new Date('2025-08-10'), jobTitle: 'Christmas Casual - Te Awa', company: 'JB HiFi', jobLink: 'https://www.seek.co.nz/job/86361743', status: 'Applied', nextSteps: 'Continue search, prepare for possible interview' },
    { id: '2', dateApplied: new Date('2025-08-10'), jobTitle: 'Warehouse Storeperson / Delivery Driver', company: 'Windsor Industries', jobLink: 'https://www.seek.co.nz/job/86303037', status: 'Applied', nextSteps: 'Await response, check follow-up date' },
    { id: '3', dateApplied: new Date('2025-08-11'), jobTitle: 'Part-time Supermarket Assistant', company: 'Foodstuff', jobLink: '', status: 'Applied', nextSteps: '' },
    { id: '4', dateApplied: new Date('2025-08-11'), jobTitle: 'Gardens Team Member', company: 'Mitre 10 MEGA Ruakura', jobLink: 'https://mitre10.careercentre.net.nz/job/gardens-team-member-mitre-10-mega-ruakura/mitre-10-mega-ruakura/28628', status: 'Unknown', nextSteps: '' },
];

const initialVolunteerData: VolunteerRole[] = [
    {
        id: '1',
        role: 'Digital Translations Support Volunteer – Wix & Canva',
        organisation: 'Insight Endometriosis',
        location: 'Home-based (Waikato, NZ)',
        link: 'https://volunteeringwaikato.org.nz/volunteer/positions/1415/red-cross-shop-volunteer-frankton-village-shop'
    }
];

export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>(initialJobData);
  const [volunteerRoles, setVolunteerRoles] = useState<VolunteerRole[]>(initialVolunteerData);
  const [searchTerm, setSearchTerm] = useState('');

  const addJob = (newJob: Omit<JobApplication, 'id'>) => {
    setJobs(prevJobs => [{ ...newJob, id: crypto.randomUUID() }, ...prevJobs]);
  };
  
  const updateJob = (updatedJob: JobApplication) => {
    setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
  };
  
  const addVolunteerRole = (newRole: Omit<VolunteerRole, 'id'>) => {
    setVolunteerRoles(prevRoles => [{ ...newRole, id: crypto.randomUUID() }, ...prevRoles]);
  };


  return (
    <main className="p-4 md:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-headline">CareerCompass</h1>
            <p className="text-lg text-gray-600">All your job applications in one place.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 space-y-8">
            <JobApplicationForm onAddJob={addJob} />
            <VolunteerApplicationForm onAddVolunteerRole={addVolunteerRole} />
          </div>
          <div className="lg:col-span-2">
            <CoverLetterRewriter />
          </div>
        </div>

        <div className="mb-6">
            <Input 
              type="text" 
              id="searchInput" 
              placeholder="Search by Job Title, Company, or Status..." 
              className="w-full p-3 rounded-xl border-2 focus:border-primary transition-colors bg-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <JobApplicationTable jobs={jobs} searchTerm={searchTerm} onUpdateJob={updateJob} />
        
        <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-headline">Volunteering</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {volunteerRoles.map(role => (
                    <VolunteerCard key={role.id} volunteerData={role} />
                ))}
            </div>
        </div>
      </div>
    </main>
  );
}
