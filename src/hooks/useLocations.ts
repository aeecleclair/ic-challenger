import {
  useGetCompetitionLocations,
  usePostCompetitionLocations,
  usePatchCompetitionLocationsLocationId,
  useDeleteCompetitionLocationsLocationId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { LocationBase, LocationEdit } from "../api/hyperionSchemas";

export const useLocations = () => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: locations,
    isLoading,
    refetch: refetchLocations,
    error,
  } = useGetCompetitionLocations(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getLocations",
    },
  );

  const { mutate: mutateCreateLocation, isPending: isCreateLoading } =
    usePostCompetitionLocations();

  const createLocation = (body: LocationBase, callback: () => void) => {
    return mutateCreateLocation(
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
              title: "Erreur lors de l'ajout du lieu",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchLocations();
            callback();
            toast({
              title: "Lieu ajouté",
              description: "Le lieu a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateLocation, isPending: isUpdateLoading } =
    usePatchCompetitionLocationsLocationId();

  const updateLocation = (
    locationId: string,
    body: LocationEdit,
    callback: () => void,
  ) => {
    return mutateUpdateLocation(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
        pathParams: {
          locationId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du lieu",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchLocations();
            callback();
            toast({
              title: "Lieu modifié",
              description: "Le lieu a été modifié avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteLocation, isPending: isDeleteLoading } =
    useDeleteCompetitionLocationsLocationId();

  const deleteLocation = (locationId: string, callback: () => void) => {
    return mutateDeleteLocation(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          locationId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du lieu",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchLocations();
            callback();
            toast({
              title: "Lieu supprimé",
              description: "Le lieu a été supprimé avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    locations,
    createLocation,
    updateLocation,
    deleteLocation,
    error,
    isLoading,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    refetchLocations,
  };
};
