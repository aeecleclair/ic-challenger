import { useGetCompetitionMatches } from "../api/hyperionComponents";
import { useAuth } from "./useAuth";

export const useAllMatches = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: allMatches,
    refetch: refetchAllMatches,
    isLoading,
    error,
  } = useGetCompetitionMatches(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: false,
      queryHash: "getSportMatches",
    },
  );

  return {
    allMatches,
    refetchAllMatches,
    isLoading,
    error,
  };
};
