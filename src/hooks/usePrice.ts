import { useGetRaidPrice, usePatchRaidPrice } from "../api/hyperionComponents";
import { RaidPrice } from "../api/hyperionSchemas";
import { toast } from "../components/ui/use-toast";
import { useAuth } from "./useAuth";

export const usePrice = () => {
  const { token, userId } = useAuth();

  const {
    data: price,
    isLoading,
    refetch: refetchPrice,
  } = useGetRaidPrice(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: userId !== null,
      retry: 0,
      queryHash: "getRaidPrice",
    },
  );

  const { mutate: mutateUpdatePrice, isPending: isUpdateLoading } =
    usePatchRaidPrice({});

  const updatePrice = (price: RaidPrice, callback: () => void) => {
    mutateUpdatePrice(
      {
        body: price,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        // Not using onSucess because of : https://github.com/TanStack/query/discussions/2878
        onSettled: () => {
          refetchPrice();
          callback();
        },
      },
    );
  };

  return {
    price,
    isLoading,
    refetchPrice,
    updatePrice,
    isUpdateLoading,
  };
};
