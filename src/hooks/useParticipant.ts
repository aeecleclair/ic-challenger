import {
  useGetRaidParticipantsParticipantId,
  usePostRaidParticipants,
  usePatchRaidParticipantsParticipantId,
} from "@/src/api/hyperionComponents";
import { useQueryClient } from "@tanstack/react-query";
import { ParticipantBase, ParticipantUpdate } from "../api/hyperionSchemas";
import { useParticipantStore } from "../stores/particpant";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

export const useParticipant = () => {
  const { token, userId, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();
  const queryClient = useQueryClient();
  const { participant, setParticipant } = useParticipantStore();

  const {
    data: me,
    isLoading,
    isFetched,
    refetch,
  } = useGetRaidParticipantsParticipantId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        participantId: userId!,
      },
    },
    {
      enabled:
        userId !== null &&
        participant === undefined &&
        !isAdmin() &&
        !isTokenExpired(),
      retry: 0,
      queryHash: "getParticipantById",
    },
  );

  const {
    mutate: mutateCreateParticipant,
    isSuccess: isCreationSuccess,
    isPending: isCreationLoading,
  } = usePostRaidParticipants({});

  const createParticipant = (
    participant: ParticipantBase,
    callback: () => void,
  ) => {
    mutateCreateParticipant(
      {
        body: participant,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              return (
                query.queryHash === "getParticipantById" ||
                query.queryHash === "getTeamByParticipantId"
              );
            },
          });
          callback();
        },
        onError: (error, variables, context) => {
          console.log(error);
          toast({
            title: "Erreur lors de la création du participant",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
        },
      },
    );
  };

  const {
    mutate: mutateUpdateParticipant,
    isSuccess: isUpdateSuccess,
    isPending: isUpdateLoading,
  } = usePatchRaidParticipantsParticipantId({});

  const updateParticipant = (
    participant: ParticipantUpdate,
    participantId: string,
    callback: () => void,
  ) => {
    mutateUpdateParticipant(
      {
        body: participant,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          participantId: participantId,
        },
      },
      {
        // Not using onSucess because of : https://github.com/TanStack/query/discussions/2878
        onSettled: () => {
          // Assuming success in all cases
          // For unknown reasons, the invalidation of the query does not work
          refetch();
          callback();
        },
      },
    );
  };

  if (me !== undefined && participant !== me && token !== null) {
    setParticipant(me);
  }

  return {
    me: participant,
    isLoading,
    isFetched,
    refetch,
    createParticipant,
    isCreationSuccess,
    isCreationLoading,
    updateParticipant,
    isUpdateSuccess,
    isUpdateLoading,
  };
};
