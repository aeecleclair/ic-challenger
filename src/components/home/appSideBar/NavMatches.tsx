"use client";
import { ChevronRight, Trophy } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useParticipant } from "../../../hooks/useParticipant";
import { useSportMatches } from "../../../hooks/useSportMatches";
import { useMemo } from "react";

export function NavMatches() {
  const router = useRouter();
  const { meParticipant } = useParticipant();
  const { sportMatches } = useSportMatches({
    sportId: meParticipant?.sport_id,
  });

  const userMatchesCount = useMemo(() => {
    if (!sportMatches || !meParticipant?.team_id) return 0;

    return sportMatches.filter(
      (match) =>
        match.team1_id === meParticipant.team_id ||
        match.team2_id === meParticipant.team_id,
    ).length;
  }, [sportMatches, meParticipant?.team_id]);

  const handleClick = () => {
    router.push("/matches");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div onClick={handleClick} className="cursor-pointer hover:underline">
          Mes Matchs {userMatchesCount > 0 && `(${userMatchesCount})`}
        </div>
        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
