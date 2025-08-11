
"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusCircle, X } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { volunteerSchema } from "@/lib/schema";
import type { VolunteerRole } from "@/lib/types";

interface VolunteerApplicationFormProps {
  onAddVolunteerRole: (role: Omit<VolunteerRole, 'id'>) => void;
  initialData?: VolunteerRole | null;
  onCancel?: () => void;
}

export default function VolunteerApplicationForm({ onAddVolunteerRole, initialData, onCancel }: VolunteerApplicationFormProps) {
  const isEditing = !!initialData;

  const form = useForm<Omit<VolunteerRole, 'id'>>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: initialData || {
      role: "",
      organisation: "",
      location: "",
      link: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        role: "",
        organisation: "",
        location: "",
        link: "",
      });
    }
  }, [initialData, form]);

  function onSubmit(values: Omit<VolunteerRole, 'id'>) {
    onAddVolunteerRole(values);
    if (!isEditing) {
      form.reset();
    }
  }

  return (
    <Card className="shadow-xl rounded-2xl h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">{isEditing ? "Edit Volunteer Role" : "Add Volunteer Role"}</CardTitle>
        </div>
        <CardDescription>{isEditing ? "Update the details of this volunteer role." : "Enter the details of a new volunteer role."}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Event Volunteer" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Red Cross" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hamilton, NZ" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} className="bg-white" />
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
                <Button type="submit">{isEditing ? "Save Changes" : "Add Role"}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
