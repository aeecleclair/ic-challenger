import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Award,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AvailableVolunteerShiftCardProps {
  shift: VolunteerShiftComplete;
  onClick: () => void;
}

export const AvailableVolunteerShiftCard = ({
  shift,
  onClick,
}: AvailableVolunteerShiftCardProps) => {
  const startDate = new Date(shift.start_time);
  const endDate = new Date(shift.end_time);

  // Calculate duration in hours
  const durationHours =
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 10),
    ) / 10;

  // Calculate time until the shift
  const now = new Date();
  const timeDiff = startDate.getTime() - now.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const getTimeDescription = () => {
    if (daysDiff === 0) {
      if (hoursDiff <= 1) return "Dans moins d'une heure";
      return `Dans ${hoursDiff}h`;
    }
    if (daysDiff === 1) return "Demain";
    if (daysDiff <= 7) return `Dans ${daysDiff} jours`;
    return `Dans ${daysDiff} jours`;
  };

  const getUrgencyColor = () => {
    if (daysDiff === 0) return "destructive"; // Today
    if (daysDiff <= 1) return "default"; // Tomorrow
    return "secondary"; // Later
  };

  return (
    <div
      className="space-y-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{shift.name}</h3>
          </div>
          {shift.description && (
            <p className="text-sm text-muted-foreground">{shift.description}</p>
          )}
        </div>
        <Badge variant={getUrgencyColor()} className="ml-4">
          {getTimeDescription()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(startDate, "dd MMM yyyy", { locale: fr })}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
            <span className="text-muted-foreground ml-1">
              ({durationHours}h)
            </span>
          </span>
        </div>

        {shift.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{shift.location}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {shift.registrations?.length || 0}/{shift.max_volunteers} bénévoles
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-muted-foreground" />
          <span>{shift.value} points</span>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Voir détails
        </Button>
      </div>
    </div>
  );
};
