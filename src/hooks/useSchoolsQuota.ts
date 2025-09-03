import {
  useDeleteCompetitionSchoolsSchoolIdSportsSportIdQuotas,
  useGetCompetitionSchoolsSchoolIdQuotas,
  usePatchCompetitionSchoolsSchoolIdSportsSportIdQuotas,
  usePostCompetitionSchoolsSchoolIdSportsSportIdQuotas,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
import { SportQuotaInfo } from "../api/hyperionSchemas";

interface UseSchoolsQuotaProps {
  schoolId?: string;
}

export const useSchoolsQuota = ({ schoolId }: UseSchoolsQuotaProps) => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: schoolsQuota,
    refetch: refetchSchoolsQuota,
    error,
  } = useGetCompetitionSchoolsSchoolIdQuotas(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        schoolId: schoolId!,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired() && !!schoolId,
      retry: 0,
      queryHash: "getSchoolsQuota",
    },
  );

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } =
    usePostCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const createQuota = (
    sportId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateCreateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
          sportId,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du quota",
              description: (error as unknown as ErrorType).stack.body,
              variant: "destructive",
            });
          } else {
            refetchSchoolsQuota();
            callback();
            toast({
              title: "Quota ajoutée",
              description: "Le quota a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateQuota, isPending: isUpdateLoading } =
    usePatchCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const updateQuota = (
    sportId: string,
    body: SportQuotaInfo,
    callback: () => void,
  ) => {
    return mutateUpdateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
          sportId,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du quota",
              description: (error as unknown as ErrorType).stack.body,
              variant: "destructive",
            });
          } else {
            refetchSchoolsQuota();
            callback();
            toast({
              title: "Quota modifiée",
              description: "Le quota a été modifiée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteQuota, isPending: isDeleteLoading } =
    useDeleteCompetitionSchoolsSchoolIdSportsSportIdQuotas();

  const deleteQuota = (sportId: string, callback: () => void) => {
    return mutateDeleteQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
          sportId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du quota",
              description: (error as unknown as ErrorType).stack.body,
              variant: "destructive",
            });
          } else {
            refetchSchoolsQuota();
            callback();
            toast({
              title: "Quota supprimée",
              description: "Le quota a été supprimée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    schoolsQuota,
    error,
    refetchSchoolsQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  };
};
