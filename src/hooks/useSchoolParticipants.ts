import {
  useGetCompetitionParticipantsSchoolsSchoolId,
  usePatchCompetitionParticipantsUserIdSportsSportIdInvalidate,
  usePatchCompetitionUsersUserIdValidate,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";

interface UseSchoolParticipants {
  schoolId: string | null;
}

export const useSchoolParticipants = ({ schoolId }: UseSchoolParticipants) => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: schoolParticipants,
    refetch: refetchSchools,
    error,
  } = useGetCompetitionParticipantsSchoolsSchoolId(
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
      queryHash: "getSchoolParticipants",
    },
  );

  const { mutate: mutateValidateParticipants, isPending: isValidateLoading } =
    usePatchCompetitionUsersUserIdValidate();

  const validateParticipants = (userId: string, callback: () => void) => {
    return mutateValidateParticipants(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId: userId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour",
              description:
                (error as any).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSchools();
            callback();
            toast({
              title: "École mise à jour",
              description: "L'école a été mise à jour avec succès.",
            });
          }
        },
      },
    );
  };

  const {
    mutate: mutateInvalidateParticipants,
    isPending: isInvalidateLoading,
  } = usePatchCompetitionParticipantsUserIdSportsSportIdInvalidate();

  const invalidateParticipants = (
    userId: string,
    sportId: string,
    callback: () => void,
  ) => {
    return mutateInvalidateParticipants(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId: userId,
          sportId: sportId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSchools();
            callback();
            toast({
              title: "École mise à jour",
              description: "L'école a été mise à jour avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    schoolParticipants,
    validateParticipants,
    error,
    isValidateLoading,
    isInvalidateLoading,
    invalidateParticipants,
    refetchSchools,
  };
};
