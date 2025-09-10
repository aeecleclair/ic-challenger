import { useGetCompetitionUsersUserIdPayments } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";

export const useUserPayments = () => {
  const { token, isTokenExpired } = useAuth();
  const { me: user } = useUser();

  const {
    data: payments,
    isLoading,
    error,
    refetch: refetchPayments,
  } = useGetCompetitionUsersUserIdPayments(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        userId: user!.id,
      },
    },
    {
      enabled: !!user?.id && !isTokenExpired(),
      retry: 0,
      queryHash: "getUserPayments",
    },
  );

  const hasPaid = payments && payments.length > 0;

  return {
    payments,
    hasPaid,
    isLoading,
    error,
    refetchPayments,
  };
};
