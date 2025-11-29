"use client";

import {
  X,
  Edit,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Award,
  Info,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Progress } from "../../ui/progress";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
  getLocationName,
  getLocationDetails,
  openLocationMap,
} from "../../../utils/locationColors";

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
  const { volunteerShifts, deleteVolunteerShift, isDeleteLoading } =
    useVolunteerShifts();

  const shift = volunteerShifts?.find(
    (s: VolunteerShiftComplete) => s.id === shiftId,
  );

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
  const now = new Date();
  const isUpcoming = startDate > now;
  const isPast = endDate < now;
  const isActive = !isUpcoming && !isPast;

  const durationHours = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
  );

  // Calculate registration statistics
  // Note: Registration data not available in current schema
  const registeredCount = 0; // Placeholder - registration functionality disabled
  const validatedCount = 0; // Placeholder - validation functionality disabled
  const fillPercentage = 0; // (registeredCount / shift.max_volunteers) * 100;

  // Calculate time until/since shift
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
      return `Dans ${daysDiff} jours`;
    } else if (isPast) {
      if (daysDiff === 0) return "Aujourd'hui";
      if (daysDiff === 1) return "Hier";
      return `Il y a ${daysDiff} jours`;
    } else {
      return "En cours maintenant";
    }
  };

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

  const getFillStatus = () => {
    // Registration functionality currently disabled
    return {
      color: "secondary",
      text: "Inscriptions non disponibles",
    } as const;
    // Original logic (disabled):
    // if (registeredCount === 0)
    //   return { color: "destructive", text: "Aucune inscription" } as const;
    // if (registeredCount < shift.max_volunteers * 0.5)
    //   return { color: "destructive", text: "Peu d'inscrits" } as const;
    // if (registeredCount < shift.max_volunteers)
    //   return { color: "default", text: "Partiellement rempli" } as const;
    // return { color: "default", text: "Complet" } as const;
  };

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
      deleteVolunteerShift(shift.id, onClose);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{shift.name}</span>
              <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
              <Badge variant="outline" className="text-sm">
                {getTimeDescription()}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* Registration Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Inscriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{registeredCount}</span>
                  <span className="text-sm text-muted-foreground">
                    / {shift.max_volunteers}
                  </span>
                </div>
                <Progress value={fillPercentage} className="h-2" />
                <div className="flex items-center gap-2">
                  <Badge variant={getFillStatus().color} className="text-xs">
                    {getFillStatus().text}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(fillPercentage)}% rempli
                  </span>
                </div>
                {validatedCount < registeredCount && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span>
                      {registeredCount - validatedCount} en attente de
                      validation
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Détails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Responsable
                    </span>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium text-sm">
                        {shift.manager.firstname} {shift.manager.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Points
                    </span>
                    <span className="font-medium">{shift.value} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Durée</span>
                    <span className="font-medium">{durationHours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Début</span>
                    <span className="font-medium">
                      {format(startDate, "HH:mm", { locale: fr })}
                    </span>
                  </div>
                  {shift.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lieu
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="font-medium text-sm truncate max-w-[120px]"
                          title={shift.location}
                        >
                          {shift.location}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-4">
            {/* Manager Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Responsable du créneau
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">
                      {shift.manager.firstname.charAt(0)}
                      {shift.manager.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {shift.manager.firstname} {shift.manager.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {shift.manager.nickname && (
                        <>
                          <span>•</span>
                          <span>&quot;{shift.manager.nickname}&quot;</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registered Volunteers Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Bénévoles inscrits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">
                    Fonctionnalité non disponible
                  </p>
                  <p>
                    Les inscriptions aux créneaux ne sont pas encore disponibles
                    dans cette interface d&apos;administration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <div className="space-x-2">
            <Button onClick={onEdit} size="lg">
              <Edit className="mr-2 h-4 w-4" />
              Modifier le créneau
            </Button>
          </div>
          <LoadingButton
            variant="destructive"
            size="lg"
            onClick={handleDelete}
            isLoading={isDeleteLoading}
          >
            Supprimer le créneau
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
