import { Match } from "../../../api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { PastMatchCard } from "./PastMatchCard";

interface PastMatchesProps {
  matches: Match[];
  userTeamId?: string;
}

export const PastMatches = ({ matches, userTeamId }: PastMatchesProps) => {
  const [showAllMatches, setShowAllMatches] = useState(false);

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Matchs Précédents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun match joué pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Matchs Précédents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(showAllMatches ? matches : matches.slice(0, 3)).map(
          (match, index) => {
            return (
              <div key={match.id}>
                <PastMatchCard match={match} userTeamId={userTeamId} />

                {index <
                  (showAllMatches
                    ? matches.length
                    : Math.min(matches.length, 3)) -
                    1 && <Separator className="mt-4" />}
              </div>
            );
          },
        )}

        {matches.length > 3 && (
          <div className="pt-2">
            <button
              onClick={() => setShowAllMatches(!showAllMatches)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 py-2 hover:bg-muted/50 rounded"
            >
              {showAllMatches ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Afficher moins
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  et {matches.length - 3} autres matchs...
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
