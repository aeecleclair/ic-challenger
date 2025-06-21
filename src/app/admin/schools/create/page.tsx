"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { schoolFormSchema } from "@/src/forms/schools";
import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import Link from "next/link";
import { SchoolsForm } from "@/src/components/admin/appSideBar/schools/SchoolsForm";

const Dashboard = () => {
  const { schools } = useSchools();
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
          // general_quota: {
          //   school_id: values.schools,
          //   edition: edition!.id,
          //   athlete_quota: values.athleteQuota,
          //   cameraman_quota: values.cameramanQuota,
          //   pompom_quota: values.cheerleaderQuota,
          //   fanfare_quota: values.fanfareQuota,
          //   non_athlete_quota: values.nonAthleteQuota,
          // },
        },
      },
      () => {
        form.reset();
      },
    );
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
        schools={schools || []}
      />
    </div>
  );
};

export default Dashboard;
