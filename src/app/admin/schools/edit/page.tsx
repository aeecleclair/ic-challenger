"use client";

import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SchoolsForm } from "@/src/components/admin/appSideBar/schools/SchoolsForm";
import { SchoolExtensionEdit } from "@/src/api/hyperionSchemas";
import { schoolFormSchema } from "@/src/forms/schools";

const Dashboard = () => {
  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");

  const { sportSchools } = useSportSchools();

  const school = sportSchools?.find((s) => s.school_id === schoolId);
  const { filteredSchools } = useSchools();
  const { updateCompetitionSchool, isUpdateLoading: isLoading } =
    useSportSchools();

  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      schools: school?.school_id,
      fromLyon: school?.from_lyon,
      active: school?.active,
      inscription_enabled: school?.inscription_enabled,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof schoolFormSchema>) {
    const body: SchoolExtensionEdit = {
      from_lyon: values.fromLyon,
      active: values.active,
      inscription_enabled: values.inscription_enabled,
    };
    updateCompetitionSchool(school!.school_id, body, () => {
      form.reset();
    });
  }

  return school ? (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">Modifer une école</span>
        <Link
          href="/admin/schools"
          className="text-sm text-primary hover:underline"
        >
          Retour à la liste
        </Link>
      </div>
      <SchoolsForm
        form={form}
        isLoading={isLoading}
        onSubmit={onSubmit}
        submitLabel="Modifer l'école"
        schools={filteredSchools || []}
      />
    </div>
  ) : (
    <div>No school with id {schoolId}</div>
  );
};

export default Dashboard;
