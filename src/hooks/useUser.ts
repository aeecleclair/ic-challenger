import { useGetUsersMe } from "@/src/api/hyperionComponents";
import { useUserStore } from "../stores/user";
import { useAuth } from "./useAuth";

const COMPETITION_ADMIN_GROUP_ID = "e9e6e3d3-9f5f-4e9b-8e5f-9f5f4e9b8e5f";
const SCHOOLS_BDS_GROUP_ID = "96f8ffb8-c585-4ca5-8360-dc3881f9f1e2";
const SPORT_MANAGER_GROUP_ID = "a3f48a0b-ada1-4fe0-b987-f4170d8896c4";
const NON_ATHLETE_GROUP_ID = "84a9972c-56b0-4024-86ec-a284058e1cb1";
const CAMERAMAN_GROUP_ID = "9cb535c7-ca19-4dbc-8b04-8b34017b5cff";
const CHEERLEADER_GROUP_ID = "22af0472-0a15-4f05-a670-fa02eda5e33f";
const FANFARON_GROUP_ID = "c69ed623-1cf5-4769-acc7-ddbc6490fb07";

export const useUser = () => {
  const { token, isTokenExpired } = useAuth();
  const { user, setUser } = useUserStore();
  const { data: me, isLoading } = useGetUsersMe(
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
    user?.groups?.some((group) => group.id === SCHOOLS_BDS_GROUP_ID) ?? false;

  const isSportManager = () =>
    user?.groups?.some((group) => group.id === SPORT_MANAGER_GROUP_ID) ?? false;

  const isNonAthlete = () =>
    user?.groups?.some((group) => group.id === NON_ATHLETE_GROUP_ID) ?? false;

  const isCameraman = () =>
    user?.groups?.some((group) => group.id === CAMERAMAN_GROUP_ID) ?? false;

  const isCheerleader = () =>
    user?.groups?.some((group) => group.id === CHEERLEADER_GROUP_ID) ?? false;

  const isFanfaron = () =>
    user?.groups?.some((group) => group.id === FANFARON_GROUP_ID) ?? false;

  return {
    me: user,
    isLoading,
    isAdmin,
    isBDS,
    isSportManager,
    isNonAthlete,
    isCameraman,
    isCheerleader,
    isFanfaron,
  };
};
