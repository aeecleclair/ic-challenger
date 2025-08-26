import {
  useGetCompetitionSportsSportIdQuotas,
  usePostCompetitionSchoolsSchoolIdSportsSportIdQuotas,
  usePatchCompetitionSchoolsSchoolIdSportsSportIdQuotas,
  useDeleteCompetitionSchoolsSchoolIdSportsSportIdQuotas,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
import { SportQuotaInfo } from "../api/hyperionSchemas";

interface UseSportsQuotaProps {
  sportId?: string;
}

export const useSportsQuota = ({ sportId }: UseSportsQuotaProps) => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  // Fetch quotas for a specific sport
  const {
    data: sportsQuota,
    refetch: refetchSportsQuota,
    error,
  } = useGetCompetitionSportsSportIdQuotas(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        sportId: sportId!,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired() && !!sportId,
      retry: 0,
      queryHash: "getSportsQuota",
    },
  );

  // Create quota for a school in this sport
  const { mutate: mutateCreateQuota, isPending: isCreateLoading } =
    usePostCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const createQuota = (
    schoolId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateCreateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sportId!,
          schoolId,
        },
        body: body,
      },
      {
        onSuccess: () => {
          refetchSportsQuota();
          toast({
            title: "Quota ajoutée",
            description: "Le quota a été ajouté avec succès.",
          });
          callback();
        },
        onSettled: (data, error) => {
          if (error !== null) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du quota",
              description: (error as unknown as ErrorType).stack.detail,
              variant: "destructive",
            });
          }
        },
      },
    );
  };

  // Update quota for a school in this sport
  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } =
    usePatchCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const updateQuota = (
    schoolId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateUpdateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sportId!,
          schoolId,
        },
        body: body,
      },
      {
        onSuccess: () => {
          refetchSportsQuota();
          toast({
            title: "Quota modifiée",
            description: "Le quota a été modifiée avec succès.",
          });
          callback();
        },
        onSettled: (data, error) => {
          if (error !== null) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du quota",
              description: (error as unknown as ErrorType).stack.detail,
              variant: "destructive",
            });
          }
        },
      },
    );
  };

  // Delete quota for a school in this sport
  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } =
    useDeleteCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const deleteQuota = (schoolId: string, callback: () => void) => {
    return mutateDeleteQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sportId!,
          schoolId,
        },
      },
      {
        onSuccess: () => {
          refetchSportsQuota();
          toast({
            title: "Quota supprimée",
            description: "Le quota a été supprimée avec succès.",
          });
          callback();
        },
        onSettled: (data, error) => {
          if (error !== null) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du quota",
              description: (error as unknown as ErrorType).stack.detail,
              variant: "destructive",
            });
          }
        },
      },
    );
  };

  return {
    sportsQuota,
    error,
    refetchSportsQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  };
};
