import { useGetCompetitionSportsSportIdQuotas } from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";

interface UseSportQuotaProps {
  sportId?: string;
}

export const useSportQuota = ({ sportId }: UseSportQuotaProps) => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: sportQuota,
    refetch: refetchSportQuota,
    error,
  } = useGetCompetitionSportsSportIdQuotas(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        sportId: sportId!,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired() && !!sportId,
      retry: 0,
      queryHash: "getSportQuota",
    },
  );

  return {
    sportQuota,
    error,
    refetchSportQuota,
  };
};
