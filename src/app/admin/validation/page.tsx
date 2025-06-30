"use client";

import SchoolCard from "@/src/components/admin/appSideBar/schools/SchoolCard";
import { Button } from "@/src/components/ui/button";
import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useState, useCallback } from "react";
import {
  ParticipantDataTable,
  ParticipantData,
} from "@/src/components/admin/appSideBar/validation/ParticipantDataTable";
import { useSports } from "@/src/hooks/useSports";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

const Dashboard = () => {
  const router = useRouter();
  const { sportSchools } = useSportSchools();
  const { sports } = useSports();

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");
  const {
    schoolParticipants,
    updateSchoolParticipants,
    error,
    isUpdateLoading,
    refetchSchools,
  } = useSchoolParticipants({
    schoolId: schoolId,
  });

  const school = sportSchools?.find((s) => s.school_id === schoolId);

  const handleValidateParticipant = useCallback(
    (userId: string, sportId: string) => {
      updateSchoolParticipants(sportId, userId, () => {
        // No need to do anything extra here since refetchSchools is called on success
      });
    },
    [updateSchoolParticipants],
  );

  // Transform the participants data for the data table
  const participantTableData: ParticipantData[] =
    schoolParticipants?.map((participant) => {
      const getSportName = (sportId: string) => {
        return sports?.find((s) => s.id === sportId)?.name || sportId;
      };

      const getParticipantType = (participant: any) => {
        const types = [];

        // All participants are athletes by default
        types.push("Athlète");

        // Check for additional roles the participant might have
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
        isSubstitute: participant.substitute || false,
        isValidated: participant.user?.validated || false,
        participantType: getParticipantType(participant),
      };
    }) || [];

  return (
    <div className="flex w-full flex-col p-6">
      {school ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">
              Validation des participants de{" "}
              {formatSchoolName(school.school.name)}
            </span>
            <Link
              href="/admin/validation"
              className="text-sm text-primary hover:underline"
            >
              Retour à la liste des écoles
            </Link>
          </div>

          <div className="mt-4">
            <ParticipantDataTable
              data={participantTableData}
              schoolName={formatSchoolName(school.school.name) || "École"}
              onValidateParticipant={handleValidateParticipant}
              isLoading={isUpdateLoading}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Écoles à valider</h1>
          </div>

          {sportSchools && sportSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sportSchools.map((school) => (
                <SchoolCard
                  key={school.school_id}
                  school={school}
                  onClick={() => {
                    router.push(
                      `/admin/validation?school_id=${school.school_id}`,
                    );
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-gray-500">Aucune école disponible</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
