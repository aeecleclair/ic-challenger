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

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");
  const { schoolsGeneralQuota } = useSchoolsGeneralQuota({
    schoolId: schoolId || undefined,
  });

  const { schoolsProductQuota } = useSchoolsProductQuota({
    schoolId: schoolId || undefined,
  });

  const { products } = useProducts();

  const userSchoolId = currentUser?.school_id;
  const canAccessSchool = isAdmin() || schoolId === userSchoolId;

  const effectiveSchoolId = schoolId || userSchoolId;

  const { schoolParticipants } = useSchoolParticipants({
    schoolId: effectiveSchoolId || "",
  });

  const {
    competitionUsers,
    validateCompetitionUser,
    isValidateLoading,
    invalidateCompetitionUser,
    isInvalidateLoading,
  } = useCompetitionUsers();

  const { sportsQuota } = useSportsQuota({ sportId: undefined });

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

      {school && (
        <>
          <div className="mb-6 flex items-center gap-4">
            <div className="text-lg font-semibold mb-1">
              Quotas de{" "}
              {school ? formatSchoolName(school.school.name) : "l'école"}
            </div>

            {schoolsGeneralQuota && (
              <Tooltip>
                <TooltipTrigger asChild>
                  {(() => {
                    const hasExceeded = Object.entries(schoolsGeneralQuota)
                      .filter(([key]) => !key.toLowerCase().includes("id"))
                      .some(([key, value]) => {
                        const used = validatedCounts[key] ?? 0;
                        const quota = (value as number) ?? 0;
                        return used > quota;
                      });
                    return (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 py-1 text-xs border-primary hover:bg-primary/10${hasExceeded ? " text-red-600" : " text-primary"}`}
                      >
                        Quota général
                      </Button>
                    );
                  })()}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-base flex items-center mb-2 text-primary font-semibold">
                    Détail des quotas généraux
                  </div>
                  <div className="space-y-2">
                    {Object.entries(schoolsGeneralQuota)
                      .filter(([key]) => !key.toLowerCase().includes("id"))
                      .map(([key, value]) => {
                        let formattedName = key
                          .replace(/_/g, " ")
                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                          .replace(/\b\w/g, (c) => c.toUpperCase());
                        const words = formattedName.split(" ");
                        if (
                          words.length > 1 &&
                          words[words.length - 1].toLowerCase() === "quota"
                        ) {
                          formattedName = words.slice(0, -1).join(" ");
                        }
                        const used = validatedCounts[key] ?? 0;
                        const quota = (value as number) ?? 0;
                        const exceeded = used > quota;
                        return (
                          <div
                            key={key}
                            className="flex justify-between items-center gap-2 py-1 px-2"
                          >
                            <span
                              className={`font-medium text-xs text-muted-foreground${exceeded ? " text-red-600" : ""}`}
                            >
                              {formattedName}
                            </span>
                            <span
                              className={`text-xs font-bold${exceeded ? " text-red-600" : " text-primary"}`}
                            >
                              Utilisé: {used} / {quota}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {schoolsProductQuota && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 py-1 text-xs border-primary text-primary hover:bg-primary/10"
                  >
                    Quota de produit
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="text-base flex items-center mb-2 text-primary font-semibold">
                    Détail des quotas produits
                  </div>
                  <div className="space-y-2">
                    {schoolsProductQuota.map((value) => {
                      const product = products?.find(
                        (p) => p.id === value.product_id,
                      );
                      return (
                        <div
                          key={value.product_id}
                          className="flex justify-between items-center gap-2 py-1 px-2"
                        >
                          <span className="font-medium text-xs text-muted-foreground">
                            {product?.name}
                          </span>
                          <span className="text-xs font-bold text-primary">
                            {value.quota}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <GlobalQuotaCard
            totalParticipants={totalParticipants}
            totalValidated={totalValidated}
            totalTeams={totalTeams}
            sportQuotas={sportsQuota || []}
            schoolName={formatSchoolName(school.school.name) || "École"}
          />
          {participantTableData?.length > 0 ? (
            <div className="overflow-y-auto">
              <ParticipantDataTable
                data={participantTableData}
                schoolName={formatSchoolName(school.school.name) || "École"}
                onValidateParticipant={onValidate}
                onInvalidateParticipant={onInvalidate}
                isLoading={isValidateLoading || isInvalidateLoading}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-gray-500">
                Aucun participant trouvé pour cette école
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
