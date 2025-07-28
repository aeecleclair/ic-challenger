import {
  useGetCompetitionProducts,
  usePostCompetitionProducts,
  usePatchCompetitionProductsProductId,
  useDeleteCompetitionProductsProductId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
import {
  AppModulesSportCompetitionSchemasSportCompetitionProductBase,
  AppModulesSportCompetitionSchemasSportCompetitionProductEdit,
} from "../api/hyperionSchemas";

export const useProducts = () => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: products,
    refetch: refetchProducts,
    error,
  } = useGetCompetitionProducts(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired(),
      retry: 0,
      queryHash: "getProducts",
    },
  );

  const { mutate: mutateCreateProduct, isPending: isCreateLoading } =
    usePostCompetitionProducts();

  const createProduct = (
    body: AppModulesSportCompetitionSchemasSportCompetitionProductBase,
    callback: () => void,
  ) => {
    return mutateCreateProduct(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSuccess: () => {
          refetchProducts();
          toast({
            title: "Produit ajoutée",
            description: "Le produit a été ajouté avec succès.",
          });
          callback();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de l'ajout du produit",
            description: (error as unknown as ErrorType).stack.detail,
            variant: "destructive",
          });
        },
      },
    );
  };

  const { mutate: mutateUpdateProduct, isPending: isUpdateLoading } =
    usePatchCompetitionProductsProductId();

  const updateProduct = (
    productId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionProductEdit,
    callback: () => void,
  ) => {
    return mutateUpdateProduct(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          productId: productId,
        },
        body: body,
      },
      {
        onSuccess: () => {
          refetchProducts();
          toast({
            title: "Produit modifiée",
            description: "Le produit a été modifiée avec succès.",
          });
          callback();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de la modification du produit",
            description: (error as unknown as ErrorType).stack.detail,
            variant: "destructive",
          });
        },
      },
    );
  };

  const { mutate: mutateDeleteProduct, isPending: isDeleteLoading } =
    useDeleteCompetitionProductsProductId();

  const deleteProduct = (productId: string, callback: () => void) => {
    return mutateDeleteProduct(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          productId: productId,
        },
      },
      {
        onSuccess: () => {
          refetchProducts();
          toast({
            title: "Product supprimée",
            description: "Le product a été supprimée avec succès.",
          });
          callback();
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de la suppression du product",
            description: (error as unknown as ErrorType).stack.detail,
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    products,
    error,
    refetchProducts,
    isCreateLoading,
    createProduct,
    isUpdateLoading,
    updateProduct,
    isDeleteLoading,
    deleteProduct,
  };
};
