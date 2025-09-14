import { Match } from "../../../api/hyperionSchemas";
import { Badge } from "../../ui/badge";
import { Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PastMatchCardProps {
  match: Match;
  userTeamId?: string;
}

export const PastMatchCard = ({ match, userTeamId }: PastMatchCardProps) => {
  const isVictory = match.winner_id === userTeamId;
  const isDefeat = match.winner_id && match.winner_id !== userTeamId;
  const isDraw =
    match.score_team1 === match.score_team2 && match.score_team1 !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-sm">{match.name}</h4>
        </div>
        {(isVictory || isDefeat || isDraw) && (
          <Badge
            variant={
              isVictory ? "default" : isDefeat ? "destructive" : "secondary"
            }
            className={cn(
              "text-xs",
              isVictory && "bg-green-500 hover:bg-green-600",
              isDraw && "bg-yellow-500 hover:bg-yellow-600",
            )}
          >
            {isVictory && <Trophy className="h-3 w-3 mr-1" />}
            {isDefeat && <X className="h-3 w-3 mr-1" />}
            {isVictory ? "Victoire" : isDefeat ? "Défaite" : "Match nul"}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "transition-colors",
              match.team1_id === userTeamId
                ? "font-semibold text-primary"
                : "text-muted-foreground",
            )}
          >
            {match.team1.name}
          </span>
          <span className="text-muted-foreground">vs</span>
          <span
            className={cn(
              "transition-colors",
              match.team2_id === userTeamId
                ? "font-semibold text-primary"
                : "text-muted-foreground",
            )}
          >
            {match.team2.name}
          </span>
        </div>

        {match.score_team1 !== null && match.score_team2 !== null && (
          <div className="text-lg font-bold tracking-wider">
            <span
              className={cn(
                match.team1_id === userTeamId && isVictory
                  ? "text-green-600"
                  : match.team1_id === userTeamId && isDefeat
                    ? "text-red-600"
                    : "text-foreground",
              )}
            >
              {match.score_team1}
            </span>
            <span className="text-muted-foreground mx-2">-</span>
            <span
              className={cn(
                match.team2_id === userTeamId && isVictory
                  ? "text-green-600"
                  : match.team2_id === userTeamId && isDefeat
                    ? "text-red-600"
                    : "text-foreground",
              )}
            >
              {match.score_team2}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
