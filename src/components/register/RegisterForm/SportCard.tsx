import { StyledFormField } from "../../custom/StyledFormField";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { registeringFormSchema } from "@/src/forms/registering";
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
import { FormMessage } from "../../ui/form";
import { Button } from "../../ui/button";
import { LoadingButton } from "../../custom/LoadingButton";
import { HiDownload } from "react-icons/hi";
import { DocumentDialog } from "../../custom/DocumentDialog";

interface SportCardProps {
  form: UseFormReturn<z.infer<typeof registeringFormSchema>>;
  sports: { id: string; name: string }[];
}

export const SportCard = ({ form, sports }: SportCardProps) => {
  return (
    <CardTemplate>
      <h2 className="text-xl font-semibold">Ta participation au Challenge :</h2>
      <StyledFormField
        form={form}
        label="Sport"
        id="sport.id"
        input={(field) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full lg:w-2/3">
              <SelectValue placeholder="Sélectionnez un sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <StyledFormField
        form={form}
        label="Catégorie"
        id="sport.sex"
        input={(field) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="masculin" id="masculin" />
              <Label htmlFor="masculin">Masculin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="féminin" id="féminin" />
              <Label htmlFor="féminin">Féminin</Label>
            </div>
          </RadioGroup>
        )}
      />

      <StyledFormField
        form={form}
        label="Sport"
        id="sport.team"
        input={(field) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full  lg:w-2/3">
              <SelectValue placeholder="Équipe" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

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

      <div className="flex flex-col gap-4 lg:flex-row w-2/3">
        <StyledFormField
          form={form}
          label="Numéro de licence"
          id="sport.license_number"
          input={(field) => <Input {...field} className="w-full" />}
        />
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
                    ) : ( */}
                      <span className="font-semibold mr-6">
                        Choisir un fichier
                      </span>
                      {/* )}
                  </> */}
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-2xl top-1/2">
                  <DialogHeader>
                    <DialogTitle className="text-red sm:text-lg">
                      {/* {label} */}
                    </DialogTitle>
                  </DialogHeader>
                  {/* <DocumentDialog
                setIsOpen={setIsOpen}
                setIsUploading={setIsUploading}
                field={field}
                fileType={id}
                documentId={field.value?.id}
                participantId={participantId!}
              /> */}
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
          )} */}
            </div>
          )}
        />
      </div>
    </CardTemplate>
  );
};
