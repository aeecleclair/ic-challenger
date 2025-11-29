"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { SchoolResult } from "@/src/api/hyperionSchemas";
import { useSchools } from "@/src/hooks/useSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Trash2, Plus } from "lucide-react";

// Custom type for pompoms ranking with rank information
type PompomsRanking = {
  rank: number;
  school_id: string;
  points: number;
};

interface PompomsPodiumFormProps {
  onSubmit: (rankings: SchoolResult[]) => void;
  isLoading: boolean;
  defaultValues?: SchoolResult[];
  submitText?: string;
}

export function PompomsPodiumForm({
  onSubmit,
  isLoading,
  defaultValues = [],
  submitText = "Mettre à jour",
}: PompomsPodiumFormProps) {
  const { schools } = useSchools();
  const [rankings, setRankings] = useState<PompomsRanking[]>([]);

  useEffect(() => {
    if (defaultValues && defaultValues.length > 0) {
      // Convert SchoolResult to PompomsRanking
      const pompomsRankings = defaultValues.map((result, index) => ({
        rank: index + 1,
        school_id: result.school_id,
        points: result.total_points,
      }));
      setRankings(pompomsRankings.sort((a, b) => a.rank - b.rank));
    } else {
      // Initialize with empty rankings
      setRankings([]);
    }
  }, [defaultValues]);

  const addRanking = () => {
    const nextRank =
      rankings.length > 0 ? Math.max(...rankings.map((r) => r.rank)) + 1 : 1;
    setRankings([
      ...rankings,
      {
        rank: nextRank,
        school_id: "",
        points: 0,
      },
    ]);
  };

  const removeRanking = (index: number) => {
    setRankings(rankings.filter((_, i) => i !== index));
  };

  const updateRanking = (
    index: number,
    field: keyof PompomsRanking,
    value: string | number,
  ) => {
    const newRankings = [...rankings];
    newRankings[index] = {
      ...newRankings[index],
      [field]: field === "points" || field === "rank" ? Number(value) : value,
    };
    setRankings(newRankings);
  };

  const handleSubmit = () => {
    // Filter out invalid entries and sort by rank
    const validRankings = rankings
      .filter((r) => r.school_id && r.rank > 0)
      .sort((a, b) => a.rank - b.rank);

    // Convert to SchoolResult format
    const schoolResults: SchoolResult[] = validRankings.map((ranking) => ({
      school_id: ranking.school_id,
      total_points: ranking.points,
    }));

    onSubmit(schoolResults);
  };

  const isFormValid = rankings.every(
    (r) => r.school_id && r.rank > 0 && r.points >= 0,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Classement Pompoms</h3>
          <Button onClick={addRanking} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une école
          </Button>
        </div>

        {rankings.map((ranking, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 items-end">
            <div>
              <Label>Rang</Label>
              <Input
                type="number"
                min="1"
                value={ranking.rank}
                onChange={(e) =>
                  updateRanking(index, "rank", parseInt(e.target.value) || 1)
                }
              />
            </div>
            <div>
              <Label>École</Label>
              <Select
                value={ranking.school_id}
                onValueChange={(value) =>
                  updateRanking(index, "school_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une école" />
                </SelectTrigger>
                <SelectContent>
                  {schools
                    ?.filter(
                      (school) =>
                        !rankings.some(
                          (r, i) => i !== index && r.school_id === school.id,
                        ),
                    )
                    .map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {formatSchoolName(school.name)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Points</Label>
              <Input
                type="number"
                min="0"
                value={ranking.points}
                onChange={(e) =>
                  updateRanking(index, "points", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeRanking(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {rankings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun classement configuré</p>
            <p className="text-sm">
              Cliquez sur &quot;Ajouter une école&quot; pour commencer
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <LoadingButton
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!isFormValid || rankings.length === 0}
        >
          {submitText}
        </LoadingButton>
      </div>
    </div>
  );
}
