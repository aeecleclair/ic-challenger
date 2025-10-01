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
} from "../../components/home/volunteer-shifts";
import { useVolunteer } from "../../hooks/useVolunteer";
import { Calendar, Users, Clock, Award } from "lucide-react";
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

  const volunteerStats = useMemo(() => {
    if (!volunteer || volunteer.length === 0) {
      return {
        upcomingShifts: [],
        pastShifts: [],
        totalShifts: 0,
        totalPoints: 0,
        totalHours: 0,
      };
    }

    const now = new Date();
    const nowTime = now.getTime();

    return volunteer.reduce(
      (acc, registration: VolunteerRegistrationComplete) => {
        const shift = registration.shift;
        const shiftStartTime = new Date(shift.start_time).getTime();
        const shiftEndTime = new Date(shift.end_time).getTime();

        // Calculate hours for this shift
        const hours = (shiftEndTime - shiftStartTime) / (1000 * 60 * 60);

        acc.totalShifts++;
        acc.totalPoints += shift.value;
        acc.totalHours += hours;

        if (shiftStartTime > nowTime) {
          acc.upcomingShifts.push({
            ...registration,
            _shiftStartTime: shiftStartTime,
          });
        } else {
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
        totalShifts: 0,
        totalPoints: 0,
        totalHours: 0,
      },
    );
  }, [volunteer]);

  const { upcomingShifts, pastShifts, totalShifts, totalPoints, totalHours } =
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

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Créneaux
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalShifts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">À Venir</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {upcomingShifts.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Points
                  </CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalPoints.toFixed(1)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Heures
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalHours.toFixed(1)}h
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Volunteer Shifts Sections */}
            <div>
              <UpcomingVolunteerShifts shifts={upcomingShifts} />
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
