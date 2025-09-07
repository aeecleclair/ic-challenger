"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
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
import { MapPicker } from "@/src/components/ui/map-picker";
import { locationSchema, LocationFormData } from "@/src/forms/location";
import { LocationComplete } from "@/src/api/hyperionSchemas";

interface LocationsFormProps {
  onSubmit: (data: LocationFormData) => void;
  isLoading?: boolean;
  defaultValues?: LocationComplete;
  submitText?: string;
}

export function LocationsForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  submitText = "Créer le lieu",
}: LocationsFormProps) {
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      address: defaultValues?.address || "",
      latitude: defaultValues?.latitude || undefined,
      longitude: defaultValues?.longitude || undefined,
    },
  });

  const handleSubmit = (data: LocationFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du lieu</FormLabel>
              <FormControl>
                <Input placeholder="Entrez le nom du lieu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Entrez une description du lieu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Entrez l'adresse du lieu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Map Picker for Coordinates */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Localisation
          </label>
          <MapPicker
            latitude={form.watch("latitude")}
            longitude={form.watch("longitude")}
            onCoordinatesChange={(lat, lng) => {
              form.setValue("latitude", lat);
              form.setValue("longitude", lng);
            }}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Chargement..." : submitText}
        </Button>
      </form>
    </Form>
  );
}
