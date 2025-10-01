import { VolunteerShiftComplete } from "../../../api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Calendar, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AvailableVolunteerShiftCard } from "./AvailableVolunteerShiftCard";

interface AvailableVolunteerShiftsProps {
  shifts: VolunteerShiftComplete[];
  registeredShiftIds: string[];
  onShiftClick: (shiftId: string) => void;
}

export const AvailableVolunteerShifts = ({
  shifts,
  registeredShiftIds,
  onShiftClick,
}: AvailableVolunteerShiftsProps) => {
  const [showAllShifts, setShowAllShifts] = useState(false);

  // Filter out past shifts and already registered shifts
  const now = new Date();
  const availableShifts = shifts.filter((shift) => {
    const shiftStart = new Date(shift.start_time);
    return shiftStart > now && !registeredShiftIds.includes(shift.id);
  });

  if (availableShifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Créneaux Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun créneau de bénévolat disponible pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedShifts = showAllShifts
    ? availableShifts
    : availableShifts.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Créneaux Disponibles ({availableShifts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedShifts.map((shift, index) => (
          <div key={shift.id}>
            <AvailableVolunteerShiftCard
              shift={shift}
              onClick={() => onShiftClick(shift.id)}
            />
            {index < displayedShifts.length - 1 && (
              <div className="my-4">
                <hr className="border-muted" />
              </div>
            )}
          </div>
        ))}

        {availableShifts.length > 5 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowAllShifts(!showAllShifts)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAllShifts ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Voir tous les créneaux ({availableShifts.length - 5} de plus)
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
