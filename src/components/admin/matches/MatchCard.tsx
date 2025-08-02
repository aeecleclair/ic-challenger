"use client";

import { Match } from "@/src/api/hyperionSchemas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CalendarIcon, MapPinIcon, Trophy, Flag } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MatchCardProps {
  match: Match;
  onClick: () => void;
}

const MatchCard = ({ match, onClick }: MatchCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:border-primary transition-all duration-200 h-full flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{match.name}</CardTitle>
          {match.winner_id && (
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 border-amber-200"
            >
              <Trophy className="h-3 w-3 mr-1" />
              Terminé
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-2 flex-grow">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="font-medium text-center">{match.team1.name}</div>
            {match.score_team1 !== null && (
              <div className="text-2xl font-bold">{match.score_team1}</div>
            )}
          </div>

          <div className="col-span-1 flex items-center justify-center">
            <Badge variant="outline" className="bg-gray-100">
              VS
            </Badge>
          </div>

          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="font-medium text-center">{match.team2.name}</div>
            {match.score_team2 !== null && (
              <div className="text-2xl font-bold">{match.score_team2}</div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start pt-2 border-t">
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <Flag className="h-4 w-4 mr-1" />
          <span>Sport: {match.sport_id}</span>
        </div>

        {match.date && (
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>
              {format(new Date(match.date), "PPP 'à' p", { locale: fr })}
            </span>
          </div>
        )}

        {match.location_id && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>Lieu: {match.location_id}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
