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
import { NavSecondary } from "./NavSecondary";
import { useEdition } from "@/src/hooks/useEdition";
import { NavValidation } from "./NavValidation";
import { NavSchools } from "./NavSchools";
import { NavSports } from "./NavSports";
import { NavGroups } from "./NavGroups";
import { NavMatches } from "./NavMatches";
import { NavProducts } from "./NavProducts";
import { NavLocations } from "./NavLocations";
import { NavPodiums } from "./NavPodiums";
import { NavLicense } from "./NavLicense";
import { useUser } from "@/src/hooks/useUser";

const data = {
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};
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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Challenger</span>
                <span className="truncate text-xs">Administration</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {edition && (
          <>
            {isAdmin() && <NavSchools />}
            {isAdmin() && <NavSports />}
            {(isAdmin() || isBDS()) && <NavValidation />}
            {isAdmin() && <NavLicense />}
            {isAdmin() && <NavLocations />}
            {(isAdmin() || isSportManager()) && <NavMatches />}
            {(isAdmin() || isSportManager()) && <NavPodiums />}
            {isAdmin() && <NavGroups />}
            {isAdmin() && <NavProducts />}
            {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
