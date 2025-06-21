"use client";

import { useAuth } from "../hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../hooks/useUser";
import { AppSidebar } from "../components/admin/appSideBar/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
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

const Home = () => {
  const { isTokenQueried, token } = useAuth();
  const { me: user, isAdmin } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (isTokenQueried && token === null) {
    router.replace("/login");
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
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Calendar
          locale={fr}
          events={[
            {
              id: "1",
              start: new Date("2024-08-26T09:30:00Z"),
              end: new Date("2024-08-26T14:30:00Z"),
              title: "event A",
              color: "pink",
            },
            {
              id: "2",
              start: new Date("2024-08-26T10:00:00Z"),
              end: new Date("2024-08-26T10:30:00Z"),
              title: "event B",
              color: "blue",
            },
          ]}
        >
          <div className="h-dvh py-6 flex flex-col">
            <div className="flex px-6 items-center gap-2 mb-6">
              <CalendarViewTrigger
                className="aria-[current=true]:bg-accent"
                view="day"
              >
                Day
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="week"
                className="aria-[current=true]:bg-accent"
              >
                Week
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="month"
                className="aria-[current=true]:bg-accent"
              >
                Month
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="year"
                className="aria-[current=true]:bg-accent"
              >
                Year
              </CalendarViewTrigger>

              <span className="flex-1" />

              <CalendarCurrentDate locale={fr} />

              <CalendarPrevTrigger>
                <ChevronLeft size={20} />
                <span className="sr-only">Previous</span>
              </CalendarPrevTrigger>

              <CalendarTodayTrigger>Today</CalendarTodayTrigger>

              <CalendarNextTrigger>
                <ChevronRight size={20} />
                <span className="sr-only">Next</span>
              </CalendarNextTrigger>

              {/* <ModeToggle /> */}
            </div>

            <div className="flex-1 overflow-auto px-6 relative">
              <CalendarDayView />
              <CalendarWeekView />
              <CalendarMonthView />
              <CalendarYearView />
            </div>
          </div>
        </Calendar>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
