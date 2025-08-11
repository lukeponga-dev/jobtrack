
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-new"


export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [volunteerRoles, setVolunteerRoles] = useState<VolunteerRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [editingVolunteerRole, setEditingVolunteerRole] = useState<VolunteerRole | null>(null);
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
  
  const seedData = async (userId: string) => {
    const jobsCollectionRef = collection(db, `users/${userId}/jobApplications`);
    const snapshot = await getDocs(jobsCollectionRef);
    if (snapshot.empty) {
      console.log('Seeding initial job applications...');
      const initialJobs: Omit<JobApplication, 'id'>[] = [
        { dateApplied: new Date('2025-10-08'), jobTitle: 'Christmas Casual - Te Awa', company: 'JB HiFi', jobLink: 'https://www.seek.co.nz/job/86361743?tracking=SHR-AND-SharedJob-anz-2', status: 'Applied', proofOrNotes: '' },
        { dateApplied: new Date('2025-10-08'), jobTitle: 'Warehouse Storeperson / Delivery Driver Class 1 for Joinery /Cabinet Maker', company: 'Windsor Industries', jobLink: 'https://www.seek.co.nz/job/86303037?tracking=SHR-AND-SharedJob-anz-2', status: 'Applied', proofOrNotes: '' },
        { dateApplied: new Date('2025-11-08'), jobTitle: 'part-time supermarket assistant', company: 'foodstuff', jobLink: '', status: 'Applied', proofOrNotes: '' },
        { dateApplied: new Date('2025-11-08'), jobTitle: 'Gardens Team Member', company: 'Mitre 10 MEGA Ruakura', jobLink: 'https://mitre10.careercentre.net.nz/job/gardens-team-member-mitre-10-mega-ruakura/mitre-10-mega-ruakura/28628', status: 'Applied', proofOrNotes: '' },
      ];
      for (const job of initialJobs) {
        try {
          await addDoc(jobsCollectionRef, job);
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
      const { id, ...jobData } = updatedJob;
      await updateDoc(jobDocRef, jobData);
      setEditingJob(null);
      toast({ title: "Job application updated." });
    } catch (error) {
      console.error("Error updating job: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update job application." });
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "You must be signed in to delete a job." });
      return;
    }
    try {
      const jobDocRef = doc(db, `users/${userId}/jobApplications`, jobId);
      await deleteDoc(jobDocRef);
      toast({ title: "Job application deleted." });
    } catch (error) {
      console.error("Error deleting job: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete job application." });
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
        <p className="text-lg mb-2">Could not sign in to Firebase.</p>
        <p className="text-muted-foreground">Please go to the Firebase Console, select your project, and ensure that <span className="font-semibold text-foreground">Authentication</span> is enabled, with the <span className="font-semibold text-foreground">"Anonymous"</span> sign-in provider activated.</p>
      </div>
    )
  }

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
    setEditingVolunteerRole(null);
    setActiveTab('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditVolunteer = (role: VolunteerRole) => {
    setEditingVolunteerRole(role);
    setEditingJob(null);
    setActiveTab('volunteer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingJob(null);
    setEditingVolunteerRole(null);
  }

  const isEditing = !!editingJob || !!editingVolunteerRole;

  return (
    <main className="p-4 md:p-8 bg-background text-foreground">
      <div className="container mx-auto max-w-4xl">
        <header className="text-left mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-2 font-headline">Your Application Hub</h1>
            <p className="text-lg text-muted-foreground">Track your job and volunteer applications with ease.</p>
            {userId && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Your User ID:</p>
                <p className="text-sm font-mono p-2 bg-muted rounded-md inline-block">{userId}</p>
              </div>
            )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="jobs">Job Applications</TabsTrigger>
                <TabsTrigger value="volunteer">Volunteer Roles</TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-1 space-y-8">
                        <JobApplicationForm
                            onAddJob={editingJob ? (values) => updateJob({ ...values, id: editingJob.id }) : addJob}
                            initialData={editingJob}
                            onCancel={isEditing ? cancelEditing : undefined}
                            />
                    </div>
                     <div className="lg:col-span-2">
                        <div className="mb-6">
                            <Input 
                            type="text" 
                            id="searchInput" 
                            placeholder="Search by Job Title, Company, or Status..." 
                            className="w-full p-3 rounded-lg border-2 focus:border-primary transition-colors bg-input shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <JobApplicationTable jobs={jobs} searchTerm={searchTerm} onUpdateJob={updateJob} onEditJob={handleEditJob} onDeleteJob={deleteJob} />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="volunteer">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-1 space-y-8">
                         <VolunteerApplicationForm
                            onAddVolunteerRole={editingVolunteerRole ? (values) => updateVolunteerRole({ ...values, id: editingVolunteerRole.id }) : addVolunteerRole}
                            initialData={editingVolunteerRole}
                            onCancel={isEditing ? cancelEditing : undefined}
                         />
                    </div>
                    <div className="lg:col-span-2">
                         <h2 className="text-3xl font-bold text-gray-800 mb-4 font-headline">Volunteering</h2>
                            {volunteerRoles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {volunteerRoles.map(role => (
                                    <VolunteerCard
                                        key={role.id}
                                        volunteerData={role}
                                        onEdit={() => handleEditVolunteer(role)}
                                        onDelete={() => deleteVolunteerRole(role.id)}
                                    />
                                ))}
                            </div>
                            ) : (
                            <Card className="shadow-lg rounded-2xl border-dashed bg-card">
                                <CardContent className="p-6 text-center">
                                <p className="text-muted-foreground">No volunteer roles added yet. Add one using the form!</p>
                                </CardContent>
                            </Card>
                            )}
                    </div>
                 </div>
            </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
