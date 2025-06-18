import { useGetCompetitionEditionsActive } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

export const useEdition = () => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: edition,
    isLoading,
    refetch: refetchEdition,
    error,
  } = useGetCompetitionEditionsActive(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getEdition",
    },
  );

  return {
    edition,
    error,
    isLoading,
    refetchEdition,
  };
};
