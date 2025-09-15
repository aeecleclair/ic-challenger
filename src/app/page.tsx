"use client";

import { useAuth } from "../hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../hooks/useUser";
import { AppSidebar } from "../components/home/appSideBar/AppSidebar";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Button } from "../components/ui/button";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from "../components/custom/FullScreenCalendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fr } from "date-fns/locale";
import { useEdition } from "../hooks/useEdition";
import { useCompetitionUser } from "../hooks/useCompetitionUser";
import { useSportMatches } from "../hooks/useMatches";
import { useUserPayments } from "../hooks/useUserPayments";
import { EditionWaitingCard } from "../components/home/EditionWaitingCard";
import { IncompleteRegistrationCard } from "../components/home/IncompleteRegistrationCard";
import { FullyRegisteredDashboard } from "../components/home/FullyRegisteredDashboard";
import { useEffect } from "react";

const Home = () => {
  const { isTokenQueried, token } = useAuth();
  const { me: user, isAdmin } = useUser();
  const { meCompetition, isLoading } = useCompetitionUser();
  const { hasPaid } = useUserPayments();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { edition } = useEdition();

  const isEditionStarted = edition?.start_date
    ? new Date() >= new Date(edition.start_date)
    : false;

  const isEditionEnded = edition?.end_date
    ? new Date() >= new Date(edition.end_date)
    : false;

  const isFullyRegistered = meCompetition?.validated && hasPaid;

  useEffect(() => {
    if (
      !isLoading &&
      (meCompetition === undefined || !meCompetition?.validated) &&
      user !== undefined &&
      edition !== undefined &&
      token !== null &&
      !isEditionStarted &&
      !isEditionEnded
    ) {
      router.replace("/register");
    }
  }, [
    isLoading,
    router,
    meCompetition,
    user,
    edition,
    token,
    isEditionStarted,
    isEditionEnded,
  ]);

  if (isTokenQueried && token === null) {
    router.replace("/login");
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
          {!edition && (
            <span className="text-sm text-muted-foreground px-4 justify-center items-center flex h-full">
              Veuillez patienter, l&apos;édition n&apos;est pas encore prête.
            </span>
          )}
          {edition && !isEditionStarted && (
            <EditionWaitingCard edition={edition} />
          )}
          {edition &&
            isEditionStarted &&
            !isFullyRegistered &&
            meCompetition && (
              <FullyRegisteredDashboard
                edition={edition}
                meCompetition={meCompetition}
              />
            )}
          {edition && isEditionStarted && isFullyRegistered && (
            <IncompleteRegistrationCard
              edition={edition}
              meCompetition={meCompetition}
              hasPaid={hasPaid}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
