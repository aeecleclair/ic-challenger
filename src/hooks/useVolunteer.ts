import { useAuth } from "./useAuth";
import { useGetCompetitionVolunteersMe } from "../api/hyperionComponents";

export const useVolunteer = () => {
  const { token, isTokenExpired } = useAuth();
  const {
    data: volunteer,
    isLoading,
    refetch: refetchVolunteer,
  } = useGetCompetitionVolunteersMe(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
    },
  );

  return {
    volunteer,
    isLoading,
    refetchVolunteer,
  };
};
