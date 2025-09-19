import {
  useGetCompetitionUsersMeGroups,
  useGetUsersMe,
  usePatchUsersMe,
} from "@/src/api/hyperionComponents";
import { useUserStore } from "../stores/user";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import {
  ErrorType,
  DetailedErrorType,
  APIErrorType,
} from "../utils/errorTyping";

const COMPETITION_ADMIN_GROUP_ID = "2b1fc736-1288-4043-b293-14bc23adae68";
const SPORT_MANAGER = "sport_manager";
const SCHOOLS_BDS = "schools_bds";
export const useUser = () => {
  const { token, isTokenExpired } = useAuth();
  const { user, setUser } = useUserStore();
  const {
    data: me,
    isLoading,
    refetch: refetchMe,
  } = useGetUsersMe(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: user === undefined && !isTokenExpired(),
      retry: 0,
    },
  );
  const { data: myCompetitionGroups } = useGetCompetitionUsersMeGroups(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: user === undefined && !isTokenExpired(),
      retry: 0,
    },
  );

  if (me !== undefined && user === undefined && token !== null) {
    setUser(me);
  }

  const isAdmin = () =>
    user?.groups?.some((group) => group.id === COMPETITION_ADMIN_GROUP_ID) ??
    false;

  const isBDS = () =>
    myCompetitionGroups?.some((group) => group.group === SCHOOLS_BDS) ?? false;

  const isSportManager = () =>
    myCompetitionGroups?.some((group) => group.group === SPORT_MANAGER) ??
    false;

  const {
    mutate: mutateUpdateUser,

    isPending: isUpdateLoading,
  } = usePatchUsersMe();

  const updateUser = async (body: any, callback: () => void) => {
    return mutateUpdateUser(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour de l'utilisateur",
              description:
                (error as unknown as APIErrorType).stack.detail[0].msg ||
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchMe();
            callback();
            toast({
              title: "Utilisateur mis à jour",
              description:
                "Les informations de l'utilisateur ont été mises à jour avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    me: user,
    isLoading,
    isAdmin,
    isBDS,
    isSportManager,
    updateUser,
    isUpdateLoading,
  };
};
