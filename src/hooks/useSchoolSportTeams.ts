import {
  useGetCompetitionTeamsSchoolsSchoolIdSportsSportId,
  usePostCompetitionTeams,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType } from "../utils/errorTyping";
import { Team, TeamInfo } from "../api/hyperionSchemas";

interface UseSchoolSportTeamsProps {
  schoolId?: string;
  sportId?: string;
}

export const useSchoolSportTeams = ({
  schoolId,
  sportId,
}: UseSchoolSportTeamsProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: teams,
    isLoading,
    refetch: refetchTeams,
  } = useGetCompetitionTeamsSchoolsSchoolIdSportsSportId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        schoolId: schoolId!,
        sportId: sportId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!schoolId && !!sportId,
      retry: 0,
      queryHash: "getSchoolSportTeams",
    },
  );

  const { mutate: mutateCreateSchoolSportTeam, isPending: isCreateLoading } =
    usePostCompetitionTeams();

  const createSchoolSportTeam = (teamData: TeamInfo, callback: (data: Team) => void) => {
    return mutateCreateSchoolSportTeam(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: teamData,
      },
      {
        onSuccess: (data) => {
          refetchTeams();
          toast({
            title: "Équipe ajoutée",
            description: "L'équipe a été ajoutée avec succès.",
          });
          callback(data);
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Erreur lors de l'ajout de l'équipe",
            description: (error as unknown as ErrorType).stack.detail,
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    teams,
    isLoading,
    refetchTeams,
    createSchoolSportTeam,
    isCreateLoading,
  };
};
