"use client";

import { SchoolExtension, SportQuotaInfo } from "@/src/api/hyperionSchemas";
import Link from "next/link";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { getSchoolType } from "@/src/utils/schools";
import { useSchoolsQuota } from "@/src/hooks/useSchoolsQuota";
import { useSports } from "@/src/hooks/useSports";
import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { QuotaDialog } from "./QuotaDialog";
import { QuotaDataTable, QuotaWithSport } from "./QuotaDataTable";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { QuotaFormValues } from "@/src/forms/quota";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  School,
  Trophy,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

interface SchoolDetailProps {
  school: SchoolExtension;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SchoolDetail = ({ school, onEdit, onDelete }: SchoolDetailProps) => {
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

  const schoolType = getSchoolType(school);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedSportForDelete, setSelectedSportForDelete] = useState<
    string | null
  >(null);

  const handleEditQuota = (sportId: string) => {
    const currentQuota = schoolsQuota?.find((q) => q.sport_id === sportId);
    if (currentQuota) {
      setSelectedSport(sportId);
      setIsAddDialogOpen(true);
    }
  };
  const existingQuota = schoolsQuota?.find((q) => q.sport_id === selectedSport);

  const handleQuotaSubmit = (values: QuotaFormValues) => {
    if (!selectedSport) return;

    const quotaInfo: SportQuotaInfo = {
      participant_quota: values.participant_quota,
      team_quota: values.team_quota,
    };

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

  const handleDeleteQuota = () => {
    if (selectedSportForDelete) {
      deleteQuota(selectedSportForDelete, () => {
        setSelectedSportForDelete(null);
      });
    }
  };

  const getSportName = (sportId: string) => {
    return sports?.find((s) => s.id === sportId)?.name || sportId;
  };

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {formatSchoolName(school.school.name)}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              variant={schoolType.variant}
              className={`gap-1 ${schoolType.className}`}
            >
              <MapPin className="h-3 w-3" />
              {schoolType.label}
            </Badge>
            <Badge
              variant={school.active ? "default" : "destructive"}
              className="gap-1"
            >
              {school.active ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {school.active ? "Active" : "Inactive"}
            </Badge>
            <Badge
              variant={school.inscription_enabled ? "default" : "secondary"}
              className="gap-1"
            >
              <Users className="h-3 w-3" />
              Inscriptions {school.inscription_enabled ? "ouvertes" : "fermées"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
              className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Quotas Management Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Quotas par sport
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez les quotas de participants et d&apos;équipes pour chaque
                sport
              </p>
            </div>
            <QuotaDialog
              isOpen={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSubmit={handleQuotaSubmit}
              sports={sports}
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
              existingQuota={existingQuota}
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
        </CardHeader>

        <CardContent>
          {schoolsQuota && schoolsQuota.length > 0 ? (
            <QuotaDataTable
              data={schoolsQuota.map((quota) => ({
                sport_id: quota.sport_id,
                sportName: getSportName(quota.sport_id),
                participant_quota: quota.participant_quota || 0,
                team_quota: quota.team_quota || 0,
                school_id: quota.school_id,
              }))}
              schoolName={formatSchoolName(school.school.name) || ""}
              onEditQuota={handleEditQuota}
              onDeleteQuota={(sportId) => {
                setSelectedSportForDelete(sportId);
                setIsDeleteDialogOpen(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted rounded-lg">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucun quota configuré
              </h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter des quotas pour les sports de cette école
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter un quota
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le quota"
        description={`Êtes-vous sûr de vouloir supprimer le quota pour ${
          selectedSportForDelete ? getSportName(selectedSportForDelete) : ""
        } ? Cette action est irréversible.`}
        onConfirm={handleDeleteQuota}
        onCancel={() => setSelectedSportForDelete(null)}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default SchoolDetail;
