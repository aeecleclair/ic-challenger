"use client";

import { X, Edit, Calendar, Clock, MapPin, Users, Award } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useVolunteerShifts } from "../../../hooks/useVolunteerShifts";
import { LoadingButton } from "../../custom/LoadingButton";
import { VolunteerShift } from "../../../api/hyperionSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

interface VolunteerShiftDetailProps {
  shiftId: string;
  onClose: () => void;
  onEdit: () => void;
}

export default function VolunteerShiftDetail({
  shiftId,
  onClose,
  onEdit,
}: VolunteerShiftDetailProps) {
  const { volunteerShifts, deleteVolunteerShift, isDeleteLoading } = useVolunteerShifts();
  
  const shift = volunteerShifts?.find((s: VolunteerShift) => s.id === shiftId);

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
  const durationHours = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 10)) / 10;

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

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
      deleteVolunteerShift(shift.id, onClose);
    }
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
                      <p className="text-sm text-muted-foreground">{shift.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Capacité</p>
                    <p className="text-sm text-muted-foreground">
                      {shift.max_volunteers} bénévoles max
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

          {/* Registered Volunteers Section (placeholder for future implementation) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bénévoles inscrits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fonctionnalité en cours de développement</p>
                <p className="text-sm">
                  Les informations sur les bénévoles inscrits seront bientôt disponibles
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </div>
            <LoadingButton
              variant="destructive"
              onClick={handleDelete}
              isLoading={isDeleteLoading}
            >
              Supprimer
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}