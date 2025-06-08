import { useUser } from "./useUser";
import {
  useDeleteRaidTeamsTeamId,
  useGetRaidTeamsTeamId,
  usePostRaidTeamsMerge,
  usePostRaidTeamsTeamIdKickParticipantId,
} from "../api/hyperionComponents";
import { useAuth } from "./useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "../components/ui/use-toast";

export const useAdminTeam = (teamId: string) => {
  const { token, userId, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();
  const queryClient = useQueryClient();

  const { data: team, refetch: refetchTeam } = useGetRaidTeamsTeamId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        teamId: teamId,
      },
    },
    {
      enabled: userId !== null && isAdmin() && !isTokenExpired(),
      retry: 0,
      queryHash: "getTeamById",
    },
  );

  const { mutate: mutateKickMember, isPending: isKickLoading } =
    usePostRaidTeamsTeamIdKickParticipantId({});

  const kickMember = (participantId: string, callback: () => void) => {
    mutateKickMember(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          teamId,
          participantId,
        },
      },
      {
        onSuccess(data, variables, context) {
          queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryHash === "getTeamById";
            },
          });
          callback();
        },
        onError(error, variables, context) {
          console.log(error);
          toast({
            title: "Erreur lors de l'exclusion du membre",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
        },
      },
    );
  };

  const { mutate: mutateDeleteTeam, isPending: isDeleteLoading } =
    useDeleteRaidTeamsTeamId({});

  const deleteTeam = (callback: () => void) => {
    mutateDeleteTeam(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          teamId,
        },
      },
      {
        onSettled() {
          queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryHash === "getTeamById";
            },
          });
          callback();
        },
      },
    );
  };

  return {
    team,
    refetchTeam,
    kickMember,
    isKickLoading,
    isDeleteLoading,
    deleteTeam,
  };
};
