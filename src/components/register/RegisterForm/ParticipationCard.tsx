import { StyledFormField } from "../../custom/StyledFormField";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { registeringFormSchema } from "@/src/forms/registering";
import { CardTemplate } from "./CardTemplate";

interface ParticipationCardProps {
  form: UseFormReturn<z.infer<typeof registeringFormSchema>>;
  onChange: (value: string) => void;
}

export const ParticipationCard = ({ form, onChange }: ParticipationCardProps) => {
  return (
    <CardTemplate>
      <h2 className="text-xl font-semibold">Ta participation au Challenge :</h2>
      <StyledFormField
        form={form}
        id="status"
        input={(field) => (
          <RadioGroup
            onValueChange={(value) => {
                field.onChange(value);
                onChange(value);
            }}
            defaultValue={field.value}
            value={field.value}
            className="grid gap-8 mt-8 w-full lg:w-2/3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sport" id="sport" />
              <Label htmlFor="sport">Sportif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cheerleader" id="cheerleader" />
              <Label htmlFor="cheerleader">Cheerleader</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fanfaron" id="fanfaron" />
              <Label htmlFor="fanfaron">Fanfaron</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cameraman" id="cameraman" />
              <Label htmlFor="cameraman">Caméraman</Label>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="volunteer" id="volunteer" />
                <Label htmlFor="volunteer">Bénévole</Label>
              </div>
              <p className="text-md text-muted-foreground ml-6 mt-2">
                Ta place à la soirée du samedi te sera remboursé si tu remplis
                ton quota d&apos;heures de bénévolat
              </p>
            </div>
          </RadioGroup>
        )}
      />
    </CardTemplate>
  );
};
