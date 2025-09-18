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
            refetchMeCompetition();
            callback();
            toast({
              title: "Participant mis à jour",
              description: "Le participant a été mis à jour avec succès.",
            });
          }
        },
      },
    );
  };

  const {
    mutate: mutateInvalidateParticipants,
    isPending: isInvalidateLoading,
  } = usePatchCompetitionUsersUserIdInvalidate();

  const invalidateParticipants = (userId: string, callback: () => void) => {
    return mutateInvalidateParticipants(
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
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchMeCompetition();
            callback();
            toast({
              title: "Participant mis à jour",
              description: "Le participant a été mis à jour avec succès.",
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
    validateParticipants,
    isValidateLoading,
    isInvalidateLoading,
    invalidateParticipants,
  };
};
