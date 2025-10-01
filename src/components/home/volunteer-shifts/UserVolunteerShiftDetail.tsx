"use client";

import { Calendar, Clock, MapPin, Users, Award, UserPlus } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useVolunteer } from "../../../hooks/useVolunteer";
import { useVolunteerShifts } from "../../../hooks/useVolunteerShifts";
import { LoadingButton } from "../../custom/LoadingButton";
import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{shift.name}</span>
            <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shift.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{shift.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(startDate, "dd MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm text-muted-foreground">
                      {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({durationHours}h)
                    </p>
                  </div>
                </div>

                {shift.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Lieu</p>
                      <p className="text-sm text-muted-foreground">
                        {shift.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Capacité</p>
                    <p className="text-sm text-muted-foreground">
                      {shift.registrations?.length || 0}/{shift.max_volunteers}{" "}
                      bénévoles
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Valeur</p>
                    <p className="text-sm text-muted-foreground">
                      {shift.value} points
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inscription</CardTitle>
            </CardHeader>
            <CardContent>
              {isRegistered ? (
                <div className="text-center py-4">
                  <Badge variant="default" className="mb-2">
                    ✅ Vous êtes inscrit à ce créneau
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez des notifications concernant ce créneau
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  {isPast ? (
                    <p className="text-muted-foreground">
                      Ce créneau est terminé, inscription impossible
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Vous pouvez vous inscrire à ce créneau de bénévolat
                      </p>
                      <LoadingButton
                        onClick={handleRegister}
                        isLoading={isRegisterLoading}
                        className="w-full"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        S&apos;inscrire au créneau
                      </LoadingButton>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
