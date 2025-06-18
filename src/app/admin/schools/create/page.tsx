"use client";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Form } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { act, useState } from "react";
import { toast } from "@/src/components/ui/use-toast";
import { schoolFormSchema } from "@/src/forms/schools";
import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useEdition } from "@/src/hooks/useEdition";

const Dashboard = () => {
  const { schools } = useSchools();
  const { edition } = useEdition();
  const { createCompetitionSchool, isLoading } = useSportSchools();
  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      fromLyon: false,
      activated: true,
      athleteQuota: 0,
      cameramanQuota: 0,
      cheerleaderQuota: 0,
      fanfareQuota: 0,
      nonAthleteQuota: 0,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof schoolFormSchema>) {
    createCompetitionSchool(
      {
        body: {
          school_id: values.schools,
          from_lyon: values.fromLyon,
          activated: values.activated,
          school: schools!.find(
            (school) => school.id === values.schools,
          )!,
          general_quota: {
            school_id: values.schools,
            edition: edition!.id,
            athlete_quota: values.athleteQuota,
            cameraman_quota: values.cameramanQuota,
            pompom_quota: values.cheerleaderQuota,
            fanfare_quota: values.fanfareQuota,
            non_athlete_quota: values.nonAthleteQuota,
          },
        },
      }, () => {
        form.reset();
      }
    )
  }

  return (
    <div className="flex h-full w-full flex-col p-6">
      <span className="text-2xl font-bold mb-4">Ajouter une école</span>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <StyledFormField
                form={form}
                label="Établissement"
                id="schools"
                input={(field) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

              <div className="flex flex-row gap-6">
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

                <StyledFormField
                  form={form}
                  label="Activée"
                  id="activated"
                  input={(field) => (
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>

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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  )}
                />
              </div>

              <LoadingButton
                type="submit"
                className="w-full mt-6"
                isLoading={isLoading}
              >
                Ajouter l&apos;école
              </LoadingButton>
            </form>
          </Form>
    </div>
  );
};

export default Dashboard;
