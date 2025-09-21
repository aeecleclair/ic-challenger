import {
  useGetCompetitionProducts,
  usePostCompetitionProducts,
  usePatchCompetitionProductsProductId,
  useDeleteCompetitionProductsProductId,
  usePostCompetitionProductsProductIdVariants,
  usePatchCompetitionProductsVariantsVariantId,
  useDeleteCompetitionProductsVariantsVariantId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import {
  AppModulesSportCompetitionSchemasSportCompetitionProductBase,
  AppModulesSportCompetitionSchemasSportCompetitionProductEdit,
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantBase,
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantEdit,
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
      enabled: !isTokenExpired(),
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
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du produit",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchProducts();
            callback();
            toast({
              title: "Produit ajoutée",
              description: "Le produit a été ajouté avec succès.",
            });
          }
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
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du produit",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchProducts();
            callback();
            toast({
              title: "Produit modifiée",
              description: "Le produit a été modifiée avec succès.",
            });
          }
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
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression du product",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchProducts();
            callback();
            toast({
              title: "Product supprimée",
              description: "Le product a été supprimée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateCreateVariant, isPending: isCreateVariantLoading } =
    usePostCompetitionProductsProductIdVariants();

  const createVariant = (
    productId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionProductVariantBase,
    callback: () => void,
  ) => {
    return mutateCreateVariant(
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
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout de la variante",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchProducts();
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

  const { mutate: mutateUpdateVariant, isPending: isUpdateVariantLoading } =
    usePatchCompetitionProductsVariantsVariantId();

  const updateVariant = (
    variantId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionProductVariantEdit,
    callback: () => void,
  ) => {
    return mutateUpdateVariant(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          variantId: variantId,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification de la variante",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchProducts();
            callback();
            toast({
              title: "Variante modifiée",
              description: "La variante a été modifiée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteVariant, isPending: isDeleteVariantLoading } =
    useDeleteCompetitionProductsVariantsVariantId();

  const deleteVariant = (
    productId: string,
    variantId: string,
    callback: () => void,
  ) => {
    return mutateDeleteVariant(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        queryParams: {
          product_id: productId,
        },
        pathParams: {
          variantId: variantId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression de la variante",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchProducts();
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
    products,
    error,
    refetchProducts,
    isCreateLoading,
    createProduct,
    isUpdateLoading,
    updateProduct,
    isDeleteLoading,
    deleteProduct,
    isCreateVariantLoading,
    createVariant,
    isUpdateVariantLoading,
    updateVariant,
    isDeleteVariantLoading,
    deleteVariant,
  };
};
