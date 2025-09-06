import {
  useGetCompetitionSchools,
  usePostCompetitionSchools,
  usePatchCompetitionSchoolsSchoolId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import {
  SchoolExtensionBase,
  SchoolExtensionEdit,
} from "../api/hyperionSchemas";

export const useSportSchools = () => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: sportSchools,
    refetch: refetchSchools,
    error,
  } = useGetCompetitionSchools(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired(),
      retry: 0,
      queryHash: "getSportSchools",
    },
  );

  const { mutate: mutateCompetitionSchool, isPending: isLoading } =
    usePostCompetitionSchools();

  const createCompetitionSchool = (
    body: SchoolExtensionBase,
    callback: () => void,
  ) => {
    return mutateCompetitionSchool(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la fusion des équipes",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSchools();
            callback();
            toast({
              title: "École ajoutée",
              description: "L'école a été ajoutée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutatePatchCompetitionSchool, isPending: isUpdateLoading } =
    usePatchCompetitionSchoolsSchoolId();

  const updateCompetitionSchool = (
    schoolId: string,
    body: SchoolExtensionEdit,
    callback: () => void,
  ) => {
    return mutatePatchCompetitionSchool(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          schoolId: schoolId,
        },
        body: body,
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
    sportSchools,
    createCompetitionSchool,
    updateCompetitionSchool,
    error,
    isLoading,
    isUpdateLoading,
    refetchSchools,
  };
};
