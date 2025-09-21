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
import { EditionWaitingCard } from "../components/home/EditionWaitingCard";
import { IncompleteRegistrationCard } from "../components/home/IncompleteRegistrationCard";
import { FullyRegisteredDashboard } from "../components/home/FullyRegisteredDashboard";
import { useSportSchools } from "../hooks/useSportSchools";
import { UnregisteredCard } from "../components/home/UnregisteredCard";
import { useUserPurchases } from "../hooks/useUserPurchases";

const Home = () => {
  const { isTokenQueried, token } = useAuth();
  const { me: user, isAdmin } = useUser();
  const { meCompetition, isLoading } = useCompetitionUser();
  const { hasPaid } = useUserPurchases({ userId: user?.id });
  const searchParams = useSearchParams();
  const router = useRouter();
  const { edition } = useEdition();
  const { sportSchools } = useSportSchools();

  const isEditionStarted = edition?.start_date
    ? new Date() >= new Date(edition.start_date)
    : false;

  const isEditionEnded = edition?.end_date
    ? new Date() >= new Date(edition.end_date)
    : false;

  const isFullyRegistered = meCompetition?.validated && hasPaid;

  const userSportSchool = sportSchools?.find(
    (school) => school.school_id === user?.school_id,
  );
  const isSchoolInscriptionEnabled = userSportSchool?.inscription_enabled;

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
          {edition &&
            (!edition.inscription_enabled || !isSchoolInscriptionEnabled) &&
            !(isEditionStarted || isEditionEnded) && (
              <EditionWaitingCard
                edition={{
                  year: edition.year,
                  name: edition.name,
                  start_date: edition.start_date,
                  inscription_enabled: edition.inscription_enabled || false,
                }}
                isSchoolInscriptionEnabled={!!isSchoolInscriptionEnabled}
              />
            )}
          {edition &&
            edition.inscription_enabled &&
            isSchoolInscriptionEnabled &&
            isFullyRegistered &&
            meCompetition && (
              <FullyRegisteredDashboard
                edition={edition}
                meCompetition={meCompetition}
              />
            )}
          {edition &&
            edition.inscription_enabled &&
            isSchoolInscriptionEnabled &&
            meCompetition &&
            !isFullyRegistered && (
              <IncompleteRegistrationCard
                edition={edition}
                meCompetition={meCompetition}
                hasPaid={hasPaid}
              />
            )}
          {edition &&
            edition.inscription_enabled &&
            isSchoolInscriptionEnabled &&
            !meCompetition &&
            !isLoading &&
            user &&
            !(isEditionStarted || isEditionEnded) &&
            isSchoolInscriptionEnabled && (
              <UnregisteredCard edition={edition} />
            )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
