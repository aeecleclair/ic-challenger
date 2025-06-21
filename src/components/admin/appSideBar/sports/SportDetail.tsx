"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sportFormSchema } from "@/src/forms/sport";
import { useSports } from "@/src/hooks/useSports";
import { SportsForm } from "@/src/components/admin/appSideBar/sports/SportsForm";
import { Sport } from "@/src/api/hyperionSchemas";
import Link from "next/link";

interface SportDetailProps {
  sport: Sport;
}

const SportDetail = ({ sport }: SportDetailProps) => {
  const { updateSport, isUpdateLoading: isLoading } = useSports();

  const form = useForm<z.infer<typeof sportFormSchema>>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: sport.name,
      teamSize: sport.team_size,
      sportCategory: sport.sport_category ?? undefined,
      substituteMax: sport.substitute_max ?? 0,
      activated: sport.activated,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof sportFormSchema>) {
    updateSport(
      sport.id,
      {
        name: values.name,
        team_size: values.teamSize,
        sport_category: values.sportCategory,
        substitute_max: values.substituteMax,
        activated: values.activated,
      },
      () => {
        form.reset();
      },
    );
  }
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">Modifer un sport</span>
        <Link href="/admin/sports" className="text-sm text-primary hover:underline">
          Retour à la liste
        </Link>
      </div>
      <SportsForm
        form={form}
        isLoading={isLoading}
        onSubmit={onSubmit}
        submitLabel="Modifer le sport"
      />
    </div>
  );
};

export default SportDetail;
