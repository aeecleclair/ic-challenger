import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { SchoolGeneralQuotaBase, SportQuotaInfo } from "../api/hyperionSchemas";
import {
  useGetCompetitionSchoolsSchoolIdGeneralQuota,
  usePatchCompetitionSchoolsSchoolIdGeneralQuota,
  usePostCompetitionSchoolsSchoolIdGeneralQuota,
} from "../api/hyperionComponents";

interface UseSchoolsGeneralQuotaProps {
  schoolId?: string;
}

export const useSchoolsGeneralQuota = ({
  schoolId,
}: UseSchoolsGeneralQuotaProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: schoolsGeneralQuota,
    refetch: refetchSchoolsGeneralQuota,
    error,
  } = useGetCompetitionSchoolsSchoolIdGeneralQuota(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        schoolId: schoolId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!schoolId,
      retry: 0,
      queryHash: "getSchoolsGeneralQuota",
    },
  );

  const { mutate: mutateCreateQuota, isPending: isCreateLoading } =
    usePostCompetitionSchoolsSchoolIdGeneralQuota();

  const createQuota = (body: SchoolGeneralQuotaBase, callback: () => void) => {
    return mutateCreateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du quota",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSchoolsGeneralQuota();
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
    usePatchCompetitionSchoolsSchoolIdGeneralQuota();

  const updateQuota = (body: SchoolGeneralQuotaBase, callback: () => void) => {
    return mutateUpdateQuota(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId!,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du quota",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSchoolsGeneralQuota();
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

  return {
    schoolsGeneralQuota,
    error,
    refetchSchoolsGeneralQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
  };
};
