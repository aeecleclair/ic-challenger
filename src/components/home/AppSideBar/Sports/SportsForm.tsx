import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Form } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { sportFormSchema, sportCategories } from "@/src/forms/sport";

interface SportsFormProps {
  form: UseFormReturn<z.infer<typeof sportFormSchema>>;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof sportFormSchema>) => void;
  submitLabel: string;
}

export const SportsForm = ({ form, isLoading, onSubmit, submitLabel }: SportsFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StyledFormField
          form={form}
          label="Nom du sport"
          id="name"
          input={(field) => (
            <Input placeholder="Ex: Football, Basketball, etc." {...field} />
          )}
        />

        <div className="grid lg:grid-cols-3 gap-6 grid-cols-1">
          <StyledFormField
            form={form}
            label="Catégorie"
            id="sportCategory"
            input={(field) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {sportCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <StyledFormField
            form={form}
            label="Taille d'équipe"
            id="teamSize"
            input={(field) => (
              <Input
                type="number"
                min="1"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            )}
          />

          <StyledFormField
            form={form}
            label="Nombre de remplaçants max"
            id="substituteMax"
            input={(field) => (
              <Input
                type="number"
                min="0"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
        </div>

        <LoadingButton
          type="submit"
          className="w-full mt-6"
          isLoading={isLoading}
        >
            {submitLabel}
        </LoadingButton>
      </form>
    </Form>
  );
};
