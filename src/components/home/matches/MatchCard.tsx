import { Match } from "../../../api/hyperionSchemas";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Clock, MapPin, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  userTeamId?: string;
  urgency: "urgent" | "soon" | "normal";
  timeUntil: string;
}

export const MatchCard = ({
  match,
  userTeamId,
  urgency,
  timeUntil,
}: MatchCardProps) => {
  return (
    <div className="flex gap-4 items-stretch">
      <div className="flex flex-col">
        <Separator
          orientation="vertical"
          className={cn(
            "w-1 flex-1 rounded-full",
            urgency === "urgent" && "bg-red-500",
            urgency === "soon" && "bg-orange-500",
            urgency === "normal" && "bg-blue-500",
          )}
        />
      </div>
      <div className="flex-1 space-y-3 py-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">{match.name}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {match.date && (
                <span>
                  {new Date(match.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              <Clock className="h-3 w-3 ml-2" />
              {match.date && (
                <span>
                  {new Date(match.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
              {match.location && (
                <>
                  <MapPin className="h-3 w-3 ml-2" />
                  <span>{match.location.name}</span>
                </>
              )}
            </div>
          </div>

          <Badge
            variant={
              urgency === "urgent"
                ? "destructive"
                : urgency === "soon"
                  ? "secondary"
                  : "default"
            }
            className={cn(
              "text-xs font-mono",
              urgency === "urgent" && "bg-red-500 hover:bg-red-600 text-white",
              urgency === "soon" &&
                "bg-orange-500 hover:bg-orange-600 text-white",
              urgency === "normal" &&
                "bg-blue-500 hover:bg-blue-600 text-white",
            )}
          >
            <Clock className="h-3 w-3 mr-1" />
            Dans {timeUntil}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <span className="text-muted-foreground font-medium">vs</span>
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
        </div>

        {match.location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/50 p-2 rounded">
            <MapPin className="h-3 w-3" />
            <span>{match.location.name}</span>
            {match.location.address && (
              <span className="text-xs">• {match.location.address}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
