import {
  useDeleteCompetitionGroupsGroupUsersUserId,
  useGetCompetitionGroupsGroup,
  usePostCompetitionGroupsGroupUsersUserId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
import { CompetitionGroupType } from "../api/hyperionSchemas";

interface UseGroupsProps {
  group?: CompetitionGroupType;
}

export const useGroups = ({ group }: UseGroupsProps) => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();

  const {
    data: groups,
    refetch: refetchGroups,
    error,
  } = useGetCompetitionGroupsGroup(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        group: group!,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired() && !!group,
      retry: 0,
      queryHash: "getGroups",
    },
  );

  const { mutate: mutateCreateGroup, isPending: isCreateLoading } =
    usePostCompetitionGroupsGroupUsersUserId();

  const createGroup = (userId: string, callback: () => void) => {
    return mutateCreateGroup(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          group: group!,
          userId: userId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout du groupe",
              description: (error as unknown as ErrorType).stack.body,
              variant: "destructive",
            });
          } else {
            refetchGroups();
            callback();
            toast({
              title: "Groupe ajoutée",
              description: "Le groupe a été ajoutée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteGroup, isPending: isDeleteLoading } =
    useDeleteCompetitionGroupsGroupUsersUserId();

  const deleteGroup = (userId: string, callback: () => void) => {
    return mutateDeleteGroup(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId: userId,
          group: group!,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification du group",
              description: (error as unknown as ErrorType).stack.body,
              variant: "destructive",
            });
          } else {
            refetchGroups();
            callback();
            toast({
              title: "Group modifiée",
              description: "Le group a été modifiée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    groups,
    createGroup,
    error,
    isCreateLoading,
    isDeleteLoading,
    deleteGroup,
    refetchGroups,
  };
};
