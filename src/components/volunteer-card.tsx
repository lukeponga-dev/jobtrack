
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import type { VolunteerRole } from "@/lib/types";
import { Briefcase, Building, MapPin, Link as LinkIcon, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface VolunteerCardProps {
    volunteerData: VolunteerRole;
    onEdit: (role: VolunteerRole) => void;
    onDelete: (id: string) => void;
}

export default function VolunteerCard({ volunteerData, onEdit, onDelete }: VolunteerCardProps) {
  return (
    <Card className="bg-card text-card-foreground shadow-lg rounded-2xl h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">{volunteerData.role}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
          <div className="flex items-start gap-4 text-sm">
              <Building className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                  <h3 className="font-semibold text-muted-foreground">Organisation</h3>
                  <p className="text-foreground">{volunteerData.organisation}</p>
              </div>
          </div>
          <div className="flex items-start gap-4 text-sm">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                  <h3 className="font-semibold text-muted-foreground">Location</h3>
                  <p className="text-foreground">{volunteerData.location}</p>
              </div>
          </div>
          {volunteerData.link && (
            <div className="flex items-start gap-4 text-sm">
                <LinkIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                    <h3 className="font-semibold text-muted-foreground">Link</h3>
                    <a href={volunteerData.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
                        View Opportunity
                    </a>
                </div>
            </div>
          )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(volunteerData)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this volunteer role.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(volunteerData.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
