import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useVolunteer } from "../../../hooks/useVolunteer";
import { useVolunteerShifts } from "../../../hooks/useVolunteerShifts";
import { useLocations } from "../../../hooks/useLocations";
import { LoadingButton } from "../../custom/LoadingButton";
import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  generateLocationColor,
  getLocationDetails,
  openLocationMap,
} from "../../../utils/locationColors";

interface UserVolunteerShiftDetailProps {
  shiftId: string;
  onClose: () => void;
}

export default function UserVolunteerShiftDetail({
  shiftId,
  onClose,
}: UserVolunteerShiftDetailProps) {
  const {
    volunteer,
    registerVolunteerShift,
    isRegisterLoading,
    refetchVolunteer,
  } = useVolunteer();
  const { volunteerShifts } = useVolunteerShifts();
  const { locations } = useLocations();

  const shift = volunteerShifts?.find(
    (s: VolunteerShiftComplete) => s.id === shiftId,
  );
  const isRegistered = volunteer?.some((reg) => reg.shift_id === shiftId);

  if (!shift) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <p>Créneau non trouvé</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const startDate = new Date(shift.start_time);
  const endDate = new Date(shift.end_time);
  const isUpcoming = startDate > new Date();
  const isPast = endDate < new Date();
  const durationHours =
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 10),
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

  const handleRegister = () => {
    registerVolunteerShift(shift.id, () => {
      refetchVolunteer();
      onClose();
    });
  };

  const locationDetails = getLocationDetails(shift.location, locations);
  const locationColor = generateLocationColor(locationDetails.id);

  const openMap = () => {
    openLocationMap(shift.location, locations);
  };

  const getVolunteerTooltip = () => {
    const registeredCount = shift.registrations?.length || 0;
    if (registeredCount === 0) {
      return "Aucun bénévole inscrit";
    }
    const volunteerNames =
      shift.registrations
        ?.slice(0, 5)
        .map(
          (reg) =>
            `${reg.user.user.firstname} ${reg.user.user.name.charAt(0)}.`,
        )
        .join(", ") || "";
    const remaining = registeredCount - 5;
    return remaining > 0
      ? `${volunteerNames} et ${remaining} autre${remaining > 1 ? "s" : ""}`
      : volunteerNames;
  };

  return (
    <TooltipProvider>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: locationColor }}
                />
                <span>{shift.name}</span>
              </div>
              <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Description */}
            {shift.description && (
              <p className="text-sm text-muted-foreground">
                {shift.description}
              </p>
            )}

            {/* Compact Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground">
                    Date
                  </p>
                  <p className="truncate">
                    {format(startDate, "dd MMM", { locale: fr })}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground">
                    Horaires
                  </p>
                  <p className="truncate">
                    {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({durationHours}h)
                  </p>
                </div>
              </div>

              {/* Location */}
              {shift.location && (
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: locationColor }}
                    />
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs text-muted-foreground">
                      Lieu
                    </p>
                    <div className="flex items-center gap-1">
                      <p
                        className="truncate text-sm"
                        title={locationDetails.name}
                      >
                        {locationDetails.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 flex-shrink-0 opacity-60 hover:opacity-100"
                        onClick={openMap}
                        title={`Ouvrir ${locationDetails.latitude && locationDetails.longitude ? "coordonnées précises" : "adresse"} dans Google Maps`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Volunteers */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium text-xs text-muted-foreground">
                        Bénévoles
                      </p>
                      <p className="truncate">
                        {shift.registrations?.length || 0}/
                        {shift.max_volunteers}
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getVolunteerTooltip()}</p>
                </TooltipContent>
              </Tooltip>

              {/* Points */}
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-muted-foreground">
                    Points
                  </p>
                  <p className="truncate">{shift.value} pts</p>
                </div>
              </div>
            </div>

            {/* Registration Action */}
            <div className="flex justify-end pt-4 border-t">
              {isRegistered ? (
                <Badge variant="default" className="px-4 py-2">
                  ✅ Inscrit
                </Badge>
              ) : (
                <>
                  {isPast ? (
                    <Badge variant="secondary" className="px-4 py-2">
                      Terminé
                    </Badge>
                  ) : (
                    <LoadingButton
                      onClick={handleRegister}
                      isLoading={isRegisterLoading}
                      size="sm"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      S&apos;inscrire
                    </LoadingButton>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
