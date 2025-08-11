
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
      nextSteps: "",
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
        nextSteps: "",
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
    <Card className="shadow-xl rounded-2xl h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">{isEditing ? 'Edit Application' : 'Add New Application'}</CardTitle>
        </div>
        <CardDescription>{isEditing ? "Update the details of this job application." : "Enter the details of a new job you've applied for."}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer" {...field} className="bg-white" />
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
                    <Input placeholder="e.g., Google" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                            "w-full pl-3 text-left font-normal bg-white",
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
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
             <FormField
              control={form.control}
              name="jobLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="nextSteps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Steps</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Follow up next week" {...field} className="bg-white" />
                  </FormControl>
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

    