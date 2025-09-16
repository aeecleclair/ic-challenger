"use client";

import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SchoolsForm } from "@/src/components/admin/schools/SchoolsForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { SchoolExtensionEdit } from "@/src/api/hyperionSchemas";
import { schoolFormSchema, SchoolFormValues } from "@/src/forms/schools";

const Dashboard = () => {
  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");

  const { sportSchools } = useSportSchools();

  const school = sportSchools?.find((s) => s.school_id === schoolId);
  const { filteredSchools } = useSchools();
  const { updateCompetitionSchool, isUpdateLoading: isLoading } =
    useSportSchools();

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      schools: school?.school_id,
      fromLyon: school?.from_lyon,
      active: school?.active,
      inscription_enabled: school?.inscription_enabled,
    },
    mode: "onChange",
  });

  function onSubmit(values: SchoolFormValues) {
    const body: SchoolExtensionEdit = {
      from_lyon: values.fromLyon,
      active: values.active,
      inscription_enabled: values.inscription_enabled,
    };
    updateCompetitionSchool(school!.school_id, body, () => {
      form.reset({
        schools: values.schools,
        fromLyon: values.fromLyon,
        active: values.active,
        inscription_enabled: values.inscription_enabled,
      });
    });
  }

  return school ? (
    <div className="flex w-full flex-col space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier une école
        </h1>
        <p className="text-muted-foreground">
          Modifiez les paramètres de l&apos;école {school.school.name}
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l&apos;école</CardTitle>
        </CardHeader>
        <CardContent>
          <SchoolsForm
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
            submitLabel="Modifier l'école"
            schools={filteredSchools || []}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  ) : (
    <div>No school with id {schoolId}</div>
  );
};

export default Dashboard;
