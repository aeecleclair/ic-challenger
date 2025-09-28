import {
  useDeleteCompetitionSportsSportIdWithdraw,
  useGetCompetitionParticipantsMe,
  usePostCompetitionSportsSportIdParticipate,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { ParticipantInfo } from "../api/hyperionSchemas";

export const useParticipant = () => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: meParticipant,
    refetch: refetchMeParticipant,
    error,
  } = useGetCompetitionParticipantsMe(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getMeParticipant",
    },
  );

  const { mutate: mutateCreateParticipant, isPending: isCreateLoading } =
    usePostCompetitionSportsSportIdParticipate();

  const createParticipant = async (
    body: ParticipantInfo,
    sportId: string,
    callback: () => void,
  ) => {
    return mutateCreateParticipant(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
        pathParams: {
          sportId: sportId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'inscription",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchMeParticipant();
            callback();
            toast({
              title: "Demande d'inscription enregistrée",
              description:
                "Votre demande d'inscription a été envoyée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateWithdrawParticipant, isPending: isWithdrawalLoading } =
    useDeleteCompetitionSportsSportIdWithdraw();

  const withdrawParticipant = async (sportId: string, callback: () => void) => {
    return mutateWithdrawParticipant(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sportId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la désinscription",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchMeParticipant();
            callback();
            toast({
              title: "Désinscription enregistrée",
              description: "Votre désinscription a été effectuée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    meParticipant,
    refetchMeParticipant,
    error,
    createParticipant,
    isCreateLoading,
    withdrawParticipant,
    isWithdrawalLoading,
  };
};
