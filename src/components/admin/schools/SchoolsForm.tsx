import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Form } from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { SchoolFormValues } from "@/src/forms/schools";
import { Checkbox } from "@/src/components/ui/checkbox";
import { CoreSchool } from "@/src/api/hyperionSchemas";

interface SchoolsFormProps {
  form: UseFormReturn<SchoolFormValues>;
  isLoading: boolean;
  onSubmit: (values: SchoolFormValues) => void;
  submitLabel: string;
  schools: CoreSchool[];
}

export const SchoolsForm = ({
  form,
  isLoading,
  onSubmit,
  schools,
}: SchoolsFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StyledFormField
          form={form}
          label="Établissement"
          id="schools"
          input={(field) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un établissement" />
              </SelectTrigger>
              <SelectContent>
                {schools &&
                  schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {formatSchoolName(school.name)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        />

        <StyledFormField
          form={form}
          label="École Lyonnaise"
          id="fromLyon"
          input={(field) => (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
        {/* 
        <div className="grid grid-cols-2 gap-6">
          <StyledFormField
            form={form}
            label="Quota d'athlètes"
            id="athleteQuota"
            input={(field) => (
              <Input
                type="number"
                min="0"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />

          <StyledFormField
            form={form}
            label="Quota de cameramens"
            id="cameramanQuota"
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

        <div className="grid grid-cols-3 gap-6">
          <StyledFormField
            form={form}
            label="Quota de pompoms"
            id="cheerleaderQuota"
            input={(field) => (
              <Input
                type="number"
                min="0"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />

          <StyledFormField
            form={form}
            label="Quota de fanfarons"
            id="fanfareQuota"
            input={(field) => (
              <Input
                type="number"
                min="0"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />

          <StyledFormField
            form={form}
            label="Quota de non-athlètes"
            id="nonAthleteQuota"
            input={(field) => (
              <Input
                type="number"
                min="0"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
        </div> */}

        <LoadingButton
          type="submit"
          className="w-full mt-6"
          isLoading={isLoading}
        >
          Ajouter l&apos;école
        </LoadingButton>
      </form>
    </Form>
  );
};
