
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { VolunteerRole } from "@/lib/types";
import { Briefcase, Building, MapPin, Link as LinkIcon } from "lucide-react";

interface VolunteerCardProps {
    volunteerData: VolunteerRole;
}

export default function VolunteerCard({ volunteerData }: VolunteerCardProps) {
  return (
    <Card className="shadow-xl rounded-2xl h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">{volunteerData.role}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="flex items-start gap-4 text-sm">
              <Building className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                  <h3 className="font-semibold text-gray-700">Organisation</h3>
                  <p className="text-gray-900">{volunteerData.organisation}</p>
              </div>
          </div>
          <div className="flex items-start gap-4 text-sm">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-900">{volunteerData.location}</p>
              </div>
          </div>
          {volunteerData.link && (
            <div className="flex items-start gap-4 text-sm">
                <LinkIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                    <h3 className="font-semibold text-gray-700">Link</h3>
                    <a href={volunteerData.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
                        View Opportunity
                    </a>
                </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
