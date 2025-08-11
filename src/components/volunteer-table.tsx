
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
import type { VolunteerRole } from "@/lib/types";

interface VolunteerTableProps {
  volunteerRoles: VolunteerRole[];
  onEditVolunteer: (role: VolunteerRole) => void;
  onDeleteVolunteer: (id: string) => void;
}

export default function VolunteerTable({ volunteerRoles, onEditVolunteer, onDeleteVolunteer }: VolunteerTableProps) {
  
  return (
    <div className="table-container bg-white rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold p-6 text-gray-800">Your Volunteer Roles</h2>
        <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 tracker-table">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date Applied</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Volunteer Role</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Organization</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Website/Contact Link</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Notes</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {volunteerRoles.length > 0 ? (
                  volunteerRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{format(role.dateApplied, "dd MMM yyyy")}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{role.volunteerRole}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{role.organization}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                            {role.contactLink && <a href={role.contactLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800">View <ExternalLink className="inline h-4 w-4"/></a>}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{role.notes}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">{role.status}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap space-x-2">
                           <Button variant="outline" size="sm" onClick={() => onEditVolunteer(role)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                           </Button>
                           <Button variant="destructive" size="sm" onClick={() => onDeleteVolunteer(role.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No volunteer roles added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
    </div>
  );
}
