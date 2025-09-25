import { useGetUsersSearch } from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";

interface UseUserSearchProps {
  query: string;
}

export const useUserSearch = ({ query }: UseUserSearchProps) => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: userSearch,
    refetch: refetchSchools,
    error,
  } = useGetUsersSearch(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      queryParams: {
        query: query,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired() && query.length > 0,
      retry: 0,
      queryHash: "getUserSearch",
    },
  );

  return {
    userSearch,
    error,
    refetchSchools,
  };
};
