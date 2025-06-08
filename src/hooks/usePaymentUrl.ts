import { useGetRaidPay } from "../api/hyperionComponents";
import { useAuth } from "./useAuth";

export const usePaymentUrl = () => {
  const { token } = useAuth();

  const {
    data: paymentUrl,
    isLoading,
    refetch: refetchUrl,
  } = useGetRaidPay(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: false,
      retry: 0,
      queryHash: "getRaidUrl",
    },
  );

  return { paymentUrl, isLoading, refetchUrl };
};
