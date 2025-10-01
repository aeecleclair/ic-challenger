"use client";

import { Plus, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useVolunteerShifts } from "../../../hooks/useVolunteerShifts";
import { LoadingButton } from "../../../components/custom/LoadingButton";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  VolunteerShiftDetail,
  VolunteerShiftForm,
  VolunteerShiftCalendar,
} from "../../../components/admin/volunteer-shifts";
import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";

export default function VolunteerShiftsPage() {
  const { volunteerShifts, isLoading } = useVolunteerShifts();

  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<string | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<Date | null>(null);

  const handleCreateShift = (date?: Date) => {
    setEditingShift(null);
    setPrefilledDate(date || null);
    setIsFormOpen(true);
  };

  const handleEditShift = (shiftId: string) => {
    setEditingShift(shiftId);
    setPrefilledDate(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingShift(null);
    setPrefilledDate(null);
  };

  const handleEmptySlotClick = (date: Date, hour?: number) => {
    const shiftDate = new Date(date);
    if (hour !== undefined) {
      shiftDate.setHours(hour, 0, 0, 0);
    }
    handleCreateShift(shiftDate);
  };

  const handleCloseDetail = () => {
    setSelectedShift(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Créneaux Bénévoles
            </h1>
            <p className="text-muted-foreground">
              Gérez les créneaux de bénévolat pour l&apos;événement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Créneau
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-24 bg-muted/30 rounded-lg">
          <LoadingButton isLoading={true}>
            Chargement des créneaux...
          </LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Créneaux Bénévoles
          </h1>
          <p className="text-muted-foreground">
            Gérez les créneaux de bénévolat pour l&apos;événement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => handleCreateShift()}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Créneau
          </Button>
        </div>
      </div>

      {/* Content */}
      {!volunteerShifts || volunteerShifts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/30 rounded-lg border-2 border-dashed">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucun créneau de bénévolat
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Commencez par créer votre premier créneau de bénévolat pour
            commencer à organiser vos équipes.
          </p>
          <Button onClick={() => handleCreateShift()}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un créneau
          </Button>
        </div>
      ) : (
        <div>
          <VolunteerShiftCalendar
            key={`shifts-${volunteerShifts?.length || 0}-${volunteerShifts?.map((s) => s.id).join("-") || "empty"}`}
            shifts={volunteerShifts}
            onEventClick={(shift: VolunteerShiftComplete) =>
              setSelectedShift(shift.id)
            }
            onEmptySlotClick={handleEmptySlotClick}
          />
        </div>
      )}

      {/* Detail Modal */}
      {selectedShift && (
        <VolunteerShiftDetail
          shiftId={selectedShift}
          onClose={handleCloseDetail}
          onEdit={() => {
            handleEditShift(selectedShift);
            setSelectedShift(null);
          }}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <VolunteerShiftForm
          shiftId={editingShift}
          prefilledDate={prefilledDate}
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
}
