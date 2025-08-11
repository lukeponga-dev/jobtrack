
"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ArrowUpDown,
  FileText,
  Users,
  Award,
  XCircle,
  HelpCircle,
  ExternalLink,
  Wand2,
  Loader2,
  ListTodo,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import type { JobApplication } from "@/lib/types";
import { suggestNextSteps } from "@/ai/flows/next-step-suggestions";
import { useToast } from "@/hooks/use-toast";

type SortKey = keyof JobApplication | "";

interface JobApplicationTableProps {
  jobs: JobApplication[];
  searchTerm: string;
  onUpdateJob: (job: JobApplication) => void;
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (id: string) => void;
}

const statusIcons: { [key: string]: React.ElementType } = {
  Applied: FileText,
  Interviewing: Users,
  Offer: Award,
  Rejected: XCircle,
  Unknown: HelpCircle,
};

const statusVariants: { [key: string]: "default" | "secondary" | "destructive" | "outline" | "accent" } = {
  Applied: "secondary",
  Interviewing: "default",
  Offer: "accent",
  Rejected: "destructive",
  Unknown: "outline",
};

function NextStepsDialog({ job, open, onOpenChange, onUpdateJob }: { job: JobApplication | null, open: boolean, onOpenChange: (open: boolean) => void, onUpdateJob: (job: JobApplication) => void }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open && job) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        setSuggestions([]);
        try {
          const result = await suggestNextSteps({
            jobTitle: job.jobTitle,
            company: job.company,
            status: job.status,
            nextSteps: job.nextSteps || "",
          });
          setSuggestions(result.suggestions);
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            title: "An error occurred.",
            description: "Failed to get AI suggestions. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuggestions();
    }
  }, [open, job, toast]);
  
  const handleAddNextStep = (suggestion: string) => {
    if (!job) return;
    const updatedNextSteps = job.nextSteps ? `${job.nextSteps}\n- ${suggestion}` : `- ${suggestion}`;
    onUpdateJob({ ...job, nextSteps: updatedNextSteps });
    onOpenChange(false);
    toast({
        title: "Next Step Added",
        description: "The suggestion has been added to your next steps.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="text-primary"/> AI Next Step Suggestions
          </DialogTitle>
          <DialogDescription>
            Here are some AI-powered suggestions for your application to {job?.company}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="bg-secondary/50 p-3 rounded-md text-sm text-secondary-foreground flex justify-between items-start gap-2">
                  <span>{suggestion}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handleAddNextStep(suggestion.split(':')[0])} title="Add to Next Steps">
                    <ListTodo className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function JobApplicationTable({ jobs, searchTerm, onUpdateJob, onEditJob, onDeleteJob }: JobApplicationTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("dateApplied");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedJob, setSelectedJob] = React.useState<JobApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter(job =>
      Object.values(job).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [jobs, searchTerm, sortKey, sortDirection]);

  const SortableHeader = ({
    columnKey,
    children,
  }: {
    columnKey: SortKey;
    children: React.ReactNode;
  }) => (
    <TableHead onClick={() => handleSort(columnKey)}>
      <Button variant="ghost" className="px-2 py-1">
        {children}
        {sortKey === columnKey && (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </TableHead>
  );

  return (
    <>
      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <SortableHeader columnKey="dateApplied">Date Applied</SortableHeader>
                  <SortableHeader columnKey="jobTitle">Job Title</SortableHeader>
                  <SortableHeader columnKey="company">Company</SortableHeader>
                  <SortableHeader columnKey="status">Status</SortableHeader>
                  <TableHead>Next Steps</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedJobs.length > 0 ? (
                  filteredAndSortedJobs.map((job) => {
                    const StatusIcon = statusIcons[job.status] || HelpCircle;
                    return (
                      <TableRow key={job.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium whitespace-nowrap">
                          {format(job.dateApplied, "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>{job.jobTitle}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariants[job.status] || "outline"} className="gap-1.5 capitalize">
                            <StatusIcon className="h-3.5 w-3.5" />
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs whitespace-pre-wrap">{job.nextSteps || "N/A"}</TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap">
                           <Button variant="outline" size="sm" onClick={() => { setSelectedJob(job); setIsDialogOpen(true); }}>
                             <Wand2 className="mr-2 h-4 w-4" />
                             Suggest
                           </Button>
                          {job.jobLink && (
                            <Button asChild variant="ghost" size="sm">
                              <a href={job.jobLink} target="_blank" rel="noopener noreferrer">
                                View Job
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          )}
                           <Button variant="outline" size="sm" onClick={() => onEditJob(job)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                           </Button>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this job application.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => onDeleteJob(job.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <NextStepsDialog job={selectedJob} open={isDialogOpen} onOpenChange={setIsDialogOpen} onUpdateJob={onUpdateJob} />
    </>
  );
}

    