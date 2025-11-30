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
import {
  TeamSportResultComplete,
  SchoolResult,
} from "@/src/api/hyperionSchemas";
import { RankingRow } from "./RankingRow";
import { PompomsPodiumForm } from "./PompomsPodiumForm";
import { usePodiums } from "@/src/hooks/usePodiums";
import { usePompomsPodiums } from "@/src/hooks/usePompomsPodiums";

interface PodiumRankingsFormProps {
  sportId: string;
  isLoading?: boolean;
  onClose: () => void;
}

export function PodiumRankingsForm({
  sportId,
  isLoading = false,
  onClose,
}: PodiumRankingsFormProps) {
  const isPompoms = sportId === "pompoms";

  // Hooks for regular sports
  const {
    sportPodium,
    createOrUpdateSportPodium,
    deleteSportPodium,
    isUpdateLoading: isRegularUpdateLoading,
    isDeleteLoading: isRegularDeleteLoading,
  } = usePodiums({ sportId: isPompoms ? undefined : sportId });

  // Hooks for pompoms
  const {
    pompomsResults,
    createOrUpdatePompomsPodium,
    deletePompomsPodium,
    isUpdateLoading: isPompomsUpdateLoading,
    isDeleteLoading: isPompomsDeleteLoading,
  } = usePompomsPodiums();

  const form = useForm<PodiumRankingsFormData>({
    resolver: zodResolver(podiumRankingsSchema),
    defaultValues: {
      rankings:
        !isPompoms && sportPodium?.length
          ? sportPodium.map((result) => ({
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

  const handleRegularSportSubmit = (data: PodiumRankingsFormData) => {
    createOrUpdateSportPodium(sportId, data, () => {
      onClose();
    });
  };

  const handlePompomsSubmit = (rankings: SchoolResult[]) => {
    createOrUpdatePompomsPodium(rankings, () => {
      onClose();
    });
  };

  const handleDelete = () => {
    if (isPompoms) {
      deletePompomsPodium(() => {
        onClose();
      });
    } else {
      deleteSportPodium(sportId, () => {
        onClose();
      });
    }
  };

  const addRanking = () => {
    append({
      school_id: "",
      sport_id: sportId,
      team_id: "",
      points: 0,
    });
  };

  const currentIsLoading = isPompoms
    ? isPompomsUpdateLoading
    : isRegularUpdateLoading;
  const currentIsDeleteLoading = isPompoms
    ? isPompomsDeleteLoading
    : isRegularDeleteLoading;

  // For pompoms, use the dedicated form
  if (isPompoms) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Gestion du podium Pompoms</h2>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={currentIsDeleteLoading}
            >
              {currentIsDeleteLoading
                ? "Suppression..."
                : "Supprimer le podium"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </div>

        <PompomsPodiumForm
          onSubmit={handlePompomsSubmit}
          isLoading={currentIsLoading}
          defaultValues={pompomsResults}
          submitText="Mettre à jour le podium"
        />
      </div>
    );
  }

  // For regular sports, use the team-based form
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestion du podium</h2>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={currentIsDeleteLoading}
          >
            {currentIsDeleteLoading ? "Suppression..." : "Supprimer le podium"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegularSportSubmit)}
          className="space-y-6"
        >
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
            <Button
              type="submit"
              disabled={currentIsLoading}
              className="w-full"
            >
              {currentIsLoading ? "Chargement..." : "Mettre à jour le podium"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
