import { useQueryClient } from "@tanstack/react-query";
import { useDeleteRaidTeams } from "../api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

export const useDeleteAllTeams = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: mutateDeleteAllTeams, isPending: isDeleteAllLoading } =
    useDeleteRaidTeams({});

  const deleteAllTeams = (callback: () => void) => {
    mutateDeleteAllTeams(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        onSettled() {
          // Invalidate any queries related to teams
          queryClient.invalidateQueries({
            predicate: (query) => {
              return (
                query.queryHash === "getTeams" ||
                query.queryHash === "getTeamById" ||
                query.queryHash === "getTeamByParticipantId"
              );
            },
          });

          // Show success message
          toast({
            title: "Succès",
            description: "Toutes les équipes ont été supprimées avec succès",
          });

          // Execute callback function
          callback();
        },
        onError(error) {
          console.error(error);
          toast({
            title: "Erreur",
            description:
              "Une erreur est survenue lors de la suppression des équipes",
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    deleteAllTeams,
    isDeleteAllLoading,
  };
};
