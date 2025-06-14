import { StyledFormField } from "../../custom/StyledFormField";
import { Label } from "../../ui/label";
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
            <SelectTrigger className="w-full lg:w-1/2">
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
        label="Sport"
        id="sport.team"
        input={(field) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full  lg:w-1/2">
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

      <StyledFormField
        form={form}
        label="Numéro de licence"
        id="sport.license_number"
        input={(field) => <Input {...field} className=" lg:w-1/2 w-full" />}
      />
    </CardTemplate>
  );
};
