"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocations } from "@/src/hooks/useLocations";
import { LocationCard } from "@/src/components/admin/locations/LocationCard";
import { DeleteConfirmationDialog } from "@/src/components/admin/locations/DeleteConfirmationDialog";
import { LocationComplete } from "@/src/api/hyperionSchemas";

export default function LocationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLocationId = searchParams.get("location_id");

  const { locations, deleteLocation, isLoading, isDeleteLoading } =
    useLocations();

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    location: LocationComplete | null;
  }>({
    isOpen: false,
    location: null,
  });

  const handleCreateLocation = () => {
    router.push("/admin/locations/create");
  };

  const handleDeleteLocation = (locationId: string) => {
    const location = locations?.find((l) => l.id === locationId);
    if (location) {
      setDeleteDialog({ isOpen: true, location });
    }
  };

  const confirmDelete = () => {
    if (deleteDialog.location) {
      deleteLocation(deleteDialog.location.id, () => {
        setDeleteDialog({ isOpen: false, location: null });
      });
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, location: null });
  };

  const selectedLocation = selectedLocationId
    ? locations?.find((location) => location.id === selectedLocationId)
    : null;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des lieux</h1>
        </div>
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des lieux</h1>
        <Button onClick={handleCreateLocation}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un lieu
        </Button>
      </div>

      {selectedLocation ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Lieu sélectionné</h2>
          <LocationCard
            location={selectedLocation}
            onDelete={handleDeleteLocation}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations && locations.length > 0 ? (
            locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onDelete={handleDeleteLocation}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Aucun lieu trouvé.</p>
              <Button onClick={handleCreateLocation} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier lieu
              </Button>
            </div>
          )}
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        locationName={deleteDialog.location?.name || ""}
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
