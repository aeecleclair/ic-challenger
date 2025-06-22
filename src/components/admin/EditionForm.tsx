"use client";

import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Form } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { editionFormSchema } from "@/src/forms/edition";
import { DatePicker } from "../custom/DatePicker";

interface EditionFormProps {
  form: UseFormReturn<z.infer<typeof editionFormSchema>>;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof editionFormSchema>) => void;
  submitLabel: string;
}

export const EditionForm = ({
  form,
  isLoading,
  onSubmit,
  submitLabel,
}: EditionFormProps) => {
  const now = new Date();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StyledFormField
          form={form}
          label="Nom de l'édition"
          id="name"
          input={(field) => (
            <Input placeholder="Ex: Challenge 2025" {...field} />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StyledFormField
            form={form}
            label="Date de début"
            id="startDate"
            input={(field) => (
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                fromDate={now}
                toDate={
                  form.getValues("endDate") ??
                  new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
                }
                {...field}
              />
            )}
          />

          <StyledFormField
            form={form}
            label="Date de fin"
            id="endDate"
            input={(field) => (
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                fromDate={form.getValues("startDate") ?? now}
                toDate={
                  new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
                }
                {...field}
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

export default EditionForm;
