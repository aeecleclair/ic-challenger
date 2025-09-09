"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sportFormSchema } from "@/src/forms/sport";
import { useSports } from "@/src/hooks/useSports";
import { SportsForm } from "@/src/components/admin/sports/SportsForm";

const Dashboard = () => {
  const { createSport, isCreateLoading: isLoading } = useSports();

  const form = useForm<z.infer<typeof sportFormSchema>>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: "",
      teamSize: 1,
      sportCategory: "masculine",
      substituteMax: 0,
      active: true,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof sportFormSchema>) {
    createSport(
      {
        name: values.name,
        team_size: values.teamSize,
        sport_category:
          values.sportCategory === "null" ? null : values.sportCategory,
        substitute_max: values.substituteMax,
        active: values.active,
      },
      () => {
        form.reset();
      },
    );
  }

  return (
    <div className="flex h-full w-full flex-col p-6">
      <span className="text-2xl font-bold mb-4">Ajouter un sport</span>
      <SportsForm
        form={form}
        isLoading={isLoading}
        onSubmit={onSubmit}
        submitLabel=" Ajouter le sport"
      />
    </div>
  );
};

export default Dashboard;
