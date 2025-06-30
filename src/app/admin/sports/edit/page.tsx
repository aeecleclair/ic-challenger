"use client";

import { useSports } from "@/src/hooks/useSports";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SportsForm } from "@/src/components/admin/appSideBar/sports/SportsForm";
import { SportEdit } from "@/src/api/hyperionSchemas";
import { sportFormSchema } from "@/src/forms/sport";

const EditSportPage = () => {
  const searchParam = useSearchParams();
  const sportId = searchParam.get("sport_id");

  const { sports, updateSport, isUpdateLoading: isLoading } = useSports();

  const sport = sports?.find((s) => s.id === sportId);

  const form = useForm<z.infer<typeof sportFormSchema>>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: sport?.name || "",
      teamSize: sport?.team_size || 1,
      sportCategory: sport?.sport_category || "masculine",
      substituteMax: sport?.substitute_max || 0,
      active: sport?.active !== undefined ? sport.active : true,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof sportFormSchema>) {
    if (!sportId) return;

    const body: SportEdit = {
      name: values.name,
      team_size: values.teamSize,
      sport_category: values.sportCategory,
      substitute_max: values.substituteMax,
      active: values.active,
    };

    updateSport(sportId, body, () => {
      form.reset();
    });
  }

  return sport ? (
    <div className="flex w-full flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">Modifier un sport</span>
        <Link
          href="/admin/sports"
          className="text-sm text-primary hover:underline"
        >
          Retour à la liste
        </Link>
      </div>
      <SportsForm
        form={form}
        isLoading={isLoading}
        onSubmit={onSubmit}
        submitLabel="Modifier le sport"
      />
    </div>
  ) : (
    <div className="p-6">Aucun sport trouvé avec l&apos;ID {sportId}</div>
  );
};

export default EditSportPage;
