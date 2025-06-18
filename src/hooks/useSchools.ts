import { useGetSchools } from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";

export const useSchools = () => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: schools,
    isLoading,
    refetch: refetchSchools,
    error,
  } = useGetSchools(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired(),
      retry: 0,
      queryHash: "getSchools",
    },
  );

  return {
    schools,
    error,
    isLoading,
    refetchSchools,
  };
};
