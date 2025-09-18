import { usePatchCompetitionParticipantsSportsSportIdUsersUserIdLicense } from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";

export const useLicense = () => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const { mutate: mutateUpdateLicense, isPending: isUpdateLoading } =
    usePatchCompetitionParticipantsSportsSportIdUsersUserIdLicense();

  const updateLicense = (
    sport_id: string,
    user_id: string,
    is_license_valid: boolean,
    callback: () => void,
  ) => {
    return mutateUpdateLicense(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          sportId: sport_id,
          userId: user_id,
        },
        queryParams: {
          is_license_valid: is_license_valid,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la validation de la licence",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Licence validée",
              description: "La licence a été validée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    updateLicense,
    isUpdateLoading,
  };
};
