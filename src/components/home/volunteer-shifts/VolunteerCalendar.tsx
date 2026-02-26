"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarWeekView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarEvent,
} from "../../custom/FullScreenCalendar";
import { fr } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useVolunteerShifts } from "@/src/hooks/useVolunteerShifts";
import { useVolunteer } from "@/src/hooks/useVolunteer";
import { useAllMatches } from "@/src/hooks/useAllMatches";
import { useLocations } from "@/src/hooks/useLocations";
import {
  generateLocationColor,
  getLocationName,
} from "@/src/utils/locationColors";
import { VolunteerCalendarEventDetail } from "./VolunteerCalendarEventDetail";

const MATCH_COLOR = "#3b82f6";

export const VolunteerCalendar = () => {
  const { volunteerShifts } = useVolunteerShifts();
  const { volunteer } = useVolunteer();
  const { allMatches } = useAllMatches();
  const { locations } = useLocations();

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const registeredShiftIds = useMemo(
    () => new Set(volunteer?.map((r) => r.shift_id) ?? []),
    [volunteer],
  );

  const shiftEvents: CalendarEvent[] = useMemo(() => {
    if (!volunteerShifts) return [];
    return volunteerShifts.map((shift) => {
      const isRegistered = registeredShiftIds.has(shift.id);
      return {
        id: `shift-${shift.id}`,
        title: isRegistered ? `✓ ${shift.name}` : shift.name,
        subtitle: `Max ${shift.max_volunteers} bénévole${shift.max_volunteers !== 1 ? "s" : ""}`,
        start: new Date(shift.start_time),
        end: new Date(shift.end_time),
        color: generateLocationColor(shift.location),
        metadata: {
          type: "shift",
          shiftId: shift.id,
          isRegistered,
          location: shift.location,
        },
      };
    });
  }, [volunteerShifts, registeredShiftIds]);

  const matchEvents: CalendarEvent[] = useMemo(() => {
    if (!allMatches) return [];
    return allMatches
      .filter((m) => !!m.date)
      .map((match) => {
        const start = new Date(match.date!);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h default
        const locationName = getLocationName(match.location_id, locations);
        return {
          id: `match-${match.id}`,
          title: match.name,
          subtitle: `${match.team1.name} vs ${match.team2.name}`,
          start,
          end,
          color: MATCH_COLOR,
          metadata: {
            type: "match",
            matchId: match.id,
            team1: match.team1.name,
            team2: match.team2.name,
            location: locationName,
          },
        };
      });
  }, [allMatches, locations]);

  const events = useMemo(
    () => [...shiftEvents, ...matchEvents],
    [shiftEvents, matchEvents],
  );

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <Calendar
        events={events}
        onEventClick={handleEventClick}
        locale={fr}
        view="week"
      >
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <CalendarPrevTrigger className="p-2 hover:bg-muted rounded">
                <ChevronLeft className="h-4 w-4" />
              </CalendarPrevTrigger>
              <CalendarTodayTrigger className="px-3 py-1 text-sm border rounded hover:bg-muted">
                Aujourd&apos;hui
              </CalendarTodayTrigger>
              <CalendarNextTrigger className="p-2 hover:bg-muted rounded">
                <ChevronRight className="h-4 w-4" />
              </CalendarNextTrigger>
            </div>

            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <CalendarCurrentDate locale={fr} />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ backgroundColor: "#6b7280" }}
                />
                Créneaux
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ backgroundColor: MATCH_COLOR }}
                />
                Matchs
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">✓</span>
                Inscrit
              </div>
            </div>
          </div>

          {/* Calendar */}
          <CalendarWeekView />
        </div>
      </Calendar>

      <VolunteerCalendarEventDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
};
