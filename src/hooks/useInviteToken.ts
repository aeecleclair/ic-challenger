import {
  usePostRaidTeamsTeamIdInvite,
  usePostRaidTeamsJoinToken,
} from "@/src/api/hyperionComponents";
import { InviteToken } from "../api/hyperionSchemas";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

export const useInviteToken = () => {
  const { token } = useAuth();

  const {
    mutate: mutateCreateInviteToken,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = usePostRaidTeamsTeamIdInvite({});

  const createInviteToken = (
    teamId: string,
    callback: (token: InviteToken) => void,
  ) => {
    mutateCreateInviteToken(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          teamId: teamId,
        },
      },
      {
        onSuccess(data, variables, context) {
          callback(data);
        },
      },
    );
  };

  const {
    mutate: mutateJoinTeam,
    isPending: isJoinLoading,
    isSuccess: isJoinSuccess,
  } = usePostRaidTeamsJoinToken({});

  const joinTeam = (joinToken: string, callback: () => void) => {
    mutateJoinTeam(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          token: joinToken,
        },
      },
      {
        // Not using onSucess because of : https://github.com/TanStack/query/discussions/2878
        onSettled: (data, error) => {
          // Assuming success in all cases
          // For unknown reasons, the invalidation of the query does not work
          if (error) {
            console.log(error);
            toast({
              title: "Erreur lors du changement d'équipe",
              description:
                "Une erreur est survenue, veuillez réessayer plus tard",
              variant: "destructive",
            });
            return;
          }
          callback();
        },
      },
    );
  };

  return {
    createInviteToken,
    isCreationLoading,
    isCreationSuccess,
    joinTeam,
    isJoinLoading,
    isJoinSuccess,
  };
};
