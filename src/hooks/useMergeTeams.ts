import { useQueryClient } from "@tanstack/react-query";
import { usePostRaidTeamsMerge } from "../api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

export const useMergeTeams = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: mutateMergeTeams, isPending: isMergeLoading } =
    usePostRaidTeamsMerge({});
  const mergeTeams = (
    team1Id: string,
    team2Id: string,
    callback: () => void,
  ) => {
    mutateMergeTeams(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        queryParams: {
          team1_id: team1Id,
          team2_id: team2Id,
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
            title: "Erreur lors de la fusion des équipes",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
        },
      },
    );
  };
  return {
    mergeTeams,
    isMergeLoading,
  };
};
