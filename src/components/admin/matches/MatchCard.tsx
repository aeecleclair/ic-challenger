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
  Eye,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MatchCardProps {
  match: MatchComplete;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MatchCard = ({ match, onClick, onEdit, onDelete }: MatchCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
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
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="text-sm text-muted-foreground mb-1">Équipe 1</div>
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
            <div className="text-sm text-muted-foreground mb-1">Équipe 2</div>
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
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Flag className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Sport: {match.sport_id}</span>
          </div>

          {match.date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {format(new Date(match.date), "PPP 'à' p", { locale: fr })}
              </span>
            </div>
          )}

          {match.location_id && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Lieu: {match.location_id}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex justify-between items-center w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Voir
          </Button>
          <div className="flex gap-2">
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
