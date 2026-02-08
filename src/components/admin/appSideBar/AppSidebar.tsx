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
import { NavValidation } from "./NavValidation";
import { NavSchools } from "./NavSchools";
import { NavSports } from "./NavSports";
import { NavGroups } from "./NavGroups";
import { NavMatches } from "./NavMatches";
import { NavTeams } from "./NavTeams";
import { NavProducts } from "./NavProducts";
import { NavLocations } from "./NavLocations";
import { NavPodiums } from "./NavPodiums";
import { NavLicense } from "./NavLicense";
import { NavVolunteerShifts } from "./NavVolunteerShifts";
import { NavEditions } from "./NavEditions";
import { useUser } from "@/src/hooks/useUser";
import { Logo } from "../../custom/Logo";
import { NavExport } from "./NavExport";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { edition } = useEdition();
  const router = useRouter();
  const { isAdmin, isSportManager, isBDS } = useUser();

  const handleLogoClick = () => {
    router.push("/admin");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={handleLogoClick}>
              <Logo />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Challenger</span>
                <span className="truncate text-xs">Administration</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isAdmin() && <NavEditions />}
        {edition && (
          <>
            {isAdmin() && <NavSchools />}
            {isAdmin() && <NavSports />}
            {(isAdmin() || isBDS()) && <NavValidation />}
            {isAdmin() && <NavLicense />}
            {isAdmin() && <NavLocations />}
            {(isAdmin() || isSportManager()) && <NavMatches />}
            {(isAdmin() || isSportManager()) && <NavTeams />}
            {(isAdmin() || isSportManager()) && <NavPodiums />}
            {isAdmin() && <NavGroups />}
            {isAdmin() && <NavProducts />}
            {isAdmin() && <NavVolunteerShifts />}
            {isAdmin() && <NavExport />}
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
