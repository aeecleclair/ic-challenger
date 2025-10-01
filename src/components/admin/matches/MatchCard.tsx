"use client";

import { Match, MatchComplete } from "@/src/api/hyperionSchemas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  Trophy,
  Flag,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocations } from "@/src/hooks/useLocations";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface MatchCardProps {
  match: MatchComplete;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MatchCard = ({ match, onEdit, onDelete }: MatchCardProps) => {
  const { locations } = useLocations();
  const { sports } = useSports();
  const { schools } = useSchools();

  const locationName =
    locations?.find((loc) => loc.id === match.location_id)?.name ||
    match.location_id;
  const sportName =
    sports?.find((sport) => sport.id === match.sport_id)?.name ||
    match.sport_id;

  const team1School =
    schools?.find((school) => school.id === match.team1?.school_id)?.name || "";
  const team2School =
    schools?.find((school) => school.id === match.team2?.school_id)?.name || "";
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {match.name}
          </CardTitle>
          <div className="flex gap-1">
            {match.winner_id && (
              <Badge
                variant="outline"
                className="bg-emerald-100 text-emerald-800 border-emerald-200"
              >
                <Trophy className="h-3 w-3 mr-1" />
                Terminé
              </Badge>
            )}
            {!match.score_team1 && !match.score_team2 && (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200"
              >
                <Clock className="h-3 w-3 mr-1" />
                Programmé
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 flex-grow">
        {/* Score Display */}
        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="text-sm font-medium text-center mb-0.5">
              {match.team1?.name || "Équipe 1"}
            </div>
            {team1School && (
              <div className="text-xs text-muted-foreground text-center mb-0.5">
                {formatSchoolName(team1School)}
              </div>
            )}
            {match.score_team1 !== null ? (
              <div className="text-2xl font-bold text-primary">
                {match.score_team1}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">-</div>
            )}
          </div>

          <div className="col-span-1 flex items-center justify-center">
            <Badge variant="outline" className="bg-white font-semibold">
              VS
            </Badge>
          </div>

          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="text-sm font-medium text-center mb-0.5">
              {match.team2?.name || "Équipe 2"}
            </div>
            {team2School && (
              <div className="text-xs text-muted-foreground text-center mb-0.5">
                {formatSchoolName(team2School)}
              </div>
            )}
            {match.score_team2 !== null ? (
              <div className="text-2xl font-bold text-primary">
                {match.score_team2}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">-</div>
            )}
          </div>
        </div>

        {/* Match Details */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center text-sm text-muted-foreground">
            <Flag className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{sportName}</span>
          </div>

          {match.date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {format(new Date(match.date), "dd/MM 'à' HH:mm", {
                  locale: fr,
                })}
              </span>
            </div>
          )}

          {match.location_id && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{locationName}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex justify-between items-center w-full">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
