import { useGetCompetitionProductsAvailable } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

export const useAvailableProducts = () => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: availableProducts,
    refetch: refetchAvailableProducts,
    error,
  } = useGetCompetitionProductsAvailable(
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

  return {
    availableProducts,
    error,
    refetchAvailableProducts,
  };
};
