"use client";

import { Card, CardContent } from "../../components/ui/card";
import { LocationsMap } from "../../components/home/locations/LocationsMap";
import { useLocations } from "../../hooks/useLocations";
import { useSportMatches } from "../../hooks/useSportMatches";
import { useParticipant } from "../../hooks/useParticipant";
import { useSports } from "../../hooks/useSports";
import { useSchools } from "../../hooks/useSchools";
import { MapPin } from "lucide-react";
import { useMemo } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/home/appSideBar/AppSidebar";
import { Match } from "../../api/hyperionSchemas";

export default function LocationsPage() {
  const { locations, isLoading } = useLocations();
  const { meParticipant } = useParticipant();
  const { sportMatches } = useSportMatches({
    sportId: meParticipant?.sport_id,
  });
  const { sports } = useSports();

  const locationsWithMatches = useMemo(() => {
    if (!locations || !sportMatches) return [];

    const now = new Date();

    return locations.map((location) => {
      const locationMatches = sportMatches.filter(
        (match: Match) => match.location_id === location.id,
      );

      const upcomingMatches = locationMatches
        .filter((match: Match) => match.date && new Date(match.date) > now)
        .sort((a: Match, b: Match) => {
          const dateA = new Date(a.date!).getTime();
          const dateB = new Date(b.date!).getTime();
          return dateA - dateB;
        });

      const nextMatch = upcomingMatches[0];
      const totalMatches = upcomingMatches.length;

      return {
        ...location,
        nextMatch,
        totalMatches,
        upcomingMatches,
      };
    });
  }, [locations, sportMatches]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="flex flex-col relative overflow-auto h-full m-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Lieux de Compétition
                </h1>
                <p className="text-muted-foreground">
                  Découvrez tous les lieux où se déroulent les matchs avec accès
                  direct aux cartes
                </p>
              </div>
            </div>
            <LocationsMap
              locations={locations || []}
              locationsWithMatches={locationsWithMatches}
              sports={sports}
              className="h-[700px] w-full"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
