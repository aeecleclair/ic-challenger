import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../components/ui/use-toast";
import {
  useGetCompetitionProductsProductIdSchoolsQuotas,
  usePostCompetitionSchoolsSchoolIdProductQuotas,
  usePatchCompetitionSchoolsSchoolIdProductQuotasProductId,
  useDeleteCompetitionSchoolsSchoolIdProductQuotasProductId,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

interface UseProductsQuotaProps {
  productId: string;
}

export const useProductsQuota = ({ productId }: UseProductsQuotaProps) => {
  const { token, isTokenExpired } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: productsQuota,
    isLoading,
    error,
  } = useGetCompetitionProductsProductIdSchoolsQuotas(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        productId: productId,
      },
    },
    {
      enabled: !isTokenExpired() && !!productId,
      retry: 0,
      queryHash: "getProductsQuota",
    },
  );

  const createQuotaMutation = usePostCompetitionSchoolsSchoolIdProductQuotas();
  const updateQuotaMutation =
    usePatchCompetitionSchoolsSchoolIdProductQuotasProductId();
  const deleteQuotaMutation =
    useDeleteCompetitionSchoolsSchoolIdProductQuotasProductId();

  const createQuota = (
    schoolId: string,
    quota: number,
    onSuccess?: () => void,
  ) => {
    if (isTokenExpired()) return;

    createQuotaMutation.mutate(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: { schoolId: schoolId },
        body: {
          product_id: productId,
          quota,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/competition/products/{product_id}/schools_quotas",
            ],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/competition/schools/{school_id}/product_quotas",
            ],
          });
          toast({ description: "Quota créé avec succès" });
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error("Erreur lors de la création du quota:", error);
          toast({
            description: "Erreur lors de la création du quota",
            variant: "destructive",
          });
        },
      },
    );
  };

  const createQuotaForAllSchools = (
    schoolIds: string[],
    quota: number,
    onSuccess?: () => void,
  ) => {
    if (isTokenExpired()) return;

    const promises = schoolIds.map((schoolId) =>
      createQuotaMutation.mutateAsync({
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: { schoolId: schoolId },
        body: {
          product_id: productId,
          quota,
        },
      }),
    );

    Promise.allSettled(promises)
      .then((results) => {
        const successCount = results.filter(
          (result) => result.status === "fulfilled",
        ).length;
        const failureCount = results.filter(
          (result) => result.status === "rejected",
        ).length;

        queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/competition/products/{product_id}/schools_quotas",
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/competition/schools/{school_id}/product_quotas"],
        });

        if (successCount > 0) {
          toast({
            description: `${successCount} quota(s) créé(s) avec succès${
              failureCount > 0 ? `, ${failureCount} échec(s)` : ""
            }`,
          });
        }
        if (failureCount > 0 && successCount === 0) {
          toast({
            description: "Erreur lors de la création des quotas",
            variant: "destructive",
          });
        }

        onSuccess?.();
      })
      .catch((error: any) => {
        console.error("Erreur lors de la création des quotas:", error);
        toast({
          description: "Erreur lors de la création des quotas",
          variant: "destructive",
        });
      });
  };

  const updateQuota = (
    schoolId: string,
    quota: number,
    onSuccess?: () => void,
  ) => {
    if (isTokenExpired()) return;

    updateQuotaMutation.mutate(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: { schoolId: schoolId, productId: productId },
        body: { quota },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/competition/products/{product_id}/schools_quotas",
            ],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/competition/schools/{school_id}/product_quotas",
            ],
          });
          toast({ description: "Quota mis à jour avec succès" });
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error("Erreur lors de la mise à jour du quota:", error);
          toast({
            description: "Erreur lors de la mise à jour du quota",
            variant: "destructive",
          });
        },
      },
    );
  };

  const deleteQuota = (schoolId: string, onSuccess?: () => void) => {
    if (isTokenExpired()) return;

    deleteQuotaMutation.mutate(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: { schoolId: schoolId, productId: productId },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/competition/products/{product_id}/schools_quotas",
            ],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/competition/schools/{school_id}/product_quotas",
            ],
          });
          toast({ description: "Quota supprimé avec succès" });
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error("Erreur lors de la suppression du quota:", error);
          toast({
            description: "Erreur lors de la suppression du quota",
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    productsQuota,
    isLoading,
    error,
    isCreateLoading: createQuotaMutation.isPending,
    createQuota,
    createQuotaForAllSchools,
    isUpdateLoading: updateQuotaMutation.isPending,
    updateQuota,
    isDeleteLoading: deleteQuotaMutation.isPending,
    deleteQuota,
  };
};
