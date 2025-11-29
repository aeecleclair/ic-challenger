import {
  useGetCompetitionPodiumsPompoms,
  usePostCompetitionPodiumsPompoms,
  useDeleteCompetitionPodiumsPompoms,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { SchoolResult } from "../api/hyperionSchemas";

export const usePompomsPodiums = () => {
  const { token, isTokenExpired } = useAuth();

  // Get pompoms podium
  const {
    data: pompomsResults,
    isLoading: isPompomsLoading,
    refetch: refetchPompomsPodium,
    error: pompomsError,
  } = useGetCompetitionPodiumsPompoms(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getPompomsPodium",
    },
  );

  const {
    mutate: mutateCreateOrUpdatePompomsPodium,
    isPending: isUpdateLoading,
  } = usePostCompetitionPodiumsPompoms();

  const createOrUpdatePompomsPodium = (
    rankings: SchoolResult[],
    callback: () => void,
  ) => {
    return mutateCreateOrUpdatePompomsPodium(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: rankings,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour du podium pompoms",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchPompomsPodium();
            callback();
            toast({
              title: "Podium pompoms mis à jour",
              description: "Le podium pompoms a été mis à jour avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeletePompomsPodium, isPending: isDeleteLoading } =
    useDeleteCompetitionPodiumsPompoms();

  const deletePompomsPodium = (callback: () => void) => {
    return mutateDeletePompomsPodium(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du podium pompoms",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchPompomsPodium();
            callback();
            toast({
              title: "Podium pompoms supprimé",
              description: "Le podium pompoms a été supprimé avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    pompomsResults,
    createOrUpdatePompomsPodium,
    deletePompomsPodium,
    isPompomsLoading,
    isUpdateLoading,
    isDeleteLoading,
    pompomsError,
    refetchPompomsPodium,
  };
};
