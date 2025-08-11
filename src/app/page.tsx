
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, getCurrentUser } from '@/lib/firebase';
import type { JobApplication, VolunteerRole } from '@/lib/types';
import JobApplicationForm from '@/components/job-application-form';
import JobApplicationTable from '@/components/job-application-table';
import VolunteerApplicationForm from '@/components/volunteer-application-form';
import VolunteerTable from '@/components/volunteer-table';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [volunteerRoles, setVolunteerRoles] = useState<VolunteerRole[]>([]);
  
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [editingVolunteerRole, setEditingVolunteerRole] = useState<VolunteerRole | null>(null);

  const [deletingItem, setDeletingItem] = useState<{type: 'job' | 'volunteer', id: string} | null>(null);

  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');


  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.uid);
          document.getElementById('user-id-display')?.classList.remove('hidden');
          const userIdText = document.getElementById('user-id-text');
          if(userIdText) userIdText.innerText = user.uid;
        } else {
           setAuthError(true);
        }
      } catch (error) {
        console.error("Firebase auth error:", error);
        setAuthError(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  
  const seedData = async (userId: string) => {
    const jobsCollectionRef = collection(db, `users/${userId}/jobApplications`);
    const jobsSnapshot = await getDocs(jobsCollectionRef);
    if (jobsSnapshot.empty) {
 console.log('Seeding initial job applications...');
      const initialJobs: Omit<JobApplication, 'id'>[] = [
        { dateApplied: new Date('2025-08-11'), jobTitle: 'Gardens Team Member', company: 'Mitre 10 MEGA Ruakura', jobLink: 'https://www.seek.co.nz/Mitre-10-jobs/in-Ruakura-Waikato', proofOrNotes: 'N/A', status: 'Applied' },
        { dateApplied: new Date('2025-08-11'), jobTitle: 'part-time supermarket assistant', company: 'foodstuff', jobLink: 'https://foodstuffsni.careercentre.net.nz/Job', proofOrNotes: 'N/A', status: 'Applied' },
        { dateApplied: new Date('2025-08-10'), jobTitle: 'Warehouse Storeperson / Delivery Driver Class 1 for Joinery /Cabinet Maker', company: 'Windsor Industries', jobLink: 'https://www.seek.co.nz/driver-class-1-jobs/in-Hamilton-Waikato', proofOrNotes: 'Picture', status: 'Applied' },
        { dateApplied: new Date('2025-08-10'), jobTitle: 'Christmas Casual - Te Awa', company: 'JB HiFi', jobLink: 'https://www.jbhifi.co.nz/pages/jobs', proofOrNotes: 'Picture', status: 'Applied' },
      ];
      for (const job of initialJobs) {
        try {
          await addDoc(jobsCollectionRef, job);
        } catch (e) {
          console.error("Error adding seeded doc: ", e);
        }
      }
    }

    const volunteerCollectionRef = collection(db, `users/${userId}/volunteerRoles`);
    const volunteerSnapshot = await getDocs(volunteerCollectionRef);
    if (volunteerSnapshot.empty) {
        console.log('Seeding initial volunteer roles...');
        const initialVolunteers: Omit<VolunteerRole, 'id'>[] = [
            { dateApplied: new Date('2025-07-20'), volunteerRole: 'Tree Planting Event', organization: 'Local Council', contactLink: 'https://www.hamilton.govt.nz', notes: 'Checked website', status: 'Applied' },
            { dateApplied: new Date('2025-07-25'), volunteerRole: 'Community Garden Assistant', organization: 'Urban Harvest Trust', contactLink: '', notes: 'Spoke to Sarah at the market', status: 'Contacted' },
        ];
        for (const volunteer of initialVolunteers) {
            try {
              await addDoc(volunteerCollectionRef, volunteer);
            } catch (e) {
              console.error("Error adding seeded doc: ", e);
            }
        }
    }
  };

  useEffect(() => {
    if (!userId) return;

    seedData(userId);

    setLoading(true);
    const jobsCollectionRef = collection(db, `users/${userId}/jobApplications`);
    const unsubscribeJobs = onSnapshot(jobsCollectionRef, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          dateApplied: (data.dateApplied as Timestamp).toDate(),
        } as JobApplication;
      });
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });

    const volunteerRolesCollectionRef = collection(db, `users/${userId}/volunteerRoles`);
    const unsubscribeVolunteers = onSnapshot(volunteerRolesCollectionRef, (snapshot) => {
        const volunteerData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                dateApplied: (data.dateApplied as Timestamp).toDate(),
            } as VolunteerRole;
        });
      setVolunteerRoles(volunteerData);
    }, (error) => {
        console.error("Error fetching volunteer roles:", error);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeVolunteers();
    };
  }, [userId]);

  const addJob = async (newJob: Omit<JobApplication, 'id'>) => {
    if (!userId) {
        toast({ variant: "destructive", title: "Error", description: "You must be signed in to add a job." });
        return;
    }
    try {
      const jobsCollectionRef = collection(db, `users/${userId}/jobApplications`);
      await addDoc(jobsCollectionRef, newJob);
      toast({ title: "Job application added." });
    } catch (error) {
      console.error("Error adding job: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add job application." });
    }
  };

  const updateJob = async (updatedJob: JobApplication) => {
    if (!userId) {
        toast({ variant: "destructive", title: "Error", description: "You must be signed in to update a job." });
        return;
    }
    try {
      const jobDocRef = doc(db, `users/${userId}/jobApplications`, updatedJob.id);
      const { id, ...jobData } = updatedJob;
      await updateDoc(jobDocRef, jobData);
      setEditingJob(null);
      toast({ title: "Job application updated." });
    } catch (error) {
      console.error("Error updating job: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update job application." });
    }
  };

  const addVolunteerRole = async (newRole: Omit<VolunteerRole, 'id'>) => {
    if (!userId) {
        toast({ variant: "destructive", title: "Error", description: "You must be signed in to add a volunteer role." });
        return;
    }
    try {
      const volunteerRolesCollectionRef = collection(db, `users/${userId}/volunteerRoles`);
      await addDoc(volunteerRolesCollectionRef, newRole);
      toast({ title: "Volunteer role added." });
    } catch (error) {
      console.error("Error adding volunteer role: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add volunteer role." });
    }
  };

  const updateVolunteerRole = async (updatedRole: VolunteerRole) => {
    if (!userId) {
        toast({ variant: "destructive", title: "Error", description: "You must be signed in to update a volunteer role." });
        return;
    }
    try {
      const volunteerDocRef = doc(db, `users/${userId}/volunteerRoles`, updatedRole.id);
      const { id, ...roleData } = updatedRole;
      await updateDoc(volunteerDocRef, roleData);
      setEditingVolunteerRole(null);
      toast({ title: "Volunteer role updated." });
    } catch (error)
{
      console.error("Error updating volunteer role: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update volunteer role." });
    }
  };
  
  const confirmDelete = async () => {
    if (!deletingItem || !userId) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete item." });
        return;
    }
    
    const {type, id} = deletingItem;
    const collectionName = type === 'job' ? 'jobApplications' : 'volunteerRoles';

    try {
        const itemDocRef = doc(db, `users/${userId}/${collectionName}`, id);
        await deleteDoc(itemDocRef);
        toast({ title: `${type === 'job' ? 'Job application' : 'Volunteer role'} deleted.` });
    } catch(error) {
        console.error(`Error deleting ${type}:`, error);
        toast({ variant: "destructive", title: "Error", description: `Could not delete ${type}.` });
    } finally {
        setDeletingItem(null);
    }
  }


  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (authError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h2>
        <p className="text-lg mb-2">Could not sign in to Firebase.</p>
        <p className="text-muted-foreground">Please go to the Firebase Console, select your project, and ensure that <span className="font-semibold text-foreground">Authentication</span> is enabled, with the <span className="font-semibold text-foreground">"Anonymous"</span> sign-in provider activated.</p>
      </div>
    )
  }

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleEditVolunteer = (role: VolunteerRole) => {
    setEditingVolunteerRole(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancelEditingJob = () => {
    setEditingJob(null);
  }
  
  const cancelEditingVolunteer = () => {
    setEditingVolunteerRole(null);
  }


  return (
    <main className="p-4 sm:p-8 bg-background">
     <div className="max-w-7xl mx-auto bg-card p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
        <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-2">
                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500">
                    Your Application Hub
                </span>
            </h1>
            <p className="text-lg text-muted-foreground">Track your job and volunteer applications with ease.</p>
            <div id="user-id-display" className="mt-4 text-sm text-muted-foreground hidden">
                <p>Your User ID:</p>
                <span id="user-id-text" className="font-mono bg-muted px-2 py-1 rounded-md text-sm break-all">Loading...</span>
            </div>
        </header>

         <div className="flex justify-center mb-8 bg-muted p-1 rounded-xl shadow-inner">
            <button 
                onClick={() => setActiveTab('jobs')}
                className={`flex-1 px-4 py-2 text-lg font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${activeTab === 'jobs' ? 'bg-sky-600 text-white shadow-md' : 'text-foreground hover:bg-secondary'}`}
            >
                Job Applications
            </button>
            <button 
                onClick={() => setActiveTab('volunteer')}
                className={`flex-1 px-4 py-2 text-lg font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${activeTab === 'volunteer' ? 'bg-sky-600 text-white shadow-md' : 'text-foreground hover:bg-secondary'}`}
            >
                Volunteer Roles
            </button>
        </div>

        <div id="job-content" className={activeTab === 'jobs' ? '' : 'hidden'}>
            <JobApplicationForm
                onAddJob={editingJob ? (values) => updateJob({ ...values, id: editingJob.id }) : addJob}
                initialData={editingJob}
                onCancel={editingJob ? cancelEditingJob : undefined}
            />
            <JobApplicationTable 
                jobs={jobs} 
                onEditJob={handleEditJob} 
                onDeleteJob={(id) => setDeletingItem({type: 'job', id})} 
            />
        </div>
        
        <div id="volunteer-content" className={activeTab === 'volunteer' ? '' : 'hidden'}>
            <VolunteerApplicationForm
                onAddVolunteerRole={editingVolunteerRole ? (values) => updateVolunteerRole({ ...values, id: editingVolunteerRole.id }) : addVolunteerRole}
                initialData={editingVolunteerRole}
                onCancel={editingVolunteerRole ? cancelEditingVolunteer : undefined}
            />
            <VolunteerTable 
                volunteerRoles={volunteerRoles} 
                onEditVolunteer={handleEditVolunteer} 
                onDeleteVolunteer={(id) => setDeletingItem({type: 'volunteer', id})}
            />
        </div>

      </div>
      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                Are you sure you want to permanently delete this entry? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingItem(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

    