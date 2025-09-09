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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Badge } from "@/src/components/ui/badge";
import { DatePicker } from "@/src/components/custom/DatePicker";
import { DateTimePicker } from "@/src/components/custom/DateTimePicker";
import { useSports } from "@/src/hooks/useSports";
import { useEdition } from "@/src/hooks/useEdition";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useLocations } from "@/src/hooks/useLocations";
import { useEffect, useState } from "react";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { MatchFormValues } from "@/src/forms/match";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Target,
  School,
  Gamepad2,
  Flag,
} from "lucide-react";

interface MatchesFormProps {
  form: UseFormReturn<MatchFormValues>;
  onSubmit: (values: MatchFormValues) => void;
  isLoading: boolean;
  submitLabel: string;
  isEditing?: boolean;
  onSportChange?: (sportId: string) => void;
}

export const MatchesForm = ({
  form,
  onSubmit,
  isLoading,
  submitLabel,
  isEditing = false,
  onSportChange,
}: MatchesFormProps) => {
  const { sports } = useSports();
  const { edition } = useEdition();
  const { sportSchools } = useSportSchools();
  const { locations } = useLocations();

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
  useEffect(() => {
    if (selectedSport && sportSchools) {
      const schoolsForSport = sportSchools.filter(
        (school) => school.active === true,
      );

      setSchoolOptions(
        schoolsForSport.map((school) => ({
          id: school.school_id,
          name: school.school.name,
        })),
      );
    } else {
      setSchoolOptions([]);
    }
  }, [selectedSport, sportSchools]);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Informations du match
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      Nom du match
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Finale basketball"
                        {...field}
                        className="h-11"
                      />
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
                    <FormLabel className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Sport
                    </FormLabel>
                    <Select
                      disabled={isEditing}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedSport(value);
                        onSportChange?.(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
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
                    {isEditing && (
                      <FormDescription>
                        Le sport ne peut pas être modifié après création
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Teams Selection Card */}
        {selectedSport ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Sélection des équipes
              </CardTitle>
              <FormDescription>
                Choisissez les écoles et leurs équipes qui s&apos;affronteront
              </FormDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team 1 Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Équipe 1
                    </Badge>
                  </div>
                  <FormField
                    control={form.control}
                    name="team1_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <FormLabel className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            École
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              setTeam1SchoolId(value === "none" ? null : value)
                            }
                            value={team1SchoolId || "none"}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Sélectionnez une école" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                Sélectionnez une école
                              </SelectItem>
                              {schoolOptions.map((school) => (
                                <SelectItem key={school.id} value={school.id}>
                                  {school.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {team1SchoolId && (
                            <div className="space-y-2">
                              <FormLabel className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Équipe
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
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
                            </div>
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
                        <FormLabel className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Score équipe 1
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Score"
                            {...field}
                            className="h-11"
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : undefined;
                              field.onChange(value);
                            }}
                            value={field.value === undefined ? "" : field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Optionnel - peut être ajouté après le match
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Team 2 Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Équipe 2
                    </Badge>
                  </div>
                  <FormField
                    control={form.control}
                    name="team2_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <FormLabel className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            École
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              setTeam2SchoolId(value === "none" ? null : value)
                            }
                            value={team2SchoolId || "none"}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Sélectionnez une école" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                Sélectionnez une école
                              </SelectItem>
                              {schoolOptions.map((school) => (
                                <SelectItem key={school.id} value={school.id}>
                                  {school.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {team2SchoolId && (
                            <div className="space-y-2">
                              <FormLabel className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Équipe
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
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
                            </div>
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
                        <FormLabel className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Score équipe 2
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Score"
                            {...field}
                            className="h-11"
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : undefined;
                              field.onChange(value);
                            }}
                            value={field.value === undefined ? "" : field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Optionnel - peut être ajouté après le match
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Sélectionnez d&apos;abord un sport
              </h3>
              <p className="text-sm text-muted-foreground">
                Vous devez choisir un sport avant de pouvoir sélectionner les
                équipes
              </p>
            </CardContent>
          </Card>
        )}

        {/* Schedule & Location Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Programmation du match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date et heure du match
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        fromDate={new Date()}
                        timeLabel="Heure du match"
                        timeId="match-time"
                      />
                    </FormControl>
                    <FormDescription>
                      Sélectionnez la date et l&apos;heure prévues pour le match
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Lieu
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? undefined : value)
                      }
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Sélectionnez un lieu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          Aucun lieu spécifié
                        </SelectItem>
                        {locations?.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choisissez le lieu où se déroulera le match
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Winner Selection Card - Only for editing with scores */}
        {isEditing &&
          form.getValues("score_team1") !== undefined &&
          form.getValues("score_team2") !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Résultat du match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="winner_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        Équipe gagnante
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? undefined : value)
                        }
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Sélectionnez l'équipe gagnante" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            Aucune (match nul)
                          </SelectItem>
                          <SelectItem value={form.getValues("team1_id")}>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700"
                              >
                                Équipe 1
                              </Badge>
                              {team1Options?.find(
                                (t) => t.id === form.getValues("team1_id"),
                              )?.name || "Équipe 1"}
                            </div>
                          </SelectItem>
                          <SelectItem value={form.getValues("team2_id")}>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700"
                              >
                                Équipe 2
                              </Badge>
                              {team2Options?.find(
                                (t) => t.id === form.getValues("team2_id"),
                              )?.name || "Équipe 2"}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Sélectionnez l&apos;équipe qui a remporté le match
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

        {/* Submit Section */}
        <div className="flex justify-end pt-4">
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            className="h-11 px-8 font-medium"
            size="lg"
          >
            {submitLabel}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
