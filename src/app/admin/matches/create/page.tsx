"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSportMatches } from "@/src/hooks/useMatches";
import { MatchFormValues, matchFormSchema } from "@/src/forms/match";
import { MatchesForm } from "@/src/components/admin/appSideBar/matches/MatchesForm";
import { MatchBase } from "@/src/api/hyperionSchemas";

const CreateMatchPage = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const sportId = searchParam.get("sport_id");

  const { createMatch, isCreateLoading } = useSportMatches({
    sportId: sportId || undefined,
  });

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      name: "",
      sport_id: sportId || "",
      team1_id: "",
      team2_id: "",
      date: undefined,
      location_id: "",
      score_team1: undefined,
      score_team2: undefined,
      winner_id: undefined,
      edition_id: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: MatchFormValues) {
    const matchData: MatchBase = {
      name: values.name,
      sport_id: values.sport_id,
      team1_id: values.team1_id,
      team2_id: values.team2_id,
      date: values.date ? values.date.toISOString() : null,
      location_id: values.location_id || null,
      score_team1: values.score_team1 || null,
      score_team2: values.score_team2 || null,
      winner_id: values.winner_id || null,
      edition_id: values.edition_id,
    };

    createMatch(matchData, () => {
      router.push("/admin/matches");
    });
  }

  return (
    <div className="flex w-full flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">Créer un nouveau match</span>
        <Link
          href="/admin/matches"
          className="text-sm text-primary hover:underline"
        >
          Retour à la liste des matchs
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <MatchesForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isCreateLoading}
          submitLabel="Créer le match"
        />
      </div>
    </div>
  );
};

export default CreateMatchPage;
