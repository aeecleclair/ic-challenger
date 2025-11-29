"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Trophy, Plus, Trash2, Edit, Sparkles } from "lucide-react";
import { usePodiums } from "@/src/hooks/usePodiums";
import { useSports } from "@/src/hooks/useSports";
import { useSportPodiums } from "@/src/hooks/useSportsPodiums";
import { PodiumCard } from "@/src/components/admin/podiums/PodiumCard";
import { GlobalPodiumCard } from "@/src/components/admin/podiums/GlobalPodiumCard";
import { PodiumRankingsForm } from "@/src/components/admin/podiums/PodiumRankingsForm";
import { SportsDataTable } from "@/src/components/admin/podiums/SportsDataTable";
import { PodiumRankingsFormData } from "@/src/forms/podium";
import { SchoolResult } from "@/src/api/hyperionSchemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { usePompomsPodiums } from "@/src/hooks/usePompomsPodiums";
import { PompomsPodiumForm } from "@/src/components/admin/podiums/PompomsPodiumForm";

export default function PodiumsPage() {
  const searchParams = useSearchParams();
  const selectedSportId = searchParams.get("sport_id");
  const selectedSchoolId = searchParams.get("school_id");

  const { sports } = useSports();
  const { podiumsBySport } = useSportPodiums({
    sportIds:
      sports?.filter((sport) => sport.active).map((sport) => sport.id) || [],
  });
  const {
    globalPodium,
    sportPodium,
    schoolPodium,
    createOrUpdateSportPodium,
    deleteSportPodium,
    isGlobalLoading,
    isSportLoading,
    isSchoolLoading,
    isUpdateLoading,
    isDeleteLoading,
  } = usePodiums({
    sportId: selectedSportId || undefined,
    schoolId: selectedSchoolId || undefined,
  });

  const {
    pompomsResults,
    createOrUpdatePompomsPodium,
    deletePompomsPodium,
    isPompomsLoading,
    isUpdateLoading: isPompomsUpdateLoading,
    isDeleteLoading: isPompomsDeleteLoading,
  } = usePompomsPodiums();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSportForEdit, setSelectedSportForEdit] = useState<string>("");
  const isPompomsSport = selectedSportForEdit === "pompoms";

  // Extract pompoms sorting logic
  const sortedPompomsResults = useMemo(() => {
    return (
      pompomsResults?.sort((a, b) => b.total_points - a.total_points) || []
    );
  }, [pompomsResults]);

  const pompomsTeamResults = useMemo(() => {
    return sortedPompomsResults.map((result, index) => ({
      school_id: result.school_id,
      sport_id: "pompoms",
      team_id: result.school_id,
      points: result.total_points,
      edition_id: "",
      rank: index + 1,
      team: {
        id: result.school_id,
        name: result.school_id,
        captain_id: "",
        sport_id: "pompoms",
        school_id: result.school_id,
        edition_id: "",
        created_at: new Date().toISOString(),
      },
    }));
  }, [sortedPompomsResults]);

  const handleSubmitPodium = (data: PodiumRankingsFormData) => {
    if (selectedSportForEdit && selectedSportForEdit !== "pompoms") {
      createOrUpdateSportPodium(selectedSportForEdit, data, () => {
        setEditDialogOpen(false);
        setSelectedSportForEdit("");
      });
    }
  };

  const handleSubmitPompomsPodium = (data: SchoolResult[]) => {
    createOrUpdatePompomsPodium(data, () => {
      setEditDialogOpen(false);
      setSelectedSportForEdit("");
    });
  };

  const handleDeletePodium = (sportId: string) => {
    if (sportId === "pompoms") {
      deletePompomsPodium(() => {
        // Pompoms podium deleted successfully
      });
    } else {
      deleteSportPodium(sportId, () => {
        // Podium deleted successfully
      });
    }
  };

  const openEditDialog = (sportId: string) => {
    setSelectedSportForEdit(sportId);
    setEditDialogOpen(true);
  };

  if (isGlobalLoading || isPompomsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des podiums</h1>
        </div>
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des podiums</h1>
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Gérer un podium
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gérer le podium d&apos;un sport</DialogTitle>
              <DialogDescription>
                Sélectionnez un sport et configurez son podium.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Sport</label>
                <Select
                  value={selectedSportForEdit}
                  onValueChange={setSelectedSportForEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pompoms">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Pompoms
                      </div>
                    </SelectItem>
                    {sports
                      ?.filter((sport) => sport.active)
                      .map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          {sport.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSportForEdit && selectedSportForEdit !== "pompoms" && (
                <PodiumRankingsForm
                  onSubmit={handleSubmitPodium}
                  isLoading={isUpdateLoading}
                  sportId={selectedSportForEdit}
                  defaultValues={sportPodium}
                  submitText="Mettre à jour le podium"
                />
              )}

              {isPompomsSport && (
                <PompomsPodiumForm
                  onSubmit={handleSubmitPompomsPodium}
                  isLoading={isPompomsUpdateLoading}
                  defaultValues={pompomsResults}
                  submitText="Mettre à jour le podium Pompoms"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Global Podium */}
          <div className="lg:col-span-2 xl:col-span-3">
            <GlobalPodiumCard
              results={globalPodium || []}
              title="Podium Global"
            />
          </div>

          {/* Pompoms Podium */}
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Podium Pompoms
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog("pompoms")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePodium("pompoms")}
                  disabled={isPompomsDeleteLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
            <PodiumCard
              results={pompomsTeamResults}
              title="Classement Pompoms"
            />
          </div>

          {/* Sport-specific Podium */}
          {selectedSportId &&
            selectedSportId !== "pompoms" &&
            !isSchoolLoading && (
              <div className="lg:col-span-1 xl:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Podium du sport sélectionné
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(selectedSportId)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePodium(selectedSportId)}
                      disabled={isDeleteLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
                <PodiumCard
                  results={sportPodium || []}
                  title={`Podium - ${sports?.find((s) => s.id === selectedSportId)?.name || "Sport sélectionné"}`}
                />
              </div>
            )}

          {/* School-specific Podium */}
          {selectedSchoolId && !isSchoolLoading && (
            <div className="lg:col-span-1 xl:col-span-1">
              <h2 className="text-xl font-semibold mb-4">
                Podium de l&apos;école sélectionnée
              </h2>
              <PodiumCard results={schoolPodium || []} title="Podium École" />
            </div>
          )}

          {/* Sports List for Quick Actions */}
          <div className="lg:col-span-2 xl:col-span-3">
            <h2 className="text-xl font-semibold mb-4">
              Gestion des podiums par sport
            </h2>

            {/* Sports Data Table */}
            <SportsDataTable
              data={[
                // Add Pompoms as first entry
                {
                  id: "pompoms",
                  name: "Pompoms",
                  active: true,
                  firstPlace: sortedPompomsResults[0]?.school_id || null,
                  secondPlace: sortedPompomsResults[1]?.school_id || null,
                  thirdPlace: sortedPompomsResults[2]?.school_id || null,
                },
                // Add regular sports
                ...(sports
                  ?.filter((sport) => sport.active)
                  .map((sport) => {
                    const podiumData = podiumsBySport[sport.id];
                    const sortedPodium = podiumData
                      ? [...podiumData].sort((a, b) => a.rank - b.rank)
                      : [];

                    return {
                      id: sport.id,
                      name: sport.name,
                      active: sport.active ?? true,
                      firstPlace:
                        sortedPodium.find((p) => p.rank === 1)?.team?.name ||
                        null,
                      secondPlace:
                        sortedPodium.find((p) => p.rank === 2)?.team?.name ||
                        null,
                      thirdPlace:
                        sortedPodium.find((p) => p.rank === 3)?.team?.name ||
                        null,
                    };
                  }) || []),
              ]}
              onEditSport={openEditDialog}
              onDeletePodium={handleDeletePodium}
              isLoading={isUpdateLoading || isPompomsUpdateLoading}
              isDeleteLoading={isDeleteLoading || isPompomsDeleteLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
