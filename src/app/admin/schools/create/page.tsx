"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { schoolFormSchema } from "@/src/forms/schools";
import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import Link from "next/link";
import { SchoolsForm } from "@/src/components/admin/schools/SchoolsForm";
import { SchoolExtensionBase } from "@/src/api/hyperionSchemas";

const Dashboard = () => {
  const { filteredSchools } = useSchools();
  const { createCompetitionSchool, isLoading } = useSportSchools();
  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      fromLyon: false,
      active: true,
      inscription_enabled: false,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof schoolFormSchema>) {
    const body: SchoolExtensionBase = {
      school_id: values.schools,
      from_lyon: values.fromLyon,
      active: values.active,
      inscription_enabled: values.inscription_enabled,
    };
    createCompetitionSchool(body, () => {
      form.reset();
    });
  }
  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">Ajouter une école</span>
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
        submitLabel="Ajouter l'école"
        schools={filteredSchools || []}
      />
    </div>
  );
};

export default Dashboard;
