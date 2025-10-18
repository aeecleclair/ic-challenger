import { useGetCompetitionTeams } from "../api/hyperionComponents";
import { useAuth } from "./useAuth";

export const useAllTeams = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: allTeams,
    refetch: refetchAllTeams,
    isLoading,
    error,
  } = useGetCompetitionTeams(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getSportMatches",
    },
  );

  return {
    allTeams,
    refetchAllTeams,
    isLoading,
    error,
  };
};
