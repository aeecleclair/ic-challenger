import {
  useGetCompetitionParticipantsMe,
  usePostCompetitionSportsSportIdParticipate,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
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
          if ((error as any).stack.body) {
            console.log(error);
            toast({
              title: "Erreur lors de l'inscription",
              description: (error as unknown as ErrorType).stack.body,
              variant: "destructive",
            });
          } else {
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

  return {
    meParticipant,
    refetchMeParticipant,
    error,
    createParticipant,
    isCreateLoading,
  };
};
