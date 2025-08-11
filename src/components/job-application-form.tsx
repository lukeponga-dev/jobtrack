
"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobApplicationSchema } from "@/lib/schema";
import type { JobApplication } from "@/lib/types";

interface JobApplicationFormProps {
  onAddJob: (job: Omit<JobApplication, 'id'> | JobApplication) => void;
  initialData?: JobApplication | null;
  onCancel?: () => void;
}

export default function JobApplicationForm({ onAddJob, initialData, onCancel }: JobApplicationFormProps) {
  const isEditing = !!initialData;

  const form = useForm<Omit<JobApplication, 'id'>>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      dateApplied: new Date(),
      jobTitle: "",
      company: "",
      jobLink: "",
      status: "Applied",
      proofOrNotes: "",
    },
  });
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        dateApplied: new Date(initialData.dateApplied),
      });
    } else {
      form.reset({
        dateApplied: new Date(),
        jobTitle: "",
        company: "",
        jobLink: "",
        status: "Applied",
        proofOrNotes: "",
      });
    }
  }, [initialData, form]);

  function onSubmit(values: Omit<JobApplication, 'id'>) {
    onAddJob(values);
    if (!isEditing) {
      form.reset();
      form.setValue('dateApplied', new Date());
    }
  }

  return (
    <div className="bg-gray-50 p-6 md:p-8 rounded-2xl mb-8 shadow-inner border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Job Application' : 'Add New Job Application'}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateApplied"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Applied</FormLabel>
                      <FormControl>
                        <Input 
                            type="date" 
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
                            value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Store Assistant" {...field} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Foodstuffs" {...field} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Link</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., https://www.seek.co.nz/job/..." {...field} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proofOrNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proof/Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Picture or notes" {...field} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                      <SelectItem value="Interview">Interview</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-sky-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 h-auto">
                    {isEditing ? 'Save Changes' : 'Add Job Application'}
                </Button>
               {isEditing && (
                  <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 bg-gray-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-300 transform hover:scale-105 h-auto">
                    Cancel
                  </Button>
                )}
            </div>
          </form>
        </Form>
    </div>
  );
}
