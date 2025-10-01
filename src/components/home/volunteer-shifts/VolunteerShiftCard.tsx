import { VolunteerRegistrationComplete } from "../../../api/hyperionSchemas";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Award,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VolunteerShiftCardProps {
  registration: VolunteerRegistrationComplete;
  isUpcoming: boolean;
}

export const VolunteerShiftCard = ({
  registration,
  isUpcoming,
}: VolunteerShiftCardProps) => {
  const { shift, validated } = registration;
  const startDate = new Date(shift.start_time);
  const endDate = new Date(shift.end_time);

  // Calculate duration in hours
  const durationHours =
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 10),
    ) / 10;

  // Calculate time until/since the shift
  const now = new Date();
  const timeDiff = Math.abs(startDate.getTime() - now.getTime());
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const getTimeDescription = () => {
    if (isUpcoming) {
      if (daysDiff === 0) {
        if (hoursDiff <= 1) return "Dans moins d'une heure";
        return `Dans ${hoursDiff}h`;
      }
      if (daysDiff === 1) return "Demain";
      if (daysDiff <= 7) return `Dans ${daysDiff} jours`;
      return `Dans ${daysDiff} jours`;
    } else {
      if (daysDiff === 0) return "Aujourd'hui";
      if (daysDiff === 1) return "Hier";
      return `Il y a ${daysDiff} jours`;
    }
  };

  const getUrgencyColor = () => {
    if (!isUpcoming) return "default";
    if (daysDiff === 0) return "destructive"; // Today
    if (daysDiff <= 1) return "default"; // Tomorrow
    return "secondary"; // Later
  };

  // Helper function to open map if location has an address
  const openMap = (location: string) => {
    const query = encodeURIComponent(location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{shift.name}</h3>
            {validated && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Validé
              </Badge>
            )}
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
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 ml-1"
              onClick={() => openMap(shift.location!)}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Max {shift.max_volunteers} bénévoles</span>
        </div>

        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-muted-foreground" />
          <span>{shift.value} points</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            Inscrit le{" "}
            {format(new Date(registration.registered_at), "dd/MM/yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
};
