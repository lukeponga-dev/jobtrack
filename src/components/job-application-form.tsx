
"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        dateApplied: new Date(initialData.dateApplied) // Ensure date is a Date object
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
    }
  }

  return (
    <Card className="bg-card text-card-foreground shadow-lg rounded-2xl h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isEditing ? 'Edit Application' : 'Add New Job Application'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="dateApplied"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Applied</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-input",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Input placeholder="e.g., Store Assistant" {...field} className="bg-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Foodstuffs" {...field} className="bg-input" />
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
                    <Input placeholder="e.g., https://www.seek.co.nz/job/..." {...field} className="bg-input" />
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
                    <Input placeholder="e.g., Picture or notes" {...field} className="bg-input" />
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
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Interviewing">Interviewing</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-2 gap-2">
               {isEditing && (
                  <Button type="button" variant="ghost" onClick={onCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
                <Button type="submit">{isEditing ? 'Save Changes' : 'Add Job'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
