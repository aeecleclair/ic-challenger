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

const Home = () => {
  const { isTokenQueried, token } = useAuth();
  const { me: user, isAdmin } = useUser();
  const { meCompetition, isLoading } = useCompetitionUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { edition } = useEdition();

  if (isTokenQueried && token === null) {
    router.replace("/login");
  }

  if (!isLoading && !meCompetition?.validated && user !== null) {
    router.replace("/register");
  }

  // if (isAdmin() && typeof window !== "undefined") {
  //   const redirection = searchParams.get("redirect");
  //   if (redirection !== null) {
  //     router.replace(redirection);
  //   } else {
  //     router.replace("/admin");
  //   }
  // }

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
          {meCompetition && (
            <>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Inscrit en tant que</h2>
              {meCompetition.is_athlete ? (
                <span className="text-sm text-muted-foreground">Athlète</span>
              ) : (
                <span className="text-sm text-muted-foreground">Supporter</span>
              )}
            </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;

// <Calendar
//   locale={fr}
//   events={[
//     {
//       id: "1",
//       start: new Date("2024-08-26T09:30:00Z"),
//       end: new Date("2024-08-26T14:30:00Z"),
//       title: "event A",
//       color: "pink",
//     },
//     {
//       id: "2",
//       start: new Date("2024-08-26T10:00:00Z"),
//       end: new Date("2024-08-26T10:30:00Z"),
//       title: "event B",
//       color: "blue",
//     },
//   ]}
// >
//   <div className="h-dvh py-6 flex flex-col">
//     <div className="flex px-6 items-center gap-2 mb-6">
//       <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
//         Day
//       </CalendarViewTrigger>
//       <CalendarViewTrigger
//         view="week"
//         className="aria-[current=true]:bg-accent"
//       >
//         Week
//       </CalendarViewTrigger>
//       <CalendarViewTrigger
//         view="month"
//         className="aria-[current=true]:bg-accent"
//       >
//         Month
//       </CalendarViewTrigger>
//       <CalendarViewTrigger
//         view="year"
//         className="aria-[current=true]:bg-accent"
//       >
//         Year
//       </CalendarViewTrigger>

//       <span className="flex-1" />

//       <CalendarCurrentDate locale={fr} />

//       <CalendarPrevTrigger>
//         <ChevronLeft size={20} />
//         <span className="sr-only">Previous</span>
//       </CalendarPrevTrigger>

//       <CalendarTodayTrigger>Today</CalendarTodayTrigger>

//       <CalendarNextTrigger>
//         <ChevronRight size={20} />
//         <span className="sr-only">Next</span>
//       </CalendarNextTrigger>

//       {/* <ModeToggle /> */}
//     </div>

//     <div className="flex-1 overflow-auto px-6 relative">
//       <CalendarDayView />
//       <CalendarWeekView />
//       <CalendarMonthView />
//       <CalendarYearView />
//     </div>
//   </div>
// </Calendar>;
