"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Plus, X, Save, Trash2 } from "lucide-react";
import { useLocations } from "@/src/hooks/useLocations";
import { DeleteConfirmationDialog } from "@/src/components/admin/locations/DeleteConfirmationDialog";
import { LocationComplete } from "@/src/api/hyperionSchemas";
import { MapPicker } from "@/src/components/admin/locations/map-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema, LocationFormData } from "@/src/forms/location";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";

export default function LocationsPage() {
  const searchParams = useSearchParams();
  const selectedLocationId = searchParams.get("location_id");

  const {
    locations,
    createLocation,
    updateLocation,
    deleteLocation,
    isLoading,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
  } = useLocations();

  const [editingLocation, setEditingLocation] =
    useState<LocationComplete | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    location: LocationComplete | null;
  }>({
    isOpen: false,
    location: null,
  });

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  const handleMapClick = (lat: number, lng: number, address: string) => {
    // Only allow creating new location if not currently editing
    if (!editingLocation) {
      setIsCreating(true);
      form.reset({
        name: "",
        description: "",
        address: address,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  const handleEditLocation = (location: LocationComplete) => {
    // Cancel any current creation
    setIsCreating(false);
    setEditingLocation(location);
    form.reset({
      name: location.name || "",
      description: location.description || "",
      address: location.address || "",
      latitude: location.latitude || undefined,
      longitude: location.longitude || undefined,
    });
  };

  const handleDeleteLocation = (locationId: string) => {
    const location = locations?.find((l) => l.id === locationId);
    if (location) {
      setDeleteDialog({ isOpen: true, location });
    }
  };

  const handleSubmit = (data: LocationFormData) => {
    if (editingLocation) {
      updateLocation(editingLocation.id, data, () => {
        setEditingLocation(null);
        form.reset();
      });
    } else {
      createLocation(data, () => {
        setIsCreating(false);
        form.reset();
      });
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
    }
    if (editingLocation) {
      setEditingLocation(null);
    }
    form.reset();
  };

  const confirmDelete = () => {
    if (deleteDialog.location) {
      deleteLocation(deleteDialog.location.id, () => {
        setDeleteDialog({ isOpen: false, location: null });
        if (editingLocation?.id === deleteDialog.location?.id) {
          setEditingLocation(null);
          form.reset();
        }
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
      </div>

      <div className="w-full">
        {/* Map Section */}
        <MapPicker
          latitude={form.watch("latitude")}
          longitude={form.watch("longitude")}
          onCoordinatesChange={handleMapClick}
          locations={locations}
          onLocationEdit={handleEditLocation}
          form={form}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isCreating={isCreating}
          editingLocation={editingLocation}
          isCreateLoading={isCreateLoading}
          isUpdateLoading={isUpdateLoading}
          isDeleteLoading={isDeleteLoading}
          onDelete={handleDeleteLocation}
          className="h-[calc(100vh-15rem)]"
        />
      </div>

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
