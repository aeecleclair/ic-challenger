import {
  useGetCompetitionSchools,
  usePostCompetitionSchools,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

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

  const { mutate: mutateCompetitionSchool, isPending: isLoading } = usePostCompetitionSchools();

  const createCompetitionSchool = (
    params: Parameters<typeof mutateCompetitionSchool>[0],
    callback: () => void,
  ) => {
    return mutateCompetitionSchool(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: params.body,
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
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de la fusion des équipes",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    sportSchools,
    createCompetitionSchool,
    error,
    isLoading,
    refetchSchools,
  };
};
