import { useGetCompetitionTeamsSportsSportIdSchoolsSchoolId } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

interface UseTeamsProps {
  sportId?: string;
  schoolId?: string;
}

export const useTeams = ({ sportId, schoolId }: UseTeamsProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: teams,
    isLoading,
    refetch: refetchTeams,
    error,
  } = useGetCompetitionTeamsSportsSportIdSchoolsSchoolId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        sportId: sportId!,
        schoolId: schoolId!,
      },
    },
    {
      enabled: !!sportId && !!schoolId && !isTokenExpired(),
      retry: 0,
      queryHash: `getTeams-${sportId}-${schoolId}`,
    },
  );

  return {
    teams,
    isLoading,
    error,
    refetchTeams,
  };
};
