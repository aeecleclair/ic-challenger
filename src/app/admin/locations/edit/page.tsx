"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LocationsForm } from "@/src/components/admin/locations/LocationsForm";
import { useLocations } from "@/src/hooks/useLocations";
import { LocationFormData } from "@/src/forms/location";
import { useGetCompetitionLocationsLocationId } from "@/src/api/hyperionComponents";
import { useAuth } from "@/src/hooks/useAuth";

export default function EditLocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationId = searchParams.get("location_id");
  const { token } = useAuth();

  const { updateLocation, isUpdateLoading } = useLocations();

  const { data: location, isLoading } = useGetCompetitionLocationsLocationId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        locationId: locationId!,
      },
    },
    {
      enabled: !!locationId && !!token,
    },
  );

  const handleSubmit = (data: LocationFormData) => {
    if (locationId) {
      updateLocation(locationId, data, () => {
        router.push("/admin/locations");
      });
    }
  };

  const handleBack = () => {
    router.push("/admin/locations");
  };

  if (!locationId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-destructive">ID du lieu manquant</p>
          <Button onClick={handleBack} className="mt-4">
            Retour aux lieux
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Modifier le lieu</h1>
        </div>
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-destructive">Lieu non trouvé</p>
          <Button onClick={handleBack} className="mt-4">
            Retour aux lieux
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Modifier le lieu</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <LocationsForm
            onSubmit={handleSubmit}
            isLoading={isUpdateLoading}
            defaultValues={location}
            submitText="Modifier le lieu"
          />
        </div>
      </div>
    </div>
  );
}
