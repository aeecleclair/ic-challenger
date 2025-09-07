"use client";

import { Button } from "@/src/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Trash2 } from "lucide-react";
import { useSchools } from "@/src/hooks/useSchools";
import { useTeams } from "@/src/hooks/useTeams";

interface RankingRowProps {
  form: any;
  field: any;
  index: number;
  sportId: string;
  onRemove: () => void;
  showRemove: boolean;
}

export function RankingRow({
  form,
  field,
  index,
  sportId,
  onRemove,
  showRemove,
}: RankingRowProps) {
  const schoolId = form.watch(`rankings.${index}.school_id`);
  const { teams } = useTeams({ sportId, schoolId });
  const { schools } = useSchools();

  return (
    <div key={field.id} className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Résultat #{index + 1}</h4>
        {showRemove && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`rankings.${index}.school_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>École</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset team_id when school changes
                  form.setValue(`rankings.${index}.team_id`, "");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une école" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schools?.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`rankings.${index}.team_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Équipe</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!schoolId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        schoolId
                          ? "Sélectionnez une équipe"
                          : "Sélectionnez d'abord une école"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`rankings.${index}.points`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Points</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                placeholder="0"
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hidden sport_id field */}
      <FormField
        control={form.control}
        name={`rankings.${index}.sport_id`}
        render={({ field }) => (
          <input type="hidden" {...field} value={sportId} />
        )}
      />
    </div>
  );
}
