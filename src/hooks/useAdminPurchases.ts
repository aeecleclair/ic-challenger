import {
  usePostCompetitionPurchasesUsersUserId,
  usePatchCompetitionPurchasesUsersUserIdVariantsVariantId,
  useDeleteCompetitionUsersUserIdPurchasesProductVariantId,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import {
  AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
  PurchaseEdit,
} from "../api/hyperionSchemas";

export const useAdminPurchases = () => {
  const { token } = useAuth();

  const { mutate: mutateCreatePurchase, isPending: isCreatePurchaseLoading } =
    usePostCompetitionPurchasesUsersUserId();

  const createPurchase = (
    userId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
    callback: () => void,
  ) => {
    return mutateCreatePurchase(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId,
        },
        body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout de l'achat",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Achat ajouté",
              description: "L'achat a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateEditPurchase, isPending: isEditPurchaseLoading } =
    usePatchCompetitionPurchasesUsersUserIdVariantsVariantId();

  const editPurchase = (
    userId: string,
    variantId: string,
    body: PurchaseEdit,
    callback: () => void,
  ) => {
    return mutateEditPurchase(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId,
          variantId,
        },
        body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification de l'achat",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Achat modifié",
              description: "L'achat a été modifié avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeletePurchase, isPending: isDeletePurchaseLoading } =
    useDeleteCompetitionUsersUserIdPurchasesProductVariantId();

  const deletePurchase = (
    userId: string,
    productVariantId: string,
    callback: () => void,
  ) => {
    return mutateDeletePurchase(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId,
          productVariantId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression de l'achat",
              description:
                (error as unknown as ErrorType)?.stack?.body ||
                (error as unknown as DetailedErrorType)?.stack?.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "Achat supprimé",
              description: "L'achat a été supprimé avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    createPurchase,
    isCreatePurchaseLoading,
    editPurchase,
    isEditPurchaseLoading,
    deletePurchase,
    isDeletePurchaseLoading,
  };
};
