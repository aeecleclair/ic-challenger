"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Badge } from "../../ui/badge";
import { CalendarEvent } from "../../custom/FullScreenCalendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import UserVolunteerShiftDetail from "./UserVolunteerShiftDetail";

interface VolunteerCalendarEventDetailProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export const VolunteerCalendarEventDetail = ({
  event,
  onClose,
}: VolunteerCalendarEventDetailProps) => {
  if (!event) return null;

  const eventType = event.metadata?.type as "shift" | "match" | undefined;

  // Shift events: delegate to UserVolunteerShiftDetail (it opens its own dialog)
  if (eventType === "shift") {
    return (
      <UserVolunteerShiftDetail
        shiftId={event.metadata!.shiftId as string}
        onClose={onClose}
      />
    );
  }

  // Match events
  if (eventType === "match") {
    const team1 = event.metadata?.team1 as string;
    const team2 = event.metadata?.team2 as string;
    const location = event.metadata?.location as string | undefined;
    const sportName = event.metadata?.sportName as string | undefined;

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: event.color ?? "#3b82f6" }}
              />
              {event.title}
              {sportName && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {sportName}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p>{format(event.start, "dd MMMM yyyy", { locale: fr })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Horaire</p>
                  <p>
                    {format(event.start, "HH:mm", { locale: fr })} –{" "}
                    {format(event.end, "HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Lieu</p>
                  <p>{location}</p>
                </div>
              </div>
            )}
            {team1 && team2 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Équipes</p>
                  <p className="font-medium">
                    {team1}{" "}
                    <span className="text-muted-foreground font-normal">
                      vs
                    </span>{" "}
                    {team2}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Fallback: generic event detail
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{event.subtitle}</p>
      </DialogContent>
    </Dialog>
  );
};
