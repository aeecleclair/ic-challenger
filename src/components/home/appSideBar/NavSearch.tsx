"use client";

import { Search, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "@/src/components/ui/sidebar";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import { useMemo } from "react";
import { useSportSchools } from "@/src/hooks/useSportSchools";

export function NavSearch() {
  const router = useRouter();

  const { sports } = useSports();
  const { sportSchools } = useSportSchools();

  const totalEntities = useMemo(() => {
    const sportsCount = sports?.length || 0;
    const schoolsCount = sportSchools?.length || 0;
    return sportsCount + schoolsCount;
  }, [sports, sportSchools]);

  const handleSearchClick = () => {
    router.push("/search");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={handleSearchClick}
          className="cursor-pointer hover:underline"
        >
          Matchs
        </div>
        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
