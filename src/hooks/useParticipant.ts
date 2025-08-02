import {
  usePostCompetitionSportsSportIdParticipate,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
import { Participant, ParticipantInfo } from "../api/hyperionSchemas";

export const useParticipant = () => {
  const { token } = useAuth();

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
        onSuccess: () => {
          toast({
            title: "Demande d'inscription enregistrée",
            description:
              "Votre demande d'inscription a été envoyée avec succès.",
          });
          callback();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de l'inscription",
            description: (error as unknown as ErrorType).stack.detail,
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    createParticipant,
    isCreateLoading,
  };
};
