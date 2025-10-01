"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  UpcomingVolunteerShifts,
  PastVolunteerShifts,
  AvailableVolunteerShifts,
} from "../../components/home/volunteer-shifts";
import { useVolunteer } from "../../hooks/useVolunteer";
import { useVolunteerShifts } from "../../hooks/useVolunteerShifts";
import { Users, Award, TrendingUp } from "lucide-react";
import { VolunteerRegistrationComplete } from "../../api/hyperionSchemas";
import { useMemo } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/home/appSideBar/AppSidebar";

export default function VolunteerShiftsPage() {
  const { volunteer, isLoading } = useVolunteer();
  const { volunteerShifts } = useVolunteerShifts();

  const volunteerStats = useMemo(() => {
    if (!volunteer || volunteer.length === 0) {
      return {
        upcomingShifts: [],
        pastShifts: [],
        doneValue: 0,
        potentialValue: 0,
      };
    }

    const now = new Date();
    const nowTime = now.getTime();

    return volunteer.reduce(
      (acc, registration: VolunteerRegistrationComplete) => {
        const shift = registration.shift;
        const shiftStartTime = new Date(shift.start_time).getTime();

        // Add to total potential value
        acc.potentialValue += shift.value;

        if (shiftStartTime > nowTime) {
          acc.upcomingShifts.push({
            ...registration,
            _shiftStartTime: shiftStartTime,
          });
        } else {
          // Add to done value for past shifts
          acc.doneValue += shift.value;
          acc.pastShifts.push({
            ...registration,
            _shiftStartTime: shiftStartTime,
          });
        }

        return acc;
      },
      {
        upcomingShifts: [] as (VolunteerRegistrationComplete & {
          _shiftStartTime: number;
        })[],
        pastShifts: [] as (VolunteerRegistrationComplete & {
          _shiftStartTime: number;
        })[],
        doneValue: 0,
        potentialValue: 0,
      },
    );
  }, [volunteer]);

  const registeredShiftIds = useMemo(() => {
    if (!volunteer || volunteer.length === 0) {
      return [];
    }
    return volunteer.map((reg) => reg.shift.id);
  }, [volunteer]);

  const { upcomingShifts, pastShifts, doneValue, potentialValue } =
    volunteerStats;

  // Sort shifts by time
  useMemo(() => {
    upcomingShifts.sort((a, b) => a._shiftStartTime - b._shiftStartTime);
    pastShifts.sort((a, b) => b._shiftStartTime - a._shiftStartTime);
  }, [upcomingShifts, pastShifts]);

  if (isLoading) {
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
            <div className="flex items-center justify-center py-12">
              <p>Chargement...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!volunteer || volunteer.length === 0) {
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Mes Créneaux Bénévoles
                  </h1>
                  <p className="text-muted-foreground">
                    Suivez tous vos créneaux de bénévolat passés et à venir
                  </p>
                </div>
              </div>
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucun créneau de bénévolat
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Vous n&apos;êtes inscrit à aucun créneau de bénévolat pour
                    le moment.
                  </p>
                </CardContent>
              </Card>

              {/* Value Cards for New Users */}
              <Card className="p-4">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        0.0 pts
                      </div>
                      <p className="text-xs text-muted-foreground">Acquise</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        0.0 pts
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Potentielle
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Available Shifts for New Users */}
              <div>
                <AvailableVolunteerShifts
                  shifts={volunteerShifts || []}
                  registeredShiftIds={[]}
                />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Mes Créneaux Bénévoles
                </h1>
                <p className="text-muted-foreground">
                  Suivez tous vos créneaux de bénévolat passés et à venir
                </p>
              </div>
            </div>

            {/* Value Cards */}
            <Card className="p-4">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5" />
                  <div>
                    <div className="text-lg font-bold">
                      {doneValue.toFixed(0)} pts
                    </div>
                    <p className="text-xs text-muted-foreground">Acquis</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5" />
                  <div>
                    <div className="text-lg font-bold">
                      {potentialValue.toFixed(0)} pts
                    </div>
                    <p className="text-xs text-muted-foreground">Potentiel</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Volunteer Shifts Sections */}
            <div>
              <UpcomingVolunteerShifts shifts={upcomingShifts} />
            </div>
            <div>
              <AvailableVolunteerShifts
                shifts={volunteerShifts || []}
                registeredShiftIds={registeredShiftIds}
              />
            </div>
            <div>
              <PastVolunteerShifts shifts={pastShifts} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
