import { Match, MatchComplete } from "../../../api/hyperionSchemas";
import { Badge } from "../../ui/badge";
import { Trophy, X, School, Users, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface PastMatchCardProps {
  match: MatchComplete;
  userTeamId?: string;
  // New props for badges
  showSportBadge?: boolean;
  showSchoolBadges?: boolean;
  showSportCategoryBadges?: boolean; // New: show sport category badges
  showTeamBadges?: boolean; // New: show team badges
  sports?: Array<{ id: string; name: string; sport_category?: string | null }>;
  schools?: Array<{ school_id: string; school: { id: string; name: string } }>;
  teams?: Array<{
    id: string;
    name: string;
    school_id: string;
    sport_id: string;
  }>;
}

export const PastMatchCard = ({
  match,
  userTeamId,
  showSportBadge = false,
  showSchoolBadges = false,
  showSportCategoryBadges = false, // New prop
  showTeamBadges = false, // New prop
  sports = [],
  schools = [],
  teams = [], // New prop
}: PastMatchCardProps) => {
  const isUserMatch =
    match.team1_id === userTeamId || match.team2_id === userTeamId;
  const isVictory = match.winner_id === userTeamId;
  const isDefeat = match.winner_id && match.winner_id !== userTeamId;
  const isDraw =
    match.score_team1 === match.score_team2 && match.score_team1 !== null;

  // Determine winning team for score highlighting
  const team1Won = match.winner_id === match.team1_id;
  const team2Won = match.winner_id === match.team2_id;

  // Helper functions to get sport, school, and team names
  const getSportName = (sportId: string) => {
    return sports.find((sport) => sport.id === sportId)?.name || "Sport";
  };

  const getSportCategory = (sportId: string) => {
    const sport = sports.find((sport) => sport.id === sportId);
    if (!sport?.sport_category) return "Mixte";
    return sport.sport_category === "masculine"
      ? "Masculin"
      : sport.sport_category === "feminine"
        ? "Féminin"
        : "Mixte";
  };

  const getSchoolName = (schoolId: string) => {
    return (
      formatSchoolName(
        schools.find((school) => school.school_id === schoolId)?.school.name,
      ) || "École"
    );
  };

  const getTeamName = (teamId: string) => {
    return teams.find((team) => team.id === teamId)?.name || "Équipe";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-sm">{match.name}</h4>
        </div>
        {isUserMatch && (
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
                "transition-colors",
                team1Won
                  ? "text-green-600 bg-green-100 px-2 py-1 rounded font-extrabold"
                  : isDraw
                    ? "text-yellow-600 bg-yellow-100 px-2 py-1 rounded"
                    : "text-muted-foreground",
              )}
            >
              {match.score_team1}
            </span>
            <span className="text-muted-foreground mx-3">-</span>
            <span
              className={cn(
                "transition-colors",
                team2Won
                  ? "text-green-600 bg-green-100 px-2 py-1 rounded font-extrabold"
                  : isDraw
                    ? "text-yellow-600 bg-yellow-100 px-2 py-1 rounded"
                    : "text-muted-foreground",
              )}
            >
              {match.score_team2}
            </span>
          </div>
        )}
      </div>

      {/* Sport, School, Team, and Category Badges */}
      {(showSportBadge ||
        showSchoolBadges ||
        showSportCategoryBadges ||
        showTeamBadges) && (
        <div className="flex items-center gap-2 flex-wrap">
          {showSportBadge && (
            <Badge
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              <Trophy className="h-3 w-3" />
              {getSportName(match.sport_id)}
            </Badge>
          )}
          {showSportCategoryBadges && (
            <Badge
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              <Target className="h-3 w-3" />
              {getSportCategory(match.sport_id)}
            </Badge>
          )}
          {showSchoolBadges && (
            <>
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                <School className="h-3 w-3" />
                {getSchoolName(match.team1.school_id)}
              </Badge>
              {match.team1.school_id !== match.team2.school_id && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <School className="h-3 w-3" />
                  {getSchoolName(match.team2.school_id)}
                </Badge>
              )}
            </>
          )}
          {showTeamBadges && (
            <>
              <Badge
                variant="default"
                className="text-xs flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                {getTeamName(match.team1_id)}
              </Badge>
              <Badge
                variant="default"
                className="text-xs flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                {getTeamName(match.team2_id)}
              </Badge>
            </>
          )}
        </div>
      )}
    </div>
  );
};
