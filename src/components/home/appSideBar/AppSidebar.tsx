"use client";
import * as React from "react";
import { Command, LifeBuoy, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { NavUser } from "../../custom/NavUser";
import { useEdition } from "@/src/hooks/useEdition";
import { NavMatches } from "./NavMatches";
import { NavVolunteerShifts } from "./NavVolunteerShifts";
import { NavSearch } from "./NavSearch";
import { NavLocations } from "./NavLocations";
import { NavPodium } from "./NavPodium";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { edition } = useEdition();
  const router = useRouter();
  const { meParticipant } = useParticipant();
  const { meCompetition } = useCompetitionUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <button onClick={handleLogoClick} className="w-full">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Challenger</span>
                  {edition ? (
                    <span className="truncate text-xs">
                      Edition {edition.year}
                    </span>
                  ) : (
                    <span className="truncate text-xs">
                      Aucune édition active
                    </span>
                  )}
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {edition && meParticipant && <NavMatches />}
        {edition && meCompetition?.is_volunteer && <NavVolunteerShifts />}
        {edition && <NavSearch />}
        {edition && <NavLocations />}
        {edition && <NavPodium />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
