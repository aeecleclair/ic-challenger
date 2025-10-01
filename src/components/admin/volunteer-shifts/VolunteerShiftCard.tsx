"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import { useLocations } from "../../../hooks/useLocations";
import {
  generateLocationColor,
  getLocationDetails,
  openLocationMap,
} from "../../../utils/locationColors";

interface VolunteerShiftCardProps {
  shift: VolunteerShiftComplete;
  onEdit: () => void;
  onView: () => void;
  onDelete?: () => void;
}

export default function VolunteerShiftCard({
  shift,
  onEdit,
  onView,
  onDelete,
}: VolunteerShiftCardProps) {
  const { locations } = useLocations();
  const startDate = new Date(shift.start_time);
  const endDate = new Date(shift.end_time);
  const isUpcoming = startDate > new Date();
  const isPast = endDate < new Date();
  const duration =
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 100),
    ) / 10;

  const getStatusColor = () => {
    if (isPast) return "secondary";
    if (isUpcoming) return "default";
    return "destructive"; // Currently active
  };

  const getStatusText = () => {
    if (isPast) return "Terminé";
    if (isUpcoming) return "À venir";
    return "En cours";
  };

  const locationDetails = getLocationDetails(shift.location, locations);
  const locationColor = generateLocationColor(locationDetails.id);

  const openMap = () => {
    openLocationMap(shift.location, locations);
  };

  return (
    <Card
      className="group hover:shadow-md transition-shadow border-l-4"
      style={{ borderLeftColor: locationColor }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: locationColor }}
              />
              <CardTitle className="text-lg">{shift.name}</CardTitle>
            </div>
            <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={onView}>
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {shift.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {shift.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(startDate, "dd MMM yyyy", { locale: fr })}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
            </span>
          </div>

          {shift.location && (
            <div className="flex items-start gap-2 text-sm">
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: locationColor }}
                />
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-medium truncate"
                    title={locationDetails.name}
                  >
                    {locationDetails.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={openMap}
                    title={`Ouvrir ${locationDetails.latitude && locationDetails.longitude ? "coordonnées précises" : "adresse"} dans Google Maps`}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                {locationDetails.address && (
                  <p
                    className="text-xs text-muted-foreground truncate"
                    title={locationDetails.address}
                  >
                    {locationDetails.address}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {shift.registrations?.length || 0}/{shift.max_volunteers}{" "}
              bénévoles
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm font-medium">
            Valeur: {shift.value} points
          </div>
          <Button variant="outline" size="sm" onClick={onView}>
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
