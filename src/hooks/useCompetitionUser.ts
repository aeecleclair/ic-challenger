import {
  useGetCompetitionUsersMe,
  usePostCompetitionUsers,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
import { CompetitionUserBase } from "../api/hyperionSchemas";

export const useCompetitionUser = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: meCompetition,
    isLoading,
    refetch: refetchMeCompetition,
  } = useGetCompetitionUsersMe(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
    },
  );

  const { mutate: mutateCreateUser, isPending: isCreateLoading } =
    usePostCompetitionUsers();

  const createCompetitionUser = async (
    body: CompetitionUserBase,
    callback: () => void,
  ) => {
    return mutateCreateUser(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSuccess: () => {
          refetchMeCompetition();
          toast({
            title: "Utilisateur ajouté",
            description: "L'utilisateur a été ajouté avec succès.",
          });
          callback();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de l'ajout de l'utilisateur",
            description: (error as unknown as ErrorType).stack.detail,
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    meCompetition,
    isLoading,
    createCompetitionUser,
    isCreateLoading,
  };
};
