"use client";
import * as React from "react";
import { Command, LifeBuoy, Send } from "lucide-react";
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
import { NavValidation } from "./validation/NavValidation";
import { NavSchools } from "./NavSchools";
import { NavSports } from "./NavSports";
import { NavGroups } from "./NavGroups";
import { NavMatches } from "./NavMatches";
import { NavProducts } from "./NavProducts";
import { NavLocations } from "./NavLocations";
import { NavPodiums } from "./NavPodiums";

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

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Challenger</span>
                  <span className="truncate text-xs">Administration</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {edition && (
          <>
            <NavSchools />
            <NavSports />
            <NavValidation />
            <NavLocations />
            <NavMatches />
            <NavPodiums />
            <NavGroups />
            <NavProducts />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
