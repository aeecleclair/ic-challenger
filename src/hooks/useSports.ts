import {
  useGetCompetitionSports,
  usePatchCompetitionParticipantsUserIdSportsSportIdValidate,
  usePatchCompetitionSportsSportId,
  usePostCompetitionSports,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
import { SportBase, SportEdit } from "../api/hyperionSchemas";

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

  const { mutate: mutateCreateSport, isPending: isCreateLoading } =
    usePostCompetitionSports();

  const createSport = (body: SportBase, callback: () => void) => {
    return mutateCreateSport(
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
            title: "Sport ajoutée",
            description: "Le sport a été ajoutée avec succès.",
          });
          callback();
        },
        onSettled: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de l'ajout du sport",
            description: (error as unknown as ErrorType).stack.detail,
            variant: "destructive",
          });
        },
      },
    );
  };

  const { mutate: mutateUpdateSport, isPending: isUpdateLoading } =
    usePatchCompetitionSportsSportId();

  const updateSport = (
    sportId: string,
    body: SportEdit,
    callback: () => void,
  ) => {
    return mutateUpdateSport(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
        pathParams: {
          sportId,
        },
      },
      {
        onSuccess: () => {
          refetchSchools();
          toast({
            title: "Sport modifiée",
            description: "Le sport a été modifiée avec succès.",
          });
          callback();
        },
        onSettled: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de la modification du sport",
            description: (error as unknown as ErrorType).stack.detail,
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
    isCreateLoading,
    isUpdateLoading,
    updateSport,
    refetchSchools,
  };
};
