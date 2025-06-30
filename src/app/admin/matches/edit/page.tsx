"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useSportMatches } from "@/src/hooks/useMatches";
import { MatchFormValues, matchFormSchema } from "@/src/forms/match";
import { MatchesForm } from "@/src/components/admin/appSideBar/matches/MatchesForm";
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
    <div className="flex w-full flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">Modifier le match</span>
        <Link
          href={`/admin/matches${match ? `?match_id=${match.id}` : ""}`}
          className="text-sm text-primary hover:underline"
        >
          Retour aux détails du match
        </Link>
      </div>

      {match ? (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <MatchesForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isUpdateLoading}
            submitLabel="Mettre à jour le match"
            isEditing={true}
          />
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-96 w-full" />
        </div>
      )}
    </div>
  );
};

export default EditMatchPage;
