"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  volunteerShiftFormSchema,
  VolunteerShiftFormSchema,
} from "../../../forms/volunteerShift";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { LoadingButton } from "../../custom/LoadingButton";
import { DateTimePicker } from "../../custom/DateTimePicker";
import { useVolunteerShifts } from "../../../hooks/useVolunteerShifts";
import { useLocations } from "../../../hooks/useLocations";
import {
  VolunteerShiftComplete,
  VolunteerShiftBase,
} from "../../../api/hyperionSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface VolunteerShiftFormProps {
  shiftId?: string | null;
  prefilledDate?: Date | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VolunteerShiftForm({
  shiftId,
  prefilledDate,
  onClose,
  onSuccess,
}: VolunteerShiftFormProps) {
  const {
    volunteerShifts,
    createVolunteerShift,
    updateVolunteerShift,
    isCreateLoading,
    isUpdateLoading,
  } = useVolunteerShifts();

  const isEditing = !!shiftId;
  const shift = isEditing
    ? volunteerShifts?.find((s: VolunteerShiftComplete) => s.id === shiftId)
    : null;

  const form = useForm<VolunteerShiftFormSchema>({
    resolver: zodResolver(volunteerShiftFormSchema),
    defaultValues: {
      name: shift?.name || "",
      description: shift?.description || "",
      value: shift?.value || 1,
      start_time: shift
        ? new Date(shift.start_time)
        : prefilledDate || new Date(),
      end_time: shift
        ? new Date(shift.end_time)
        : new Date((prefilledDate || new Date()).getTime() + 60 * 60 * 1000), // 2 hours later
      location: shift?.location || "",
      max_volunteers: shift?.max_volunteers || 5,
    },
  });

  const onSubmit = (data: VolunteerShiftFormSchema) => {
    const shiftData: VolunteerShiftBase = {
      name: data.name,
      description: data.description || null,
      value: data.value,
      start_time: data.start_time.toISOString(),
      end_time: data.end_time.toISOString(),
      location: data.location,
      max_volunteers: data.max_volunteers,
    };

    if (isEditing && shiftId) {
      updateVolunteerShift(shiftId, shiftData, onSuccess);
    } else {
      createVolunteerShift(shiftData, onSuccess);
    }
  };

  const isLoading = isCreateLoading || isUpdateLoading;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le créneau" : "Nouveau créneau bénévole"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nom du créneau *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Accueil des participants"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description détaillée du créneau..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        fromDate={new Date()}
                        toDate={
                          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                        } // 1 year from now
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        fromDate={new Date()}
                        toDate={
                          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                        } // 1 year from now
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: W1bis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_volunteers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum de bénévoles *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Valeur en points *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                {isEditing ? "Modifier" : "Créer"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
