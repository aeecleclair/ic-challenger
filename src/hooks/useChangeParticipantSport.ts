import { usePatchCompetitionParticipantsSportsSportIdUsersUserId } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "../utils/errorTyping";

export const useChangeParticipantSport = () => {
  const { token } = useAuth();

  const { mutate: mutateChangeParticipant, isPending: isChangeLoading } =
    usePatchCompetitionParticipantsSportsSportIdUsersUserId();

  const changeParticipantSport = (
    srcSportId: string,
    userId: string,
    body: { sport_id?: string; team_id?: string | null },
    callback: () => void,
  ) => {
    return mutateChangeParticipant(
      {
        headers: { Authorization: `Bearer ${token}` },
        pathParams: { sportId: srcSportId, userId },
        body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            toast({
              title: "Erreur lors du changement de sport",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Sport modifié",
              description: "Le sport du participant a été modifié avec succès.",
            });
          }
        },
      },
    );
  };

  const changeParticipantTeam = (
    sportId: string,
    userId: string,
    teamId: string,
    callback: () => void,
  ) => {
    return mutateChangeParticipant(
      {
        headers: { Authorization: `Bearer ${token}` },
        pathParams: { sportId, userId },
        body: { team_id: teamId },
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            toast({
              title: "Erreur lors du changement d'équipe",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Équipe modifiée",
              description:
                "L'équipe du participant a été modifiée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    changeParticipantSport,
    changeParticipantTeam,
    isChangeLoading,
  };
};
