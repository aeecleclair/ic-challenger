"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useSportMatches } from "@/src/hooks/useMatches";
import { MatchFormValues, matchFormSchema } from "@/src/forms/match";
import { MatchesForm } from "@/src/components/admin/matches/MatchesForm";
import { MatchEdit } from "@/src/api/hyperionSchemas";
import { Skeleton } from "@/src/components/ui/skeleton";

const EditMatchPage = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const matchId = searchParam.get("match_id");

  const [sportId, setSportId] = useState<string | undefined>();
  const { sportMatches, updateMatch, isUpdateLoading } = useSportMatches({
    sportId,
  });

  const match = sportMatches?.find((m) => m.id === matchId);

  useEffect(() => {
    if (match && match.sport_id !== sportId) {
      setSportId(match.sport_id);
    }
  }, [match, sportId]);

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      name: match?.name || "",
      sport_id: match?.sport_id || "",
      team1_id: match?.team1_id || "",
      team2_id: match?.team2_id || "",
      date: match?.date ? new Date(match.date) : undefined,
      location_id: match?.location_id || undefined,
      score_team1: match?.score_team1 !== null ? match?.score_team1 : undefined,
      score_team2: match?.score_team2 !== null ? match?.score_team2 : undefined,
      winner_id: match?.winner_id || undefined,
      edition_id: match?.edition_id || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (match) {
      form.reset({
        name: match.name,
        sport_id: match.sport_id,
        team1_id: match.team1_id,
        team2_id: match.team2_id,
        date: match.date ? new Date(match.date) : undefined,
        location_id: match.location_id || undefined,
        score_team1: match.score_team1 !== null ? match.score_team1 : undefined,
        score_team2: match.score_team2 !== null ? match.score_team2 : undefined,
        winner_id: match.winner_id || undefined,
        edition_id: match.edition_id,
      });
    }
  }, [match, form]);

  function onSubmit(values: MatchFormValues) {
    if (!matchId) return;

    const matchData: MatchEdit = {
      name: values.name,
      sport_id: values.sport_id,
      team1_id: values.team1_id,
      team2_id: values.team2_id,
      date: values.date ? values.date.toISOString() : null,
      location_id: values.location_id || null,
      score_team1: values.score_team1 !== undefined ? values.score_team1 : null,
      score_team2: values.score_team2 !== undefined ? values.score_team2 : null,
      winner_id: values.winner_id || null,
    };

    updateMatch(matchId, matchData, () => {
      router.push(`/admin/matches?match_id=${matchId}`);
    });
  }

  return (
    <div className="flex w-full flex-col min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier le match
            </h1>
            <p className="text-gray-600 mt-1">
              {match
                ? `Modifiez les détails du match "${match.name}"`
                : "Chargement..."}
            </p>
          </div>
          <Link
            href={`/admin/matches${match ? `?match_id=${match.id}` : ""}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Retour aux détails
          </Link>
        </div>

        {match ? (
          <MatchesForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isUpdateLoading}
            submitLabel="Mettre à jour le match"
            isEditing={true}
          />
        ) : (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMatchPage;
