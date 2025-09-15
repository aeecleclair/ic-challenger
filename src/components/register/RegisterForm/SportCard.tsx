import { StyledFormField } from "../../custom/StyledFormField";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import {
  registeringFormSchema,
  RegisteringFormValues,
} from "@/src/forms/registering";
import { CardTemplate } from "./CardTemplate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { FormControl, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Button } from "../../ui/button";
import { LoadingButton } from "../../custom/LoadingButton";
import { HiDownload } from "react-icons/hi";
// import { DocumentDialog } from "../../custom/DocumentDialog";
import { Sport, TeamInfo } from "@/src/api/hyperionSchemas";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useUser } from "@/src/hooks/useUser";
import { useState } from "react";

interface SportCardProps {
  form: UseFormReturn<RegisteringFormValues>;
  sports?: Sport[];
}

export const SportCard = ({ form, sports }: SportCardProps) => {
  const { me } = useUser();

  const [teamName, setTeamName] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { teams, createSchoolSportTeam, isCreateLoading } = useSchoolSportTeams(
    {
      schoolId: me?.school?.id,
      sportId: form.watch("sport.id"),
    },
  );

  const createTeam = (name: string) => {
    const body: TeamInfo = {
      name,
      sport_id: form.watch("sport.id")!,
      school_id: me?.school?.id!,
      captain_id: me?.id!,
    };
    createSchoolSportTeam(body, (team) => {
      form.setValue("sport.team_id", team.id);
      setDisabled(true);
    });
  };

  const selectedSport = sports?.find(
    (sport) => sport.id === form.watch("sport.id"),
  );

  const userSportCategories = form.watch("sex");

  return (
    <CardTemplate>
      <h2 className="text-xl font-semibold">Ta participation au Challenge :</h2>
      <StyledFormField
        form={form}
        label="Sport"
        id="sport.id"
        input={(field) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Sélectionnez un sport" />
            </SelectTrigger>
            {sports && (
              <SelectContent>
                {sports
                  .filter(
                    (sport) =>
                      sport.sport_category === null ||
                      sport.sport_category === undefined ||
                      sport.sport_category === userSportCategories,
                  )
                  .map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            )}
          </Select>
        )}
      />

      {(selectedSport?.team_size ?? 0) > 1 && (
        <>
          <StyledFormField
            form={form}
            label="Capitaine d'équipe"
            id="sport.team_leader"
            input={(field) => (
              <div className="flex items-center space-x-2 pt-2 ">
                <Checkbox
                  id="sport.team_leader"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="sport.team_leader">
                  Je suis capitaine d&apos;équipe
                </Label>
              </div>
            )}
          />

          {form.watch("sport.team_leader") ? (
            <FormItem className="w-full">
              <div className="grid gap-2">
                <FormLabel className="text-base">
                  Création de l&apos;équipe
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4 lg:flex-row w-2/3">
                    <Input
                      placeholder="Nom de l'équipe"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-60"
                    />
                    <LoadingButton
                      variant="outline"
                      className="w-60"
                      onClick={() => createTeam(teamName)}
                      disabled={
                        !form.watch("sport.team_leader") ||
                        teamName.length === 0 ||
                        disabled
                      }
                      isLoading={isCreateLoading}
                    >
                      Ajouter l&apos;équipe
                    </LoadingButton>
                  </div>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          ) : (
            <div className="flex flex-col gap-4 lg:flex-row w-2/3">
              <StyledFormField
                form={form}
                label="Équipe"
                id="sport.team_id"
                input={(field) =>
                  teams && teams.length !== 0 ? (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-60">
                        <SelectValue placeholder="Sélectionnez une équipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>Aucune équipe enregistrée pour ce sport.</p>
                  )
                }
              />
              <StyledFormField
                form={form}
                label="Remplaçant d'équipe"
                id="sport.substitute"
                input={(field) => (
                  <div className="flex items-center space-x-2 pt-2 ">
                    <Checkbox
                      id="sport.substitute"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="sport.substitute">Je suis remplaçant</Label>
                  </div>
                )}
              />
            </div>
          )}
        </>
      )}

      <div className="flex flex-col gap-4 lg:flex-row w-2/3">
        <StyledFormField
          form={form}
          label="Numéro de licence"
          id="sport.license_number"
          input={(field) => <Input {...field} className="w-60" />}
        />
        {/*
        <StyledFormField
          form={form}
          label="Certificat médical"
          id="sport.license_number"
          input={(field) => (
            <div className="col-span-4 gap-2 grid grid-cols-3">
              <Dialog>
                <FormMessage />
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={"col-span-3"}
                    // disabled={isUploading}
                  >
                    <div className="flex flex-row items-start w-full">
                      {/* <>
                    {field.value?.name ? (
                      <span className="text-gray-500 overflow-hidden">
                        {field.value.name ?? "Aucun fichier séléctionné"}
                      </span>
                    ) : ( 
                      <span className="font-semibold mr-6">
                        Choisir un fichier
                      </span>
                      {/* )}
                  </> 
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-2xl top-1/2">
                  <DialogHeader>
                    <DialogTitle className="text-red sm:text-lg">
                      {/* {label} 
                    </DialogTitle>
                  </DialogHeader>
                  {/* <DocumentDialog
                setIsOpen={setIsOpen}
                setIsUploading={setIsUploading}
                field={field}
                fileType={id}
                documentId={field.value?.id}
                participantId={participantId!}
              /> 
                </DialogContent>
              </Dialog>
              {/* {id === "raidRules" && !!information?.raid_rules_id && (
            <LoadingButton
              variant="outline"
              className="col-span-1"
              type="button"
              onClick={(_) => downloadRaidRules(information.raid_rules_id!)}
              isLoading={isFileLoading}
              label={
                <>
                  <HiDownload className="mr-2" />
                  Télécharger
                </>
              }
            />
          )} 
            </div>
          )}
        />
        */}
      </div>
    </CardTemplate>
  );
};
