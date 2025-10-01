import {
  usePatchCompetitionUsersUserIdInvalidate,
  usePatchCompetitionUsersUserIdValidate,
  useGetCompetitionUsers,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "../utils/errorTyping";
import { useMemo } from "react";

export const useCompetitionUsers = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: competitionUsers,
    isLoading,
    refetch: refetchCompetitionUsers,
  } = useGetCompetitionUsers(
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

  const {
    mutate: mutateValidateCompetitionUser,
    isPending: isValidateLoading,
  } = usePatchCompetitionUsersUserIdValidate();

  const validateCompetitionUser = (userId: string, callback: () => void) => {
    return mutateValidateCompetitionUser(
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
            refetchCompetitionUsers();
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
    mutate: mutateInvalidateCompetitionUser,
    isPending: isInvalidateLoading,
  } = usePatchCompetitionUsersUserIdInvalidate();

  const invalidateCompetitionUser = (userId: string, callback: () => void) => {
    return mutateInvalidateCompetitionUser(
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
            refetchCompetitionUsers();
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

  const volunteers = useMemo(
    () =>
      competitionUsers
        ? competitionUsers.filter((user) => user.is_volunteer)
        : [],
    [competitionUsers],
  );

  return {
    competitionUsers,
    volunteers,
    isLoading,
    refetchCompetitionUsers,
    validateCompetitionUser,
    isValidateLoading,
    isInvalidateLoading,
    invalidateCompetitionUser,
  };
};
