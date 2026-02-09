"use client";
import * as React from "react";
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
import { Logo } from "../../custom/Logo";
import { useUser } from "@/src/hooks/useUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { edition } = useEdition();
  const router = useRouter();
  const { meParticipant } = useParticipant();
  const { me } = useUser();
  const isVolunteer = me?.school_id == "d9772da7-1142-4002-8b86-b694b431dfed";

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
                <Logo />
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
        {edition && isVolunteer && <NavVolunteerShifts />}
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
