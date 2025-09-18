"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useCallback, useMemo, useEffect, useState } from "react";
import {
  ParticipantDataTable,
  ParticipantData,
} from "@/src/components/admin/license/ParticipantDataTable";
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
import { useLicense } from "@/src/hooks/useLicense";

const Dashboard = () => {
  const router = useRouter();
  const { sports } = useSports();
  const { sportSchools } = useSportSchools();
  const { me: currentUser } = useUser();
  const { updateLicense, isUpdateLoading } = useLicense();

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");

  if (!schoolId) {
    router.push("/admin/license?school_id=" + currentUser?.school_id || "");
  }

  const userSchoolId = currentUser?.school_id;

  const effectiveSchoolId = schoolId || userSchoolId;

  const { schoolParticipants, refetchParticipantSchools } =
    useSchoolParticipants({
      schoolId: effectiveSchoolId || null,
    });

  const participants = useMemo(() => {
    return schoolParticipants?.map((participant) => ({
      userId: participant.user_id,
      sportId: participant.sport_id,
      sportName:
        sports?.find((s) => s.id === participant.sport_id)?.name || "Aucun",
      fullName:
        participant.user.user.firstname + " " + participant.user.user.name,
      email: participant.user.user.email,
      license: participant.license || undefined,
      isValidated: participant.is_license_valid,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolParticipants]);

  const onValidate = (userId: string, sportId: string) => {
    updateLicense(sportId, userId, true, () => {
      refetchParticipantSchools();
    });
  };

  return (
    <div className="flex w-full flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-bold">Validation des licences</span>
      </div>

      {sportSchools && sportSchools.length > 0 ? (
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
                  onAbort={() => {
                    router.push(`/admin/license?school_id=${school.school_id}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    {school.school.name}
                    <Badge variant={"secondary"} className="text-xs">
                      {participants?.length || 0}
                    </Badge>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent key={effectiveSchoolId} value={effectiveSchoolId!}>
            {participants ? (
              <div className="overflow-y-auto">
                <ParticipantDataTable
                  data={participants}
                  onValidateParticipant={onValidate}
                  isLoading={isUpdateLoading}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full mt-10">
                <p className="text-gray-500">
                  Aucun participant trouvé pour cette école
                </p>
              </div>
            )}
          </TabsContent>
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
