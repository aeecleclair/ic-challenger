import { useAuth } from "./useAuth";
import {
  useGetCompetitionVolunteersMe,
  usePostCompetitionVolunteersShiftsShiftIdRegister,
} from "../api/hyperionComponents";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType } from "../utils/errorTyping";

export const useVolunteer = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: volunteer,
    isLoading,
    refetch: refetchVolunteer,
  } = useGetCompetitionVolunteersMe(
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

  const { mutate: mutateRegisterVolunteerShift, isPending: isRegisterLoading } =
    usePostCompetitionVolunteersShiftsShiftIdRegister();

  const registerVolunteerShift = (shiftId: string, callback: () => void) => {
    return mutateRegisterVolunteerShift(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          shiftId: shiftId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'assignation du bénévole",
              description:
                (error as any).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Bénévole assigné",
              description: "Le bénévole a été assigné avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    volunteer,
    isLoading,
    refetchVolunteer,
    registerVolunteerShift,
    isRegisterLoading,
  };
};
