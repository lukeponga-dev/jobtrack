
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db, getCurrentUser } from '@/lib/firebase';
import type { JobApplication, VolunteerRole } from '@/lib/types';
import JobApplicationForm from '@/components/job-application-form';
import JobApplicationTable from '@/components/job-application-table';
import VolunteerCard from '@/components/volunteer-card';
import CoverLetterRewriter from '@/components/cover-letter-rewriter';
import { Input } from '@/components/ui/input';
import VolunteerApplicationForm from '@/components/volunteer-application-form';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [volunteerRoles, setVolunteerRoles] = useState<VolunteerRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVolunteerRole, setEditingVolunteerRole] = useState<VolunteerRole | null>(null);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.uid);
        } else {
          // This case might happen if sign-in is pending or fails silently.
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

  useEffect(() => {
    if (!userId) return;

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
      const volunteerData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as VolunteerRole));
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
      // Omit 'id' from the object to be written to Firestore
      const { id, ...jobData } = updatedJob;
      await updateDoc(jobDocRef, jobData);
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

  const deleteVolunteerRole = async (roleId: string) => {
    if (!userId) {
        toast({ variant: "destructive", title: "Error", description: "You must be signed in to delete a volunteer role." });
        return;
    }
    try {
      const volunteerDocRef = doc(db, `users/${userId}/volunteerRoles`, roleId);
      await deleteDoc(volunteerDocRef);
      toast({ title: "Volunteer role deleted." });
    } catch (error) {
      console.error("Error deleting volunteer role: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete volunteer role." });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (authError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h2>
        <p className="text-lg text-gray-700 mb-2">Could not sign in to Firebase.</p>
        <p className="text-gray-600">Please go to the Firebase Console, select your project, and ensure that <span className="font-semibold">Authentication</span> is enabled, with the <span className="font-semibold">"Anonymous"</span> sign-in provider activated.</p>
      </div>
    )
  }

  return (
    <main className="p-4 md:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-headline">CareerCompass</h1>
            <p className="text-lg text-gray-600">All your job applications in one place.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 space-y-8">
            {editingVolunteerRole ? (
                <VolunteerApplicationForm
                  onAddVolunteerRole={(values) => updateVolunteerRole({ ...values, id: editingVolunteerRole.id })}
                  initialData={editingVolunteerRole}
                  onCancel={() => setEditingVolunteerRole(null)}
                />
              ) : (
                <JobApplicationForm onAddJob={addJob} />
            )}
            
            {!editingVolunteerRole && <VolunteerApplicationForm onAddVolunteerRole={addVolunteerRole} />}
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
                    <VolunteerCard
                      key={role.id}
                      volunteerData={role}
                      onEdit={() => setEditingVolunteerRole(role)}
                      onDelete={() => deleteVolunteerRole(role.id)}
                    />
                ))}
            </div>
        </div>
      </div>
    </main>
  );
}
