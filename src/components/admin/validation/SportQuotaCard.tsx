import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Trophy, Users, CheckCircle, AlertCircle } from "lucide-react";
import { Separator } from "@/src/components/ui/separator";
import {
  ParticipantDataTable,
  ParticipantData,
} from "@/src/components/admin/validation/ParticipantDataTable";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useMemo } from "react";

interface SportQuotaCardProps {
  sportId: string;
  sportName: string;
  participants: ParticipantData[];
  quota: any;
  onValidateParticipant: (userId: string, sportId: string) => void;
  isLoading: boolean;
  schoolId: string;
  schoolName: string;
}

export const SportQuotaCard = ({
  sportId,
  sportName,
  participants,
  quota,
  onValidateParticipant,
  isLoading,
  schoolId,
  schoolName,
}: SportQuotaCardProps) => {
  const { teams } = useSchoolSportTeams({
    schoolId,
    sportId,
  });

  const participantsWithTeamNames = useMemo(() => {
    return participants.map((participant) => {
      if (participant.teamId && teams) {
        const team = teams.find((t) => t.id === participant.teamId);
        return {
          ...participant,
          teamName: team?.name || participant.teamId,
          isCaptain: team?.captain_id === participant.userId || false,
        };
      }
      return participant;
    });
  }, [participants, teams]);

  const totalParticipants = participantsWithTeamNames.length;
  const validatedParticipants = participantsWithTeamNames.filter(
    (p) => p.isValidated,
  ).length;
  const maxParticipants = quota?.participant_quota || 0;
  const maxTeams = quota?.team_quota || 0;

  const uniqueTeams = new Set(
    participantsWithTeamNames.map((p) => p.teamId).filter(Boolean),
  ).size;

  const isOverQuota = totalParticipants > maxParticipants;
  const isTeamsOverQuota = maxTeams > 0 && uniqueTeams > maxTeams;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {sportName}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isOverQuota && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Quota dépassé
              </Badge>
            )}
            {!isOverQuota && totalParticipants === maxParticipants && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Quota atteint
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Participants</span>
            </div>
            <div
              className={`font-medium ${isOverQuota ? "text-destructive" : ""}`}
            >
              {totalParticipants} / {maxParticipants}
            </div>
          </div>

          {maxTeams > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Équipes</span>
              </div>
              <div
                className={`font-medium ${isTeamsOverQuota ? "text-destructive" : ""}`}
              >
                {uniqueTeams} / {maxTeams}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Validés</span>
            <span className="font-medium">
              {validatedParticipants} / {totalParticipants}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{
                width: `${totalParticipants > 0 ? (validatedParticipants / totalParticipants) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <Separator />

        <div className="max-h-64 overflow-y-auto">
          <ParticipantDataTable
            data={participantsWithTeamNames}
            schoolName={schoolName}
            onValidateParticipant={onValidateParticipant}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
