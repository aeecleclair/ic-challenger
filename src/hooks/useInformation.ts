import {
  useGetRaidInformation,
  usePatchRaidInformation,
} from "@/src/api/hyperionComponents";
import { RaidInformation } from "../api/hyperionSchemas";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

export const useInformation = () => {
  const { token, userId } = useAuth();

  const {
    data: information,
    isLoading,
    refetch: refetchInformation,
  } = useGetRaidInformation(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: userId !== null,
      retry: 0,
      queryHash: "getRaidInformation",
    },
  );

  const { mutate: mutateUpdateInformation, isPending: isUpdateLoading } =
    usePatchRaidInformation({});

  const updateInformation = (
    information: RaidInformation,
    callback: () => void,
  ) => {
    mutateUpdateInformation(
      {
        body: information,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        // Not using onSucess because of : https://github.com/TanStack/query/discussions/2878
        onSettled: () => {
          // Assuming success in all cases
          // For unknown reasons, the invalidation of the query does not work
          refetchInformation();
          callback();
        },
      },
    );
  };

  return {
    information,
    isLoading,
    refetchInformation,
    updateInformation,
    isUpdateLoading,
  };
};
