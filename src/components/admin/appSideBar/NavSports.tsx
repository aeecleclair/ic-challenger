"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useSports } from "@/src/hooks/useSports";
import { useAllMatches } from "@/src/hooks/useAllMatches";
import { useMemo } from "react";
import { Badge } from "../../ui/badge";

export function NavSports() {
  const { sports } = useSports();
  const { allMatches } = useAllMatches();
  const router = useRouter();

  const sportsWithoutMatches = useMemo(() => {
    if (!sports || !allMatches) return 0;
    const sportIdsWithMatches = new Set(allMatches.map((m) => m.sport_id));
    return sports.filter((s) => !sportIdsWithMatches.has(s.id)).length;
  }, [sports, allMatches]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/sports")}
          className="cursor-pointer hover:underline flex items-center gap-1.5"
        >
          Sports {(sports?.length ?? 0) > 0 && `(${sports!.length})`}
          {sportsWithoutMatches > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] px-1 py-0 bg-amber-100 text-amber-800 border-amber-300"
            >
              {sportsWithoutMatches} sans matchs
            </Badge>
          )}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
