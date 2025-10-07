"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useCallback, useMemo, useEffect, useState } from "react";
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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Trophy } from "lucide-react";
import { GlobalQuotaCard } from "@/src/components/admin/validation/GlobalQuotaCard";

import { fetchGetCompetitionUsersUserIdPayments } from "@/src/api/hyperionComponents";
import { useAuth } from "@/src/hooks/useAuth";
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import { useSchoolsGeneralQuota } from "@/src/hooks/useSchoolsGeneralQuota";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import { useSchoolsProductQuota } from "@/src/hooks/useSchoolsProductQuota";
import { useProducts } from "@/src/hooks/useProducts";
import { useCompetitionUsers } from "@/src/hooks/useCompetitionUsers";
import { CompetitionUser } from "@/src/api/hyperionSchemas";
import { useTeams } from "@/src/hooks/useTeams";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { ValidationTab } from "@/src/components/admin/validation/ValidationTab";

const Dashboard = () => {
  const router = useRouter();
  const { sportSchools } = useSportSchools();
  const { sports } = useSports();
  const { me: currentUser, isAdmin } = useUser();
  const { token, isTokenExpired } = useAuth();

  const [participantPayments, setParticipantPayments] = useState<
    Record<string, boolean | undefined>
  >({});
  const [checkedParticipants, setCheckedParticipants] = useState<Set<string>>(
    new Set(),
  );
  const [schoolCompetitionUsersCounter, setSchoolCompetitionUsersCounter] =
    useState<string[][]>([]);

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");
  const { schoolsGeneralQuota, refetchSchoolsGeneralQuota } =
    useSchoolsGeneralQuota({
      schoolId: schoolId || undefined,
    });

  const { schoolsProductQuota, refetchSchoolsProductQuota } =
    useSchoolsProductQuota({
      schoolId: schoolId || undefined,
    });

  const { products } = useProducts();

  const userSchoolId = currentUser?.school_id;
  const canAccessSchool = isAdmin() || schoolId === userSchoolId;

  const effectiveSchoolId = schoolId || userSchoolId;

  const { schoolParticipants, refetchParticipantSchools } =
    useSchoolParticipants({
      schoolId: effectiveSchoolId || "",
    });

  const {
    competitionUsers,
    validateCompetitionUser,
    isValidateLoading,
    invalidateCompetitionUser,
    isInvalidateLoading,
  } = useCompetitionUsers();

  const { sportsQuota, refetchSportsQuota } = useSportsQuota({
    sportId: undefined,
  });

  const checkPaymentStatus = useCallback(
    async (userId: string) => {
      if (checkedParticipants.has(userId) || !token || isTokenExpired()) {
        return;
      }

      try {
        const payments = await fetchGetCompetitionUsersUserIdPayments({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          pathParams: {
            userId: userId,
          },
        });

        const hasPaid = payments && payments.length > 0;
        setParticipantPayments((prev) => ({
          ...prev,
          [userId]: hasPaid,
        }));
      } catch (error: any) {
        console.error(
          "Error checking payment status for user",
          userId,
          ":",
          error,
        );

        setParticipantPayments((prev) => ({
          ...prev,
          [userId]: undefined,
        }));
      } finally {
        setCheckedParticipants((prev) => new Set(prev).add(userId));
      }
    },
    [token, isTokenExpired, checkedParticipants],
  );

  const onValidate = (userId: string) => {
    validateCompetitionUser(userId, () => {});
  };

  const onInvalidate = (userId: string) => {
    invalidateCompetitionUser(userId, () => {});
  };

  const participantTableData: ParticipantData[] = useMemo(() => {
    return (
      competitionUsers
        ?.filter((user) => user.user.school_id === effectiveSchoolId)
        .map((user) => {
          const getSportName = (sportId: string) => {
            return sports?.find((s) => s.id === sportId)?.name || sportId;
          };

          const getParticipantType = (user: CompetitionUser) => {
            const types = [];
            if (user.is_athlete) types.push("Athlète");
            if (user.is_pompom) types.push("Pompom");
            if (user.is_fanfare) types.push("Fanfare");
            if (user.is_cameraman) types.push("Cameraman");
            if (user.is_volunteer) types.push("Bénévole");
            return types.join(", ");
          };

          if (user.is_athlete) {
            const participant = schoolParticipants?.find(
              (p) => p.user_id === user.user_id,
            );
            return {
              userId: user.user_id,
              sportId: participant?.sport_id || "",
              sportName: getSportName(participant?.sport_id || ""),
              fullName: `${user.user?.firstname || ""} ${user.user?.name || ""}`,
              email: user.user?.email || "",
              isLicenseValid: participant?.is_license_valid || false,
              teamId: participant?.team_id || "",
              teamName: participant?.team.name || "",
              isCaptain: participant?.team.captain_id === user.user_id || false,
              isSubstitute: participant?.substitute || false,
              isValidated: user.validated || false,
              participantType: getParticipantType(user),
              hasPaid: participantPayments[user.user_id],
            };
          }
          return {
            userId: user.user_id,
            sportId: undefined,
            sportName: undefined,
            fullName: `${user.user?.firstname || ""} ${user.user?.name || ""}`,
            email: user.user?.email || "",
            isLicenseValid: undefined,
            teamId: undefined,
            teamName: undefined,
            isCaptain: false,
            isSubstitute: false,
            isValidated: user.validated || false,
            participantType: getParticipantType(user),
            hasPaid: participantPayments[user.user_id],
          };
        }) || []
    );
  }, [
    competitionUsers,
    sports,
    participantPayments,
    schoolParticipants,
    effectiveSchoolId,
  ]);

  const validatedCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {
      athlete_quota: 0,
      cameraman_quota: 0,
      pompom_quota: 0,
      fanfare_quota: 0,
      athlete_cameraman_quota: 0,
      athlete_pompom_quota: 0,
      athlete_fanfare_quota: 0,
      non_athlete_cameraman_quota: 0,
      non_athlete_pompom_quota: 0,
      non_athlete_fanfare_quota: 0,
    };
    participantTableData.forEach((p) => {
      if (p.isValidated) {
        if (p.participantType.includes("Athlète")) counts.athlete_quota++;
        if (p.participantType.includes("Cameraman")) counts.cameraman_quota++;
        if (p.participantType.includes("Pompom")) counts.pompom_quota++;
        if (p.participantType.includes("Fanfare")) counts.fanfare_quota++;

        if (
          p.participantType.includes("Athlète") &&
          p.participantType.includes("Cameraman")
        )
          counts.athlete_cameraman_quota++;
        if (
          p.participantType.includes("Athlète") &&
          p.participantType.includes("Pompom")
        )
          counts.athlete_pompom_quota++;
        if (
          p.participantType.includes("Athlète") &&
          p.participantType.includes("Fanfare")
        )
          counts.athlete_fanfare_quota++;
        if (
          !p.participantType.includes("Athlète") &&
          p.participantType.includes("Cameraman")
        )
          counts.non_athlete_cameraman_quota++;
        if (
          !p.participantType.includes("Athlète") &&
          p.participantType.includes("Pompom")
        )
          counts.non_athlete_pompom_quota++;
        if (
          !p.participantType.includes("Athlète") &&
          p.participantType.includes("Fanfare")
        )
          counts.non_athlete_fanfare_quota++;
      }
    });
    return counts;
  }, [participantTableData]);

  useEffect(() => {
    if (participantTableData.length > 0 && token && !isTokenExpired()) {
      const validatedParticipantsToCheck = participantTableData
        .filter(
          (participant) =>
            participant.isValidated &&
            !checkedParticipants.has(participant.userId),
        )
        .slice(0, 20);

      validatedParticipantsToCheck.forEach((participant, index) => {
        setTimeout(() => {
          checkPaymentStatus(participant.userId);
        }, index * 100);
      });
    }
  }, [
    participantTableData,
    checkPaymentStatus,
    checkedParticipants,
    token,
    isTokenExpired,
  ]);

  useEffect(() => {
    if (effectiveSchoolId) {
      refetchParticipantSchools();
      refetchSchoolsGeneralQuota();
      refetchSchoolsProductQuota();
      refetchSportsQuota();
    }
  }, [
    effectiveSchoolId,
    refetchParticipantSchools,
    refetchSchoolsGeneralQuota,
    refetchSchoolsProductQuota,
    refetchSportsQuota,
  ]);

  useEffect(() => {
    if (competitionUsers && sportSchools) {
      const newCounter: string[][] = sportSchools.map((school) => {
        const participants = competitionUsers.filter(
          (user) => user.user.school_id === school.school_id,
        );
        return [school.school_id, participants.length.toString()];
      });
      setSchoolCompetitionUsersCounter(newCounter);
    }
  }, [competitionUsers, sportSchools]);

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

  const totalParticipants = participantTableData.length;
  const totalValidated = participantTableData.filter(
    (p) => p.isValidated,
  ).length;

  const totalTeams = new Set(
    participantTableData.map((p) => p.teamId).filter(Boolean),
  ).size;

  return (
    <div className="flex w-full flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-bold">
          Validation des participants{" "}
          {school ? `- ${formatSchoolName(school.school.name)}` : ""}
        </span>
      </div>

      {isAdmin() ? (
        sportSchools &&
        sportSchools.length > 0 && (
          <Tabs defaultValue={sportSchools[0].school_id} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
              {sportSchools.map((school) => {
                const participants = schoolParticipants?.filter(
                  (p) => p.school_id === school.school_id,
                );

                return (
                  <TabsTrigger
                    key={school.school_id}
                    value={school.school_id}
                    className="relative"
                    onClick={() => {
                      router.push(
                        `/admin/validation?school_id=${school.school_id}`,
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {formatSchoolName(school.school.name)}
                      <Badge variant={"secondary"} className="text-xs">
                        {schoolCompetitionUsersCounter.find(
                          (s) => s[0] === school.school_id,
                        )
                          ? schoolCompetitionUsersCounter.find(
                              (s) => s[0] === school.school_id,
                            )![1]
                          : participants
                            ? participants.length
                            : 0}
                      </Badge>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent key={effectiveSchoolId} value={effectiveSchoolId!}>
              <ValidationTab
                participantTableData={participantTableData}
                onValidate={onValidate}
                onInvalidate={onInvalidate}
                isValidateLoading={isValidateLoading}
                isInvalidateLoading={isInvalidateLoading}
                school={school}
                totalParticipants={totalParticipants}
                totalValidated={totalValidated}
                totalTeams={totalTeams}
                sportsQuota={sportsQuota || []}
                schoolsProductQuota={schoolsProductQuota}
                schoolsGeneralQuota={schoolsGeneralQuota}
                products={products}
                validatedCounts={validatedCounts}
              />
            </TabsContent>
          </Tabs>
        )
      ) : (
        <ValidationTab
          participantTableData={participantTableData}
          onValidate={onValidate}
          onInvalidate={onInvalidate}
          isValidateLoading={isValidateLoading}
          isInvalidateLoading={isInvalidateLoading}
          school={school}
          totalParticipants={totalParticipants}
          totalValidated={totalValidated}
          totalTeams={totalTeams}
          sportsQuota={sportsQuota || []}
          schoolsProductQuota={schoolsProductQuota}
          schoolsGeneralQuota={schoolsGeneralQuota}
          products={products}
          validatedCounts={validatedCounts}
        />
      )}
    </div>
  );
};

export default Dashboard;
