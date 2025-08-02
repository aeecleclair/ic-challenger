"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { useSportMatches } from "@/src/hooks/useMatches";
import { useSports } from "@/src/hooks/useSports";
import MatchCard from "@/src/components/admin/matches/MatchCard";
import MatchDetail from "@/src/components/admin/matches/MatchDetail";
import { WarningDialog } from "@/src/components/custom/WarningDialog";
import { MatchDataTable } from "@/src/components/admin/matches/MatchDataTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { ListFilter, Grid3x3, Plus, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";

const MatchesDashboard = () => {
  const router = useRouter();
  const { sports } = useSports();

  const searchParam = useSearchParams();
  const matchId = searchParam.get("match_id");
  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const {
    sportMatches,
    refetchSportMatches,
    deleteMatch,
    error,
    isDeleteLoading,
  } = useSportMatches({});

  const selectedMatch = sportMatches?.find((match) => match.id === matchId);

  const handleDelete = (id: string) => {
    setDeleteMatchId(id);
  };

  const confirmDelete = () => {
    if (deleteMatchId) {
      deleteMatch(deleteMatchId, () => {
        if (deleteMatchId === matchId) {
          router.push("/admin/matches");
        }
        setDeleteMatchId(null);
      });
    }
  };

  return (
    <div className="flex w-full flex-col p-6">
      {selectedMatch ? (
        <>
          <div className="mb-6">
            <Link
              href="/admin/matches"
              className="text-sm text-primary hover:underline"
            >
              &larr; Retour à la liste des matchs
            </Link>
          </div>
          <MatchDetail match={selectedMatch} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Gestion des matchs</h1>
            <Link href="/admin/matches/create">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un match
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:items-center gap-4 mb-6">
            <Tabs
              value={viewMode}
              onValueChange={(val) => setViewMode(val as "grid" | "table")}
              className="w-full"
            >
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="grid" className="flex items-center">
                  <Grid3x3 className="mr-2 h-4 w-4" />
                  Cartes
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Tableau
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="grid" className="mt-0">
                  {sportMatches && sportMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sportMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onClick={() => {
                            router.push(`/admin/matches?match_id=${match.id}`);
                          }}
                        />
                      ))}
                    </div>
                  ) : sportMatches ? (
                    <div className="flex items-center justify-center h-full mt-10">
                      <p className="text-gray-500">Aucun match trouvé</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-[200px] w-full" />
                        ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="table" className="mt-0">
                  {sportMatches ? (
                    <MatchDataTable
                      data={sportMatches}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <Skeleton className="h-[400px] w-full" />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </>
      )}

      <WarningDialog
        isOpened={!!deleteMatchId}
        callback={confirmDelete}
        title="Supprimer le match"
        description="Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible."
        validateLabel="Supprimer"
        setIsOpened={() => setDeleteMatchId(null)}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default MatchesDashboard;
