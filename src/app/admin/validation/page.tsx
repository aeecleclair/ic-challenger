"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useCallback, useMemo } from "react";
import {
  ParticipantDataTable,
  ParticipantData,
} from "@/src/components/admin/validation/ParticipantDataTable";
import { useSports } from "@/src/hooks/useSports";
import { useSportsQuota } from "@/src/hooks/useSportsQuota";
import { useUser } from "@/src/hooks/useUser";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Trophy } from "lucide-react";
import { GlobalQuotaCard } from "@/src/components/admin/validation/GlobalQuotaCard";
import { SportQuotaCard } from "@/src/components/admin/validation/SportQuotaCard";

const Dashboard = () => {
  const router = useRouter();
  const { sportSchools } = useSportSchools();
  const { sports } = useSports();
  const { me: currentUser, isAdmin } = useUser();

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");

  const userSchoolId = currentUser?.school_id;
  const canAccessSchool = isAdmin() || schoolId === userSchoolId;

  const effectiveSchoolId = schoolId || userSchoolId;

  const {
    schoolParticipants,
    validateParticipants,
    error,
    isValidateLoading,
    refetchSchools,
  } = useSchoolParticipants({
    schoolId: effectiveSchoolId || null,
  });

  const { sportsQuota } = useSportsQuota({ sportId: undefined });

  const onValidate = useCallback(
    (userId: string, sportId: string) => {
      validateParticipants(userId, () => {});
    },
    [validateParticipants],
  );

  const participantTableData: ParticipantData[] = useMemo(() => {
    return (
      schoolParticipants?.map((participant) => {
        const getSportName = (sportId: string) => {
          return sports?.find((s) => s.id === sportId)?.name || sportId;
        };

        const getParticipantType = (participant: any) => {
          const types = [];

          types.push("Athlète");

          if (participant.user?.is_pompom) types.push("Pompom");
          if (participant.user?.is_fanfare) types.push("Fanfare");
          if (participant.user?.is_cameraman) types.push("Cameraman");
          if (participant.user?.is_volunteer) types.push("Bénévole");

          return types.join(", ");
        };

        return {
          userId: participant.user_id,
          sportId: participant.sport_id,
          sportName: getSportName(participant.sport_id),
          fullName: `${participant.user?.user?.firstname || ""} ${participant.user?.user?.name || ""}`,
          email: participant.user?.user?.email || "",
          license: participant.license || "",
          teamId: participant.team_id,
          teamName: null, // Will be populated by SportQuotaCard
          isSubstitute: participant.substitute || false,
          isValidated: participant.user?.validated || false,
          participantType: getParticipantType(participant),
        };
      }) || []
    );
  }, [schoolParticipants, sports]);

  const participantsBySport = useMemo(() => {
    return participantTableData.reduce(
      (acc, participant) => {
        const sportId = participant.sportId;
        if (!acc[sportId]) {
          acc[sportId] = {
            sportName: participant.sportName,
            participants: [],
          };
        }
        acc[sportId].participants.push(participant);
        return acc;
      },
      {} as Record<
        string,
        { sportName: string; participants: ParticipantData[] }
      >,
    );
  }, [participantTableData]);

  if (!schoolId && userSchoolId) {
    router.push(`/admin/validation?school_id=${userSchoolId}`);
    return null;
  }

  if (schoolId && !canAccessSchool) {
    router.push(`/admin/validation?school_id=${userSchoolId}`);
    return null;
  }

  if (!effectiveSchoolId) {
    return (
      <div className="flex items-center justify-center h-full mt-10">
        <p className="text-gray-500">Aucune école associée à votre compte</p>
      </div>
    );
  }

  const school = sportSchools?.find((s) => s.school_id === effectiveSchoolId);
  const sportsWithParticipants = Object.entries(participantsBySport);

  const totalParticipants = participantTableData.length;
  const totalValidated = participantTableData.filter(
    (p) => p.isValidated,
  ).length;

  return (
    <div className="flex w-full flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-bold">
          Validation des participants{" "}
          {school ? `- ${formatSchoolName(school.school.name)}` : ""}
        </span>
      </div>

      {school && (
        <GlobalQuotaCard
          totalParticipants={totalParticipants}
          totalValidated={totalValidated}
          sportQuotas={sportsQuota || []}
          schoolName={formatSchoolName(school.school.name) || "École"}
        />
      )}

      {sportsWithParticipants.length > 0 ? (
        <Tabs defaultValue={sportsWithParticipants[0]?.[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
            {sportsWithParticipants.map(
              ([sportId, { sportName, participants }]) => {
                const quota = sportsQuota?.find(
                  (q: any) => q.sport_id === sportId,
                );
                const isOverQuota =
                  quota && participants.length > (quota.participant_quota || 0);

                return (
                  <TabsTrigger
                    key={sportId}
                    value={sportId}
                    className="relative"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      {sportName}
                      <Badge
                        variant={isOverQuota ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {participants.length}
                      </Badge>
                    </div>
                  </TabsTrigger>
                );
              },
            )}
          </TabsList>

          {sportsWithParticipants.map(
            ([sportId, { sportName, participants }]) => {
              const quota = sportsQuota?.find(
                (q: any) => q.sport_id === sportId,
              );

              return (
                <TabsContent key={sportId} value={sportId}>
                  <SportQuotaCard
                    sportId={sportId}
                    sportName={sportName}
                    participants={participants}
                    quota={quota}
                    onValidateParticipant={onValidate}
                    isLoading={isValidateLoading}
                    schoolId={effectiveSchoolId || ""}
                    schoolName={
                      school
                        ? formatSchoolName(school.school.name) || "École"
                        : "École"
                    }
                  />
                </TabsContent>
              );
            },
          )}
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-full mt-10">
          <p className="text-gray-500">
            Aucun participant trouvé pour cette école
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
