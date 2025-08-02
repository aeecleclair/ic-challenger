"use client";

import { SchoolExtension, QuotaInfo } from "@/src/api/hyperionSchemas";
import Link from "next/link";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useSchoolsQuota } from "@/src/hooks/useSchoolsQuota";
import { useSports } from "@/src/hooks/useSports";
import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { QuotaDialog } from "./QuotaDialog";
import { QuotaDataTable, QuotaWithSport } from "./QuotaDataTable";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { QuotaFormValues } from "@/src/forms/quota";

interface SchoolDetailProps {
  school: SchoolExtension;
}

const SchoolDetail = ({ school }: SchoolDetailProps) => {
  const {
    schoolsQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  } = useSchoolsQuota({
    schoolId: school.school_id,
  });

  const { sports } = useSports();

  // State for manage the selected sport for add/edit quota
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedSportForDelete, setSelectedSportForDelete] = useState<
    string | null
  >(null);

  // Handle setting the form values when editing an existing quota
  const handleEditQuota = (sportId: string) => {
    const currentQuota = schoolsQuota?.find((q) => q.sport_id === sportId);
    if (currentQuota) {
      setSelectedSport(sportId);
      setIsAddDialogOpen(true);
    }
  };

  // Handle submitting the form to create or update a quota
  const handleQuotaSubmit = (values: QuotaFormValues) => {
    if (!selectedSport) return;

    const quotaInfo: QuotaInfo = {
      participant_quota: values.participant_quota,
      team_quota: values.team_quota,
    };

    // Check if this is an update or create operation
    const existingQuota = schoolsQuota?.find(
      (q) => q.sport_id === selectedSport,
    );

    if (existingQuota) {
      updateQuota(selectedSport, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedSport(null);
      });
    } else {
      createQuota(selectedSport, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedSport(null);
      });
    }
  };

  // Handle deleting a quota
  const handleDeleteQuota = () => {
    if (selectedSportForDelete) {
      deleteQuota(selectedSportForDelete, () => {
        setSelectedSportForDelete(null);
      });
    }
  };

  // Get sport name by ID
  const getSportName = (sportId: string) => {
    return sports?.find((s) => s.id === sportId)?.name || sportId;
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">
          Détail de {formatSchoolName(school.school.name)}
        </span>
        <Link
          href="/admin/schools"
          className="text-sm text-primary hover:underline"
        >
          Retour à la liste
        </Link>
      </div>

      {/* Quotas DataTable */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quotas par sport</h2>
          <QuotaDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleQuotaSubmit}
            sports={sports}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            existingQuotas={schoolsQuota}
            title={
              selectedSport &&
              schoolsQuota?.find((q) => q.sport_id === selectedSport)
                ? "Modifier le quota"
                : "Ajouter un quota"
            }
            description="Définissez le nombre de participants et d'équipes autorisés pour ce sport."
            submitLabel={
              selectedSport &&
              schoolsQuota?.find((q) => q.sport_id === selectedSport)
                ? "Modifier"
                : "Ajouter"
            }
            isLoading={isCreateLoading || isUpdateLoading}
          />
        </div>

        {/* DataTable with filtering and sorting */}
        {schoolsQuota && (
          <>
            <QuotaDataTable
              data={schoolsQuota.map((quota) => ({
                sport_id: quota.sport_id,
                sportName: getSportName(quota.sport_id),
                participant_quota: quota.participant_quota || 0,
                team_quota: quota.team_quota || 0,
                school_id: quota.school_id,
                edition_id: quota.edition_id,
              }))}
              schoolName={formatSchoolName(school.school.name) || ""}
              onEditQuota={handleEditQuota}
              onDeleteQuota={(sportId) => {
                setSelectedSportForDelete(sportId);
                setIsDeleteDialogOpen(true);
              }}
            />

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              title="Êtes-vous sûr ?"
              description={`Cette action supprimera définitivement le quota pour ${
                selectedSportForDelete
                  ? getSportName(selectedSportForDelete)
                  : ""
              }.`}
              onConfirm={handleDeleteQuota}
              onCancel={() => setSelectedSportForDelete(null)}
              isLoading={isDeleteLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SchoolDetail;
