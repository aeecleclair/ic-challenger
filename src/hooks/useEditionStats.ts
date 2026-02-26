import { useGetCompetitionEditionsEditionIdStats } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

interface UseEditionStatsProps {
  editionId?: string;
}

export const useEditionStats = ({ editionId }: UseEditionStatsProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: stats,
    isLoading,
    refetch: refetchStats,
  } = useGetCompetitionEditionsEditionIdStats(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        editionId: editionId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!editionId,
      retry: 0,
      queryHash: "getEditionStats-" + editionId,
    },
  );

  return {
    stats,
    isLoading,
    refetchStats,
  };
};
