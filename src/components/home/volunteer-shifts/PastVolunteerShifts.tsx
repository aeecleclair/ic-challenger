import { VolunteerRegistrationComplete } from "../../../api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { History, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { VolunteerShiftCard } from ".";

interface PastVolunteerShiftsProps {
  shifts: (VolunteerRegistrationComplete & { _shiftStartTime: number })[];
}

export const PastVolunteerShifts = ({ shifts }: PastVolunteerShiftsProps) => {
  const [showAllShifts, setShowAllShifts] = useState(false);

  if (shifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Créneaux Terminés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun créneau de bénévolat terminé pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedShifts = showAllShifts ? shifts : shifts.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          Créneaux Terminés ({shifts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedShifts.map((registration, index) => (
          <div key={registration.shift_id}>
            <VolunteerShiftCard
              registration={registration}
              isUpcoming={false}
            />
            {index < displayedShifts.length - 1 && (
              <div className="my-4">
                <hr className="border-muted" />
              </div>
            )}
          </div>
        ))}

        {shifts.length > 5 && (
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
                  Voir tous les créneaux ({shifts.length - 5} de plus)
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
