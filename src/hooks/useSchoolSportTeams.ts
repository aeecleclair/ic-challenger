import {
  useDeleteCompetitionTeamsTeamId,
  useGetCompetitionTeamsSportsSportIdSchoolsSchoolId,
  usePatchCompetitionTeamsTeamId,
  usePostCompetitionTeams,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { Team, TeamEdit, TeamInfo } from "../api/hyperionSchemas";

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
  } = useGetCompetitionTeamsSportsSportIdSchoolsSchoolId(
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
      queryHash: "getSchoolSportTeams-" + schoolId + "-" + sportId,
    },
  );

  const { mutate: mutateCreateSchoolSportTeam, isPending: isCreateLoading } =
    usePostCompetitionTeams();

  const createSchoolSportTeam = (
    teamData: TeamInfo,
    callback: (data: Team) => void,
  ) => {
    return mutateCreateSchoolSportTeam(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: teamData,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout de l'équipe",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchTeams();
            if (data) callback(data);
            toast({
              title: "Équipe ajoutée",
              description: "L'équipe a été ajoutée avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateSchoolSportTeam, isPending: isUpdateLoading } =
    usePatchCompetitionTeamsTeamId();

  const updateSchoolSportTeam = (
    teamId: string,
    teamData: TeamEdit,
    callback: (data: Team) => void,
  ) => {
    return mutateUpdateSchoolSportTeam(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: teamData,
        pathParams: {
          teamId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la mise à jour de l'équipe",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchTeams();
            if (data) callback(data);
            toast({
              title: "Équipe mise à jour",
              description: "L'équipe a été mise à jour avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateDeleteSchoolSportTeam, isPending: isDeleteLoading } =
    useDeleteCompetitionTeamsTeamId();

  const deleteSchoolSportTeam = (teamId: string, callback: () => void) => {
    return mutateDeleteSchoolSportTeam(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          teamId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la suppression de l'équipe",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchTeams();
            callback();
            toast({
              title: "Équipe supprimée",
              description: "L'équipe a été supprimée avec succès.",
            });
          }
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
    updateSchoolSportTeam,
    isUpdateLoading,
    deleteSchoolSportTeam,
    isDeleteLoading,
  };
};
