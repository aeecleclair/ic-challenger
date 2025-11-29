"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Trophy, Plus, Trash2, Edit, Sparkles } from "lucide-react";
import { usePodiums } from "@/src/hooks/usePodiums";
import { usePompomsPodiums } from "@/src/hooks/usePompomsPodiums";
import { useSports } from "@/src/hooks/useSports";
import { useSportPodiums } from "@/src/hooks/useSportsPodiums";
import { PodiumCard } from "@/src/components/podiums/PodiumCard";
import { GlobalPodiumCard } from "@/src/components/podiums/GlobalPodiumCard";
import { SportsDataTable } from "@/src/components/podiums/SportsDataTable";
import { PodiumRankingsFormData } from "@/src/forms/podium";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/home/appSideBar/AppSidebar";

export default function PodiumsPage() {
  const searchParams = useSearchParams();
  const selectedSportId = searchParams.get("sport_id");
  const selectedSchoolId = searchParams.get("school_id");

  const { sports } = useSports();
  const { podiumsBySport } = useSportPodiums({
    sportIds:
      sports?.filter((sport) => sport.active).map((sport) => sport.id) || [],
  });
  const {
    globalPodium,
    sportPodium,
    schoolPodium,
    isGlobalLoading,
    isSportLoading,
    isSchoolLoading,
  } = usePodiums({
    sportId: selectedSportId || undefined,
    schoolId: selectedSchoolId || undefined,
  });

  const { pompomsResults, isPompomsLoading } = usePompomsPodiums();

  // Transform and sort pompoms results
  const sortedPompomsResults = useMemo(() => {
    return (
      pompomsResults
        ?.sort((a, b) => b.total_points - a.total_points)
        .map((result, index) => ({
          school_id: result.school_id,
          sport_id: "pompoms",
          team_id: result.school_id,
          points: result.total_points,
          edition_id: "",
          rank: index + 1,
          team: {
            id: result.school_id,
            name: result.school_id,
            captain_id: "",
            sport_id: "pompoms",
            school_id: result.school_id,
            edition_id: "",
            created_at: new Date().toISOString(),
          },
        })) || []
    );
  }, [pompomsResults]);

  if (isGlobalLoading || isPompomsLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-col relative overflow-auto h-full m-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Podiums</h1>
              </div>
              <div className="text-center">Chargement...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-col relative overflow-auto h-full m-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Podiums</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Global Podium */}
              <div className="lg:col-span-2 xl:col-span-3">
                <GlobalPodiumCard
                  results={globalPodium || []}
                  title="Podium Global"
                />
              </div>

              {/* Pompoms Podium */}
              <div className="lg:col-span-2 xl:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Podium Pompoms
                  </h2>
                </div>
                <PodiumCard
                  results={sortedPompomsResults}
                  title="Classement Pompoms"
                />
              </div>

              {/* Sport-specific Podium */}
              {selectedSportId &&
                selectedSportId !== "pompoms" &&
                !isSchoolLoading && (
                  <div className="lg:col-span-1 xl:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">
                        Podium du sport sélectionné
                      </h2>
                    </div>
                    <PodiumCard
                      results={sportPodium || []}
                      title={`Podium - ${sports?.find((s) => s.id === selectedSportId)?.name || "Sport sélectionné"}`}
                    />
                  </div>
                )}

              {/* School-specific Podium */}
              {selectedSchoolId && !isSchoolLoading && (
                <div className="lg:col-span-1 xl:col-span-1">
                  <h2 className="text-xl font-semibold mb-4">
                    Podium de l&apos;école sélectionnée
                  </h2>
                  <PodiumCard
                    results={schoolPodium || []}
                    title="Podium École"
                  />
                </div>
              )}

              {/* Sports List for Quick Actions */}
              <div className="lg:col-span-2 xl:col-span-3">
                <h2 className="text-xl font-semibold mb-4">
                  Podiums par sport
                </h2>

                {/* Sports Data Table */}
                <SportsDataTable
                  data={[
                    // Add Pompoms as first entry
                    {
                      id: "pompoms",
                      name: "🎀 Pompoms",
                      active: true,
                      firstPlace:
                        sortedPompomsResults.find((p) => p.rank === 1)?.team
                          .name || null,
                      secondPlace:
                        sortedPompomsResults.find((p) => p.rank === 2)?.team
                          .name || null,
                      thirdPlace:
                        sortedPompomsResults.find((p) => p.rank === 3)?.team
                          .name || null,
                      others: sortedPompomsResults,
                    },
                    // Add regular sports
                    ...(sports
                      ?.filter((sport) => sport.active)
                      .map((sport) => {
                        const podiumData = podiumsBySport[sport.id];
                        const sortedPodium = podiumData
                          ? [...podiumData].sort((a, b) => a.rank - b.rank)
                          : [];

                        return {
                          id: sport.id,
                          name: sport.name,
                          active: sport.active ?? true,
                          firstPlace:
                            sortedPodium.find((p) => p.rank === 1)?.team
                              ?.name || null,
                          secondPlace:
                            sortedPodium.find((p) => p.rank === 2)?.team
                              ?.name || null,
                          thirdPlace:
                            sortedPodium.find((p) => p.rank === 3)?.team
                              ?.name || null,
                          others: sortedPodium,
                        };
                      }) || []),
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
