import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {  VariantFormValues } from "@/src/forms/variant";
import { UseFormReturn } from "react-hook-form";

import { CurrencyInput } from "@/src/components/custom/CurrencyInput";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";

interface AddEditVariantFormProps {
  form: UseFormReturn<VariantFormValues>;
  isLoading: boolean;
  setIsOpened: (value: boolean) => void;
  isEdit?: boolean;
}

export const AddEditVariantForm = ({
  form,
  isLoading,
  setIsOpened,
  isEdit = false,
}: AddEditVariantFormProps) => {
  const schoolTypes = [
    { value: "centrale", label: "Centrale" },
    { value: "from_lyon", label: "De Lyon" },
    { value: "others", label: "Autres" },
  ];

  const publicTypes = [
    { value: "pompom", label: "Pompom" },
    { value: "fanfare", label: "Fanfare" },
    { value: "cameraman", label: "Cameraman" },
    { value: "athlete", label: "Athlète" },
    { value: "volunteer", label: "Bénévole" },
  ];

  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }
  return (
    <div className="grid gap-6 mt-4">
      <StyledFormField
        form={form}
        label="Nom"
        id="name"
        input={(field) => <Input placeholder="Nom de la variante" {...field} />}
      />

      <StyledFormField
        form={form}
        label="Description"
        id="description"
        input={(field) => (
          <Textarea placeholder="Description (optionnelle)" {...field} />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <StyledFormField
          form={form}
          label="Prix"
          id="price"
          input={(field) => <CurrencyInput id="price" {...field} />}
        />

        <StyledFormField
          form={form}
          label="Type d'école"
          id="schoolType"
          input={(field) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type d'école" />
              </SelectTrigger>
              <SelectContent>
                {schoolTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <StyledFormField
        form={form}
        label="Type de public (optionnel)"
        id="publicType"
        input={(field) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type de public" />
            </SelectTrigger>
            <SelectContent>
              {publicTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <div className="grid gap-2">
        <StyledFormField
          form={form}
          label="Achat"
          id="unique"
          input={(field) => (
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unique" id="unique" />
                <Label htmlFor="unique">
                  {"Ne peux être acheté qu'une seule fois"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple">
                  Peux être acheter autant de fois que souhaité
                </Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <StyledFormField
        form={form}
        label="Activé"
        id="enabled"
        input={(field) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enabled"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="enabled">
              Cette variante est activée et disponible à l&apos;achat
            </Label>
          </div>
        )}
      />

      <div className="flex justify-end mt-2 space-x-4">
        <Button
          variant="outline"
          onClick={closeDialog}
          disabled={isLoading}
          className="w-[100px]"
        >
          Annuler
        </Button>
        <LoadingButton
          isLoading={isLoading}
          className="w-[100px]"
          type="submit"
        >
          {isEdit ? "Modifier" : "Ajouter"}
        </LoadingButton>
      </div>
    </div>
  );
};
