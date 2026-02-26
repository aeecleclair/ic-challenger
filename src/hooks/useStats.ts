import {
  useGetCompetitionEditionsEditionIdStats,
  useGetUsersSearch,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { useEdition } from "./useEdition";

export const useStats = () => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();
  const { edition } = useEdition();
  const {
    data: stats,
    refetch: refetchStats,
    error,
    isLoading,
  } = useGetCompetitionEditionsEditionIdStats(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        editionId: edition?.id || "",
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired(),
      retry: 0,
      refetchOnWindowFocus: false,
    },
  );

  return {
    stats,
    error,
    isLoading,
    refetchStats,
  };
};
