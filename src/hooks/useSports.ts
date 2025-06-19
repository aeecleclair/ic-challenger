import {
  useGetCompetitionSports,
  usePostCompetitionSports,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

export const useSports = () => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: sports,
    refetch: refetchSchools,
    error,
  } = useGetCompetitionSports(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired(),
      retry: 0,
      queryHash: "getSports",
    },
  );

  const { mutate: mutateCompetitionSchool, isPending: isLoading } = usePostCompetitionSports();

  const createSport = (
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
            title: "Sport ajoutée",
            description: "Le sport a été ajoutée avec succès.",
          });
          callback();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de l'ajout du sport",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    sports,
    createSport,
    error,
    isLoading,
    refetchSchools,
  };
};
