import {
  useGetCompetitionParticipantsSchoolsSchoolId,
  usePatchCompetitionParticipantsUserIdSportsSportIdValidate,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

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

  const { mutate: mutatePatchSchoolParticipants, isPending: isUpdateLoading } =
    usePatchCompetitionParticipantsUserIdSportsSportIdValidate();

  const updateSchoolParticipants = (
    sportId: string,
    userId: string,
    callback: () => void,
  ) => {
    return mutatePatchSchoolParticipants(
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
        onSuccess: () => {
          refetchSchools();
          toast({
            title: "École mise à jour",
            description: "L'école a été mise à jour avec succès.",
          });
          callback();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de la mise à jour",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    schoolParticipants,
    updateSchoolParticipants,
    error,
    isUpdateLoading,
    refetchSchools,
  };
};
