import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { DatePicker } from "@/src/components/custom/DatePicker";
import { useSports } from "@/src/hooks/useSports";
import { useEdition } from "@/src/hooks/useEdition";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useEffect, useState } from "react";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

// Form schema
export const matchFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  sport_id: z.string().min(1, "Le sport est requis"),
  team1_id: z.string().min(1, "L'équipe 1 est requise"),
  team2_id: z.string().min(1, "L'équipe 2 est requise"),
  date: z.date().optional(),
  location_id: z.string().optional(),
  score_team1: z.number().int().optional(),
  score_team2: z.number().int().optional(),
  winner_id: z.string().optional(),
  edition_id: z.string().min(1, "L'édition est requise"),
});

export type MatchFormValues = z.infer<typeof matchFormSchema>;

interface MatchesFormProps {
  form: UseFormReturn<MatchFormValues>;
  onSubmit: (values: MatchFormValues) => void;
  isLoading: boolean;
  submitLabel: string;
  isEditing?: boolean;
}

export const MatchesForm = ({
  form,
  onSubmit,
  isLoading,
  submitLabel,
  isEditing = false,
}: MatchesFormProps) => {
  const { sports } = useSports();
  const { edition } = useEdition();
  const { sportSchools } = useSportSchools();

  const [selectedSport, setSelectedSport] = useState<string | null>(
    form.getValues("sport_id") || null,
  );

  const [schoolOptions, setSchoolOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [team1SchoolId, setTeam1SchoolId] = useState<string | null>(null);
  const [team2SchoolId, setTeam2SchoolId] = useState<string | null>(null);

  const { teams: team1Options } = useSchoolSportTeams({
    schoolId: team1SchoolId || undefined,
    sportId: selectedSport || undefined,
  });

  const { teams: team2Options } = useSchoolSportTeams({
    schoolId: team2SchoolId || undefined,
    sportId: selectedSport || undefined,
  });

  // Populate edition_id if not already set
  useEffect(() => {
    if (edition && !form.getValues("edition_id")) {
      form.setValue("edition_id", edition.id);
    }
  }, [edition, form]);

  // Update school options when sport changes
//   useEffect(() => {
//     if (selectedSport && sportSchools) {
//         const schools = sportSchools.filter(
//             (school) => school.sport_id === selectedSport,
//         );

//       setSchoolOptions(
//         schools.map((school) => ({
//           id: school.school_id,
//           name: formatSchoolName(school.school.name) ?? "",
//         })),
//       );
//     }
//   }, [selectedSport, sportSchools]);

  // Reset teams when sport changes
  useEffect(() => {
    if (selectedSport && !isEditing) {
      form.setValue("team1_id", "");
      form.setValue("team2_id", "");
      setTeam1SchoolId(null);
      setTeam2SchoolId(null);
    }
  }, [selectedSport, form, isEditing]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du match</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Finale basketball" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sport_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport</FormLabel>
                <Select
                  disabled={isEditing}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSport(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un sport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sports?.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedSport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="team1_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Équipe 1</FormLabel>
                    <div className="space-y-2">
                      <Select
                        onValueChange={setTeam1SchoolId}
                        value={team1SchoolId || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une école" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schoolOptions.map((school) => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {team1SchoolId && (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une équipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {team1Options?.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="score_team1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score équipe 1</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Score"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined;
                          field.onChange(value);
                        }}
                        value={field.value === undefined ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="team2_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Équipe 2</FormLabel>
                    <div className="space-y-2">
                      <Select
                        onValueChange={setTeam2SchoolId}
                        value={team2SchoolId || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une école" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schoolOptions.map((school) => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {team2SchoolId && (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une équipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {team2Options?.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="score_team2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score équipe 2</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Score"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined;
                          field.onChange(value);
                        }}
                        value={field.value === undefined ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date et heure du match</FormLabel>
                <DatePicker date={field.value} setDate={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu</FormLabel>
                <FormControl>
                  <Input placeholder="Lieu du match" {...field} />
                </FormControl>
                <FormDescription>
                  Indiquez le lieu où se déroulera le match
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isEditing &&
          form.getValues("score_team1") !== undefined &&
          form.getValues("score_team2") !== undefined && (
            <FormField
              control={form.control}
              name="winner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Équipe gagnante</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'équipe gagnante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Aucune (match nul)</SelectItem>
                      <SelectItem value={form.getValues("team1_id")}>
                        Équipe 1 (
                        {team1Options?.find(
                          (t) => t.id === form.getValues("team1_id"),
                        )?.name || "Équipe 1"}
                        )
                      </SelectItem>
                      <SelectItem value={form.getValues("team2_id")}>
                        Équipe 2 (
                        {team2Options?.find(
                          (t) => t.id === form.getValues("team2_id"),
                        )?.name || "Équipe 2"}
                        )
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

        <LoadingButton type="submit" isLoading={isLoading}>
          {submitLabel}
        </LoadingButton>
      </form>
    </Form>
  );
};
