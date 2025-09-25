import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "../utils/errorTyping";
import {
  useDeleteCompetitionVolunteersShiftsShiftId,
  useGetCompetitionVolunteersShifts,
  usePatchCompetitionVolunteersShiftsShiftId,
  usePostCompetitionVolunteersShifts,
  usePostCompetitionVolunteersShiftsShiftIdRegister,
} from "../api/hyperionComponents";
import { VolunteerShiftBase } from "../api/hyperionSchemas";

export const useVolunteerShifts = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: volunteerShifts,
    isLoading,
    refetch: refetchVolunteerShifts,
  } = useGetCompetitionVolunteersShifts(
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

  const { mutate: mutateCreateVolunteerShift, isPending: isCreateLoading } =
    usePostCompetitionVolunteersShifts();

  const createVolunteerShift = (
    body: VolunteerShiftBase,
    callback: () => void,
  ) => {
    return mutateCreateVolunteerShift(
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
              title: "Erreur lors de l'assignation du bénévole",
              description:
                (error as any).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchVolunteerShifts();
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
            refetchVolunteerShifts();
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

  const { mutate: mutateUpdateVolunteerShift, isPending: isUpdateLoading } =
    usePatchCompetitionVolunteersShiftsShiftId();

  const updateVolunteerShift = (shiftId: string, callback: () => void) => {
    return mutateUpdateVolunteerShift(
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
              title: "Erreur lors de la mise à jour",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchVolunteerShifts();
            callback();
            toast({
              title: "Bénévole mis à jour",
              description: "Le bénévole a été mis à jour avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteVolunteerShift, isPending: isDeleteLoading } =
    useDeleteCompetitionVolunteersShiftsShiftId();

  const deleteVolunteerShift = (shiftId: string, callback: () => void) => {
    return mutateDeleteVolunteerShift(
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
              title: "Erreur lors de la suppression",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchVolunteerShifts();
            callback();
            toast({
              title: "Bénévole supprimé",
              description: "Le bénévole a été supprimé avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    volunteerShifts,
    isLoading,
    refetchVolunteerShifts,
    createVolunteerShift,
    isCreateLoading,
    registerVolunteerShift,
    isRegisterLoading,
    updateVolunteerShift,
    isUpdateLoading,
    deleteVolunteerShift,
    isDeleteLoading,
  };
};
