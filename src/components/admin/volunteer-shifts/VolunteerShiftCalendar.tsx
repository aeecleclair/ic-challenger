"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { VolunteerShift } from "../../../api/hyperionSchemas";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarEvent,
} from "../../custom/FullScreenCalendar";
import { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VolunteerShiftCalendarProps {
  shifts: VolunteerShift[];
  onShiftClick: (shift: VolunteerShift) => void;
  onCreateShift: () => void;
}

export default function VolunteerShiftCalendar({
  shifts,
  onShiftClick,
  onCreateShift,
}: VolunteerShiftCalendarProps) {
  // Convert volunteer shifts to calendar events
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return shifts.map((shift) => {
      const startDate = new Date(shift.start_time);
      const endDate = new Date(shift.end_time);
      const isUpcoming = startDate > new Date();
      const isPast = endDate < new Date();
      
      // Determine color based on status
      let color: CalendarEvent["color"] = "default";
      if (isPast) {
        color = "blue"; // Past events
      } else if (isUpcoming) {
        color = "green"; // Upcoming events
      } else {
        color = "purple"; // Current/active events
      }

      return {
        id: shift.id,
        start: startDate,
        end: endDate,
        title: shift.name,
        color,
      };
    });
  }, [shifts]);

  const handleEventClick = (event: CalendarEvent) => {
    const shift = shifts.find(s => s.id === event.id);
    if (shift) {
      onShiftClick(shift);
    }
  };

  return (
    <Card className="h-[800px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendrier des Créneaux Bénévoles</CardTitle>
          <Button onClick={onCreateShift} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Créneau
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-100px)]">
        <Calendar 
          events={calendarEvents}
          onEventClick={handleEventClick}
          defaultDate={new Date()}
          view="month"
          locale={fr}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarPrevTrigger />
              <CalendarTodayTrigger />
              <CalendarNextTrigger />
            </div>
            <CalendarCurrentDate />
            <CalendarViewTrigger view="month">Mois</CalendarViewTrigger>
          </div>
          <CalendarMonthView />
        </Calendar>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Terminé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">À venir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm">En cours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}