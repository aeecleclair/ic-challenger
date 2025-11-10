import {
  useGetCompetitionEditions,
  useGetCompetitionEditionsActive,
  usePostCompetitionEditions,
  usePatchCompetitionEditionsEditionId,
  usePostCompetitionEditionsEditionIdActivate,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import type * as Schemas from "@/src/api/hyperionSchemas";

export const useEditions = () => {
  const { token, isTokenExpired } = useAuth();

  // Get all editions
  const {
    data: editions,
    isLoading: editionsLoading,
    refetch: refetchEditions,
    error: editionsError,
  } = useGetCompetitionEditions(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getEditions",
    },
  );

  // Get active edition
  const {
    data: activeEdition,
    isLoading: activeLoading,
    refetch: refetchActiveEdition,
    error: activeEditionError,
  } = useGetCompetitionEditionsActive(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getActiveEdition",
    },
  );

  // Create edition mutation
  const { mutate: mutateCreateEdition, isPending: isCreateLoading } =
    usePostCompetitionEditions();

  const createEdition = (
    body: Schemas.CompetitionEditionBase,
    callback: () => void,
  ) => {
    return mutateCreateEdition(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la création de l'édition",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchEditions();
            refetchActiveEdition();
            callback();
            toast({
              title: "Édition créée",
              description: "L'édition a été créée avec succès.",
            });
          }
        },
      },
    );
  };

  // Update edition mutation
  const { mutate: mutateUpdateEdition, isPending: isUpdateLoading } =
    usePatchCompetitionEditionsEditionId();

  const updateEdition = (
    editionId: string,
    body: Schemas.CompetitionEditionEdit,
    callback: () => void,
  ) => {
    return mutateUpdateEdition(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
        pathParams: { editionId },
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification de l'édition",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchEditions();
            refetchActiveEdition();
            callback();
            toast({
              title: "Édition modifiée",
              description: "L'édition a été modifiée avec succès.",
            });
          }
        },
      },
    );
  };

  // Activate edition mutation
  const { mutate: mutateActivateEdition, isPending: isActivateLoading } =
    usePostCompetitionEditionsEditionIdActivate();

  const activateEdition = (editionId: string, callback: () => void) => {
    return mutateActivateEdition(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: { editionId },
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'activation de l'édition",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchEditions();
            refetchActiveEdition();
            callback();
            toast({
              title: "Édition activée",
              description: "L'édition a été activée avec succès.",
            });
          }
        },
      },
    );
  };

  // Helper functions
  const getEditionStatus = (edition: Schemas.CompetitionEdition) => {
    const now = new Date();
    const startDate = new Date(edition.start_date);
    const endDate = new Date(edition.end_date);

    if (edition.active) {
      if (now < startDate)
        return { status: "À venir", variant: "secondary" as const };
      if (now > endDate)
        return { status: "Terminée", variant: "destructive" as const };
      return { status: "En cours", variant: "default" as const };
    }
    return { status: "Inactive", variant: "outline" as const };
  };

  const isLoading = editionsLoading || activeLoading;
  const error = editionsError || activeEditionError;

  return {
    // Data
    editions,
    activeEdition,

    // Loading states
    isLoading,
    editionsLoading,
    activeLoading,
    isCreateLoading,
    isUpdateLoading,
    isActivateLoading,

    // Errors
    error,
    editionsError,
    activeEditionError,

    // Actions
    createEdition,
    updateEdition,
    activateEdition,
    refetchEditions,
    refetchActiveEdition,

    // Helpers
    getEditionStatus,
  };
};
