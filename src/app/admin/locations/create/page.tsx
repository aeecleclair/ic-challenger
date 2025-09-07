"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LocationsForm } from "@/src/components/admin/locations/LocationsForm";
import { useLocations } from "@/src/hooks/useLocations";
import { LocationFormData } from "@/src/forms/location";

export default function CreateLocationPage() {
  const router = useRouter();
  const { createLocation, isCreateLoading } = useLocations();

  const handleSubmit = (data: LocationFormData) => {
    createLocation(data, () => {
      router.push("/admin/locations");
    });
  };

  const handleBack = () => {
    router.push("/admin/locations");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Créer un nouveau lieu</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <LocationsForm
            onSubmit={handleSubmit}
            isLoading={isCreateLoading}
            submitText="Créer le lieu"
          />
        </div>
      </div>
    </div>
  );
}
