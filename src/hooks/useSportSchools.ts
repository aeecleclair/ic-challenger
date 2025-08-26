import {
  useGetCompetitionSchools,
  usePostCompetitionSchools,
  usePatchCompetitionSchoolsSchoolId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
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
        onSuccess: () => {
          refetchSchools();
          toast({
            title: "École ajoutée",
            description: "L'école a été ajoutée avec succès.",
          });
          callback();
        },
        onSettled: (data, error) => {
          if (error !== null) {
            console.log(error);
            toast({
              title: "Erreur lors de la fusion des équipes",
              description:
                "Une erreur est survenue, veuillez réessayer plus tard",
              variant: "destructive",
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
        onSuccess: () => {
          refetchSchools();
          toast({
            title: "École mise à jour",
            description: "L'école a été mise à jour avec succès.",
          });
          callback();
        },
        onSettled: (data, error) => {
          if (error !== null) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour",
              description:
                "Une erreur est survenue, veuillez réessayer plus tard",
              variant: "destructive",
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
