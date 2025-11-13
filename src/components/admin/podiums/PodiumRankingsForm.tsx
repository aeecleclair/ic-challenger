"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import {
  podiumRankingsSchema,
  PodiumRankingsFormData,
} from "@/src/forms/podium";
import { Plus } from "lucide-react";
import { TeamSportResultComplete } from "@/src/api/hyperionSchemas";
import { RankingRow } from "./RankingRow";

interface PodiumRankingsFormProps {
  onSubmit: (data: PodiumRankingsFormData) => void;
  isLoading?: boolean;
  defaultValues?: TeamSportResultComplete[];
  sportId: string;
  submitText?: string;
}

export function PodiumRankingsForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  sportId,
  submitText = "Mettre à jour le podium",
}: PodiumRankingsFormProps) {
  const form = useForm<PodiumRankingsFormData>({
    resolver: zodResolver(podiumRankingsSchema),
    defaultValues: {
      rankings: defaultValues?.length
        ? defaultValues.map((result) => ({
            school_id: result.school_id,
            sport_id: result.sport_id,
            team_id: result.team_id,
            points: result.points,
          }))
        : [
            {
              school_id: "",
              sport_id: sportId,
              team_id: "",
              points: 0,
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rankings",
  });

  const handleSubmit = (data: PodiumRankingsFormData) => {
    onSubmit(data);
  };

  const addRanking = () => {
    append({
      school_id: "",
      sport_id: sportId,
      team_id: "",
      points: 0,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Classements du Podium</h3>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <RankingRow
                key={field.id}
                form={form}
                field={field}
                index={index}
                sportId={sportId}
                onRemove={() => remove(index)}
                showRemove={fields.length > 1}
              />
            ))}
          </div>

          {/* Add new ranking button */}
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={addRanking}
              className="border-dashed border-2 w-full py-6 text-muted-foreground hover:text-foreground hover:border-solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une nouvelle position au classement
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Chargement..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
