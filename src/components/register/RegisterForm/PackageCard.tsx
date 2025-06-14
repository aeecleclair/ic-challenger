import { StyledFormField } from "../../custom/StyledFormField";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
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

interface PackageCardProps {
  form: UseFormReturn<z.infer<typeof registeringFormSchema>>;
}

export const PackageCard = ({ form }: PackageCardProps) => {
  const wantsTShirt = form.watch("tShirt");
  return (
    <CardTemplate>
      <h2 className="text-xl font-semibold">Ta formule :</h2>
      <StyledFormField
        form={form}
        label="Package"
        id="package"
        input={(field) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="sport-light" />
              <Label htmlFor="sport-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="sport-full" />
              <Label htmlFor="sport-full">Full</Label>
            </div>
          </RadioGroup>
        )}
      />

      <StyledFormField
        form={form}
        label="Soirée"
        id="party"
        input={(field) => (
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="party"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="party">
              Je souhaite participer à la soirée
            </Label>
          </div>
        )}
      />

      <StyledFormField
        form={form}
        label="Gourde"
        id="bottle"
        input={(field) => (
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="bottle"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="bottle">Je souhaite une gourde</Label>
          </div>
        )}
      />

      <StyledFormField
        form={form}
        label="T-Shirt"
        id="tShirt"
        input={(field) => (
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="tShirt"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="tShirt">Je souhaite un t-shirt</Label>
          </div>
        )}
      />

      {wantsTShirt ? (
        <StyledFormField
          form={form}
          label="Taille du t-shirt"
          id="tShirtSize"
          input={(field) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full lg:w-1/2">
                <SelectValue placeholder="Sélectionnez une taille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      ) : (
        <div className="h-[68px]"></div>)}
    </CardTemplate>
  );
};
