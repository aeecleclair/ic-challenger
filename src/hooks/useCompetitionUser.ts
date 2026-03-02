import {
  useGetCompetitionUsersMe,
  usePostCompetitionUsers,
  usePatchCompetitionUsersUserIdInvalidate,
  usePatchCompetitionUsersUserIdValidate,
  usePatchCompetitionUsersMe,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "../utils/errorTyping";
import {
  CompetitionUserBase,
  CompetitionUserEdit,
} from "../api/hyperionSchemas";

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
      retry: false,
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
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout de l'utilisateur",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchMeCompetition();
            callback();
            toast({
              title: "Utilisateur ajouté",
              description: "L'utilisateur a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateUserMe, isPending: isUpdateLoading } =
    usePatchCompetitionUsersMe();

  const updateCompetitionUser = async (
    body: CompetitionUserEdit,
    callback: () => void,
  ) => {
    return mutateUpdateUserMe(
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
              title: "Erreur lors de la modification de l'utilisateur",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchMeCompetition();
            callback();
            toast({
              title: "Utilisateur modifié",
              description: "L'utilisateur a été modifié avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    meCompetition,
    isLoading,
    refetchMeCompetition,
    createCompetitionUser,
    updateCompetitionUser,
    isCreateLoading,
  };
};
