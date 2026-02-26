import { usePostCompetitionTeams } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "../utils/errorTyping";

export const useCreateTeam = () => {
  const { token } = useAuth();

  const { mutate: mutateCreateTeam, isPending: isCreateTeamLoading } =
    usePostCompetitionTeams();

  const createTeam = (
    body: {
      name: string;
      sport_id: string;
      school_id: string;
      captain_id: string;
    },
    callback: (teamId: string) => void,
  ) => {
    return mutateCreateTeam(
      {
        headers: { Authorization: `Bearer ${token}` },
        body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            toast({
              title: "Erreur lors de la création de l'équipe",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else if (data) {
            callback(data.id);
          }
        },
      },
    );
  };

  return {
    createTeam,
    isCreateTeamLoading,
  };
};
