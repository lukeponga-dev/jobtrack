"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VolunteerData } from "@/lib/types";
import { Briefcase, Building, MapPin, Link as LinkIcon } from "lucide-react";

interface VolunteerCardProps {
    volunteerData: VolunteerData;
}

export default function VolunteerCard({ volunteerData }: VolunteerCardProps) {
  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Volunteer Role Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
                <Briefcase className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold text-gray-700">Role</h3>
                    <p className="text-gray-900">{volunteerData.role}</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <Building className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold text-gray-700">Organisation</h3>
                    <p className="text-gray-900">{volunteerData.organisation}</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold text-gray-700">Location</h3>
                    <p className="text-gray-900">{volunteerData.location}</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <LinkIcon className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h3 className="font-semibold text-gray-700">Link</h3>
                    <a href={volunteerData.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
                        {volunteerData.link}
                    </a>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
