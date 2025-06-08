import { useGetRaidTeams } from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";

export const useTeams = () => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: teams,
    isLoading,
    refetch: refetchTeams,
  } = useGetRaidTeams(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired(),
      retry: 0,
      queryHash: "getTeams",
    },
  );

  return {
    teams,
    isLoading,
    refetchTeams,
  };
};
