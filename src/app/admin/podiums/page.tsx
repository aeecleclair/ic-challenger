"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Trophy, Plus, Trash2, Edit } from "lucide-react";
import { usePodiums } from "@/src/hooks/usePodiums";
import { useSports } from "@/src/hooks/useSports";
import { PodiumCard } from "@/src/components/admin/podiums/PodiumCard";
import { GlobalPodiumCard } from "@/src/components/admin/podiums/GlobalPodiumCard";
import { PodiumRankingsForm } from "@/src/components/admin/podiums/PodiumRankingsForm";
import { PodiumRankingsFormData } from "@/src/forms/podium";
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

export default function PodiumsPage() {
  const searchParams = useSearchParams();
  const selectedSportId = searchParams.get("sport_id");
  const selectedSchoolId = searchParams.get("school_id");

  const { sports } = useSports();
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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSportForEdit, setSelectedSportForEdit] = useState<string>("");

  const handleSubmitPodium = (data: PodiumRankingsFormData) => {
    if (selectedSportForEdit) {
      createOrUpdateSportPodium(selectedSportForEdit, data, () => {
        setEditDialogOpen(false);
        setSelectedSportForEdit("");
      });
    }
  };

  const handleDeletePodium = (sportId: string) => {
    deleteSportPodium(sportId, () => {
      // Podium deleted successfully
    });
  };

  const openEditDialog = (sportId: string) => {
    setSelectedSportForEdit(sportId);
    setEditDialogOpen(true);
  };

  if (isGlobalLoading) {
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
            <Button onClick={() => setEditDialogOpen(true)}>
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
                    {sports?.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSportForEdit && (
                <PodiumRankingsForm
                  onSubmit={handleSubmitPodium}
                  isLoading={isUpdateLoading}
                  sportId={selectedSportForEdit}
                  submitText="Mettre à jour le podium"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Global Podium */}
        <div className="lg:col-span-2 xl:col-span-3">
          <GlobalPodiumCard
            results={globalPodium || []}
            title="Podium Global"
          />
        </div>

        {/* Sport-specific Podium */}
        {selectedSportId && !isSchoolLoading && (
          <div className="lg:col-span-2 xl:col-span-2">
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
            Actions rapides par sport
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sports?.map((sport) => (
              <div key={sport.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{sport.name}</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(sport.id)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Gérer
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePodium(sport.id)}
                    disabled={isDeleteLoading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
