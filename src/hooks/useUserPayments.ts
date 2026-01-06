import {
  useGetCompetitionUsersUserIdPayments,
  usePostCompetitionUsersUserIdPayments,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";
import { AppModulesSportCompetitionSchemasSportCompetitionPaymentBase } from "../api/hyperionSchemas";

export const useUserPayments = () => {
  const { token, isTokenExpired, userId } = useAuth();

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
        userId: userId!,
      },
    },
    {
      enabled: !!userId && !isTokenExpired(),
      retry: 0,
      queryHash: "getUserPayments",
    },
  );

  const hasPaid = payments && payments.length > 0;

  const { mutateAsync: postPayment, isPending: isPostingPayment } =
    usePostCompetitionUsersUserIdPayments();

  const makePayment = async (
    userId: string,
    body: AppModulesSportCompetitionSchemasSportCompetitionPaymentBase,
  ) => {
    await postPayment({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        userId: userId,
      },
      body: body,
    });
    await refetchPayments();
  };

  return {
    payments,
    hasPaid,
    isLoading,
    error,
    refetchPayments,
    makePayment,
    isPostingPayment,
  };
};
