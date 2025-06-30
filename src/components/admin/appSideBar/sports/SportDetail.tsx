"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sportFormSchema } from "@/src/forms/sport";
import { Sport, QuotaInfo } from "@/src/api/hyperionSchemas";
import Link from "next/link";
import { useState } from "react";
import { QuotaDialog } from "./QuotaDialog";
import { QuotaDataTable } from "./QuotaDataTable";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useSportsQuota } from "@/src/hooks/useSportsQuota";
import { useSchools } from "@/src/hooks/useSchools";
import { QuotaFormValues } from "@/src/forms/quota";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface SportDetailProps {
  sport: Sport;
}

const SportDetail = ({ sport }: SportDetailProps) => {
  const {
    sportsQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  } = useSportsQuota({
    sportId: sport.id,
  });

  const { filteredSchools } = useSchools();

  // State for manage the selected school for add/edit quota
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedSchoolForDelete, setSelectedSchoolForDelete] = useState<
    string | null
  >(null);

  // Handle setting the form values when editing an existing quota
  const handleEditQuota = (schoolId: string) => {
    const currentQuota = sportsQuota?.find((q) => q.school_id === schoolId);
    if (currentQuota) {
      setSelectedSchool(schoolId);
      setIsAddDialogOpen(true);
    }
  };

  // Handle submitting the form to create or update a quota
  const handleQuotaSubmit = (values: QuotaFormValues) => {
    if (!selectedSchool) return;

    const quotaInfo: QuotaInfo = {
      participant_quota: values.participant_quota,
      team_quota: values.team_quota,
    };

    // Check if this is an update or create operation
    const existingQuota = sportsQuota?.find(
      (q) => q.school_id === selectedSchool,
    );

    if (existingQuota) {
      updateQuota(selectedSchool, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedSchool(null);
      });
    } else {
      createQuota(selectedSchool, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedSchool(null);
      });
    }
  };

  // Handle deleting a quota
  const handleDeleteQuota = () => {
    if (selectedSchoolForDelete) {
      deleteQuota(selectedSchoolForDelete, () => {
        setSelectedSchoolForDelete(null);
      });
    }
  };

  // Get school name by ID
  const getSchoolName = (schoolId: string) => {
    return (
      formatSchoolName(filteredSchools?.find((s) => s.id === schoolId)?.name) ||
      schoolId
    );
  };

  const form = useForm<z.infer<typeof sportFormSchema>>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: sport.name,
      teamSize: sport.team_size,
      sportCategory: sport.sport_category ?? undefined,
      substituteMax: sport.substitute_max ?? 0,
      active: sport.active,
    },
    mode: "onChange",
  });

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">Modifer un sport</span>
        <Link
          href="/admin/sports"
          className="text-sm text-primary hover:underline"
        >
          Retour à la liste
        </Link>
      </div>

      {/* Quotas DataTable */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quotas par école</h2>
          <QuotaDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleQuotaSubmit}
            schools={filteredSchools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            existingQuotas={sportsQuota}
            title={
              selectedSchool &&
              sportsQuota?.find((q) => q.school_id === selectedSchool)
                ? "Modifier le quota"
                : "Ajouter un quota"
            }
            description="Définissez le nombre de participants et d'équipes autorisés pour cette école."
            submitLabel={
              selectedSchool &&
              sportsQuota?.find((q) => q.school_id === selectedSchool)
                ? "Modifier"
                : "Ajouter"
            }
            isLoading={isCreateLoading || isUpdateLoading}
          />
        </div>

        {/* DataTable with filtering and sorting */}
        {sportsQuota && (
          <>
            <QuotaDataTable
              data={sportsQuota.map((quota) => ({
                school_id: quota.school_id,
                schoolName: getSchoolName(quota.school_id),
                participant_quota: quota.participant_quota || 0,
                team_quota: quota.team_quota || 0,
                sport_id: quota.sport_id,
                edition_id: quota.edition_id,
              }))}
              sportName={sport.name || ""}
              onEditQuota={handleEditQuota}
              onDeleteQuota={(schoolId) => {
                setSelectedSchoolForDelete(schoolId);
                setIsDeleteDialogOpen(true);
              }}
            />

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              title="Êtes-vous sûr ?"
              description={`Cette action supprimera définitivement le quota pour ${
                selectedSchoolForDelete
                  ? getSchoolName(selectedSchoolForDelete)
                  : ""
              }.`}
              onConfirm={handleDeleteQuota}
              onCancel={() => setSelectedSchoolForDelete(null)}
              isLoading={isDeleteLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SportDetail;
