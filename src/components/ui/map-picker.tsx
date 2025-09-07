"use client";

import React from "react";
import dynamic from "next/dynamic";

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onCoordinatesChange: (lat: number, lng: number) => void;
  onLocationAdd?: (
    lat: number,
    lng: number,
    name: string,
    address: string,
  ) => void;
  onLocationDelete?: (lat: number, lng: number) => void;
  onLocationEdit?: (location: any) => void;
  onLocationCreate?: (data: any) => void;
  onLocationUpdate?: (locationId: string, data: any) => void;
  isLocationAdded?: boolean;
  locationName?: string;
  locations?: any[];
  className?: string;
  form?: any;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isCreating?: boolean;
  editingLocation?: any;
  isCreateLoading?: boolean;
  isUpdateLoading?: boolean;
  isDeleteLoading?: boolean;
  onDelete?: (id: string) => void;
}

// Dynamic import for the actual map component to avoid SSR issues
const DynamicMapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-md border border-input bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Chargement de la carte...</div>
    </div>
  ),
});

export function MapPicker({
  latitude,
  longitude,
  onCoordinatesChange,
  onLocationAdd,
  onLocationDelete,
  onLocationEdit,
  onLocationCreate,
  onLocationUpdate,
  isLocationAdded = false,
  locationName,
  locations = [],
  className = "",
  form,
  onSubmit,
  onCancel,
  isCreating = false,
  editingLocation,
  isCreateLoading = false,
  isUpdateLoading = false,
  isDeleteLoading = false,
  onDelete,
}: MapPickerProps) {
  const handlePositionChange = (lat: number, lng: number) => {
    onCoordinatesChange(lat, lng);
  };

  return (
    <div className={className}>
      <DynamicMapComponent
        latitude={latitude}
        longitude={longitude}
        onCoordinatesChange={handlePositionChange}
        onLocationAdd={onLocationAdd}
        onLocationDelete={onLocationDelete}
        onLocationEdit={onLocationEdit}
        onLocationCreate={onLocationCreate}
        onLocationUpdate={onLocationUpdate}
        isLocationAdded={isLocationAdded}
        locationName={locationName}
        locations={locations}
        form={form}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isCreating={isCreating}
        editingLocation={editingLocation}
        isCreateLoading={isCreateLoading}
        isUpdateLoading={isUpdateLoading}
        isDeleteLoading={isDeleteLoading}
        onDelete={onDelete}
      />
    </div>
  );
}
