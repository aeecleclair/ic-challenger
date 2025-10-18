import { useQueries } from "@tanstack/react-query";
import { fetchGetCompetitionPodiumsSportSportId } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";

interface useSportPodiumsProps {
  sportIds: string[];
}

export const useSportPodiums = ({ sportIds }: useSportPodiumsProps) => {
  const { token, isTokenExpired } = useAuth();

  const queries = useQueries({
    queries: sportIds.map((sportId) => ({
      queryKey: ["sport-podium", sportId],
      queryFn: () =>
        fetchGetCompetitionPodiumsSportSportId({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          pathParams: {
            sportId,
          },
        }),
      enabled: !isTokenExpired(),
      retry: 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  const podiumsBySport = sportIds.reduce(
    (acc, sportId, index) => {
      const query = queries[index];
      if (query.data) {
        acc[sportId] = query.data;
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.error);

  return {
    podiumsBySport,
    isLoading,
    hasError,
  };
};
