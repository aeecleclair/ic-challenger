import { StyledFormField } from "../../custom/StyledFormField";
import { Input } from "../../ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisteringFormValues } from "@/src/forms/registering";
import { useUser } from "@/src/hooks/useUser";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { CardTemplate } from "./CardTemplate";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

interface InformationCardProps {
  form: UseFormReturn<RegisteringFormValues>;
}

export const InformationCard = ({ form }: InformationCardProps) => {
  const { me } = useUser();

  return (
    <CardTemplate>
      <h2 className="text-xl font-semibold">
        Complément d&apos;information te concernant
      </h2>
      <div
        className="w-full grid gap-8 lg:gap-12"
        style={{ gridTemplateRows: "auto 1fr" }}
      >
        <StyledFormField
          form={form}
          label="Numéro de téléphone"
          id="phone"
          input={(field) => (
            <Input className="w-60" placeholder="+33 6 12 34 56 78" {...field} />
          )}
        />

        <StyledFormField
          form={form}
          label="Catégorie sportive"
          id="sex"
          input={(field) => (
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="masculine" id="masculine" />
                <Label htmlFor="masculine">Masculin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feminine" id="feminine" />
                <Label htmlFor="feminine">Féminin</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <div className="text-md text-muted-foreground">
        <p>
          D&apos;après les informations fournies, tu es élève à l&apos;École{" "}
          <span className="font-semibold">
            {formatSchoolName(me?.school?.name)}
          </span>
        </p>
        <p>Si ce n&apos;est pas le cas, contactes ton BDS.</p>
      </div>
    </CardTemplate>
  );
};
