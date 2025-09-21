import { useGetCompetitionParticipantsSchoolsSchoolId } from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";

interface UseSchoolParticipants {
  schoolId: string | null;
}

export const useSchoolParticipants = ({ schoolId }: UseSchoolParticipants) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: schoolParticipants,
    refetch: refetchParticipantSchools,
    error,
  } = useGetCompetitionParticipantsSchoolsSchoolId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        schoolId: schoolId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!schoolId,
      retry: 0,
      queryHash: "getSchoolParticipants",
    },
  );

  return {
    schoolParticipants,
    error,
    refetchParticipantSchools,
  };
};
