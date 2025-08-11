
"use client";

import * as React from "react";
import { format } from "date-fns";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { JobApplication } from "@/lib/types";

interface JobApplicationTableProps {
  jobs: JobApplication[];
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (id: string) => void;
}

export default function JobApplicationTable({ jobs, onEditJob, onDeleteJob }: JobApplicationTableProps) {
  
  return (
    <div className="table-container bg-white rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold p-6 text-gray-800">Your Job Applications</h2>
        <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 tracker-table">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date Applied</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Job Title</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Company</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Job Link</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Proof/Notes</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{format(job.dateApplied, "dd MMM yyyy")}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{job.jobTitle}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{job.company}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                            {job.jobLink && <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800">View <ExternalLink className="inline h-4 w-4"/></a>}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{job.proofOrNotes}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{job.status}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap space-x-2">
                           <Button variant="outline" size="sm" onClick={() => onEditJob(job)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                           </Button>
                           <Button variant="destructive" size="sm" onClick={() => onDeleteJob(job.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No job applications added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
    </div>
  );
}
