"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSchools } from "@/src/hooks/useSchools";
import { SchoolsForm } from "@/src/components/admin/appSideBar/schools/SchoolsForm";
import {
  SchoolExtension,
  SchoolExtensionEdit,
} from "@/src/api/hyperionSchemas";
import Link from "next/link";
import { schoolFormSchema } from "@/src/forms/schools";
import { useSportSchools } from "@/src/hooks/useSportSchools";

interface SchoolDetailProps {
  school: SchoolExtension;
}

const SchoolDetail = ({ school }: SchoolDetailProps) => {
  const { schools } = useSchools();
  const { updateCompetitionSchool, isUpdateLoading: isLoading } =
    useSportSchools();

  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      schools: school.school_id,
      fromLyon: school.from_lyon,
      athleteQuota: school.general_quota.athlete_quota ?? 0,
      cameramanQuota: school.general_quota.cameraman_quota ?? 0,
      cheerleaderQuota: school.general_quota.pompom_quota ?? 0,
      fanfareQuota: school.general_quota.fanfare_quota ?? 0,
      nonAthleteQuota: school.general_quota.non_athlete_quota ?? 0,

      activated: school.activated,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof schoolFormSchema>) {
    const body: SchoolExtensionEdit = {
      from_lyon: values.fromLyon,
      activated: values.activated,
    };
    updateCompetitionSchool(school.school_id, body, () => {
      form.reset();
    });
  }
  return (
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
        schools={schools || []}
      />
    </div>
  );
};

export default SchoolDetail;
