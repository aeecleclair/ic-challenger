import {
  useGetCompetitionPodiumsGlobal,
  useGetCompetitionPodiumsSportsSportId,
  useGetCompetitionPodiumsSchoolsSchoolId,
  usePostCompetitionPodiumsSportsSportId,
  useDeleteCompetitionPodiumsSportsSportId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { SportPodiumRankings } from "../api/hyperionSchemas";

interface UsePodiumsProps {
  sportId?: string;
  schoolId?: string;
}

export const usePodiums = (props?: UsePodiumsProps) => {
  const { token, isTokenExpired } = useAuth();
  const { sportId, schoolId } = props || {};

  // Global podium
  const {
    data: globalPodium,
    isLoading: isGlobalLoading,
    refetch: refetchGlobalPodium,
    error: globalError,
  } = useGetCompetitionPodiumsGlobal(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getGlobalPodium",
    },
  );

  // Sport-specific podium
  const {
    data: sportPodium,
    isLoading: isSportLoading,
    refetch: refetchSportPodium,
    error: sportError,
  } = useGetCompetitionPodiumsSportsSportId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        sportId: sportId!,
      },
    },
    {
      enabled: !!sportId && !isTokenExpired(),
      retry: 0,
      queryHash: `getSportPodium-${sportId}`,
    },
  );

  // School-specific podium
  const {
    data: schoolPodium,
    isLoading: isSchoolLoading,
    refetch: refetchSchoolPodium,
    error: schoolError,
  } = useGetCompetitionPodiumsSchoolsSchoolId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        schoolId: schoolId!,
      },
    },
    {
      enabled: !!schoolId && !isTokenExpired(),
      retry: 0,
      queryHash: `getSchoolPodium-${schoolId}`,
    },
  );

  const {
    mutate: mutateCreateOrUpdateSportPodium,
    isPending: isUpdateLoading,
  } = usePostCompetitionPodiumsSportsSportId();

  const createOrUpdateSportPodium = (
    targetSportId: string,
    rankings: SportPodiumRankings,
    callback: () => void,
  ) => {
    return mutateCreateOrUpdateSportPodium(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: targetSportId,
        },
        body: rankings,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour du podium",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchGlobalPodium();
            if (sportId === targetSportId) {
              refetchSportPodium();
            }
            callback();
            toast({
              title: "Podium mis à jour",
              description: "Le podium a été mis à jour avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteSportPodium, isPending: isDeleteLoading } =
    useDeleteCompetitionPodiumsSportsSportId();

  const deleteSportPodium = (targetSportId: string, callback: () => void) => {
    return mutateDeleteSportPodium(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: targetSportId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du podium",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchGlobalPodium();
            if (sportId === targetSportId) {
              refetchSportPodium();
            }
            callback();
            toast({
              title: "Podium supprimé",
              description: "Le podium a été supprimé avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    globalPodium,
    sportPodium,
    schoolPodium,
    createOrUpdateSportPodium,
    deleteSportPodium,
    isGlobalLoading,
    isSportLoading,
    isSchoolLoading,
    isUpdateLoading,
    isDeleteLoading,
    globalError,
    sportError,
    schoolError,
    refetchGlobalPodium,
    refetchSportPodium,
    refetchSchoolPodium,
  };
};
