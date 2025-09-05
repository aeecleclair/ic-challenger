import {
  useDeleteCompetitionPurchasesProductVariantId,
  useGetCompetitionPurchasesUsersUserId,
  usePostCompetitionPurchasesMe,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase } from "../api/hyperionSchemas";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";

interface UseUserPurchasesProps {
  userId?: string;
}

export const useUserPurchases = ({ userId }: UseUserPurchasesProps) => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: userPurchases,
    refetch: refetchUserPurchases,
    error,
  } = useGetCompetitionPurchasesUsersUserId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        userId: userId ?? "",
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired() && !!userId,
      retry: 0,
      queryHash: "getUserPurchases",
    },
  );

  const { mutate: mutateCreatePurchase, isPending: isCreatePurchaseLoading } =
    usePostCompetitionPurchasesMe();

  const createPurchase = (
    body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
    callback: () => void,
  ) => {
    return mutateCreatePurchase(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout de la variante",
              description: (error as unknown as ErrorType).stack.body,
              variant: "destructive",
            });
          } else {
            refetchUserPurchases();
            callback();
            toast({
              title: "Variante ajoutée",
              description: "La variante a été ajoutée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeletePurchase, isPending: isDeletePurchaseLoading } =
    useDeleteCompetitionPurchasesProductVariantId();

  const deletePurchase = (
    productVariantId: string,
    callback: () => void,
  ) => {
    return mutateDeletePurchase(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          productVariantId: productVariantId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression de la variante",
              description: (error as unknown as ErrorType).stack.body,
              variant: "destructive",
            });
          } else {
            refetchUserPurchases();
            callback();
            toast({
              title: "Variante supprimée",
              description: "La variante a été supprimée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    userPurchases,
    error,
    refetchUserPurchases,
    createPurchase,
    isCreatePurchaseLoading,
    deletePurchase,
    isDeletePurchaseLoading,
  };
};
