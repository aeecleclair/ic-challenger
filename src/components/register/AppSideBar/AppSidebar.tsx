"use client";
import * as React from "react";
import { Command } from "lucide-react";
import { Timeline, TimelineItemLabel } from "@/src/components/custom/Timeline";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { NavUser } from "./NavUser";
import { TimelineStep } from "./TimelineStep";

export function AppSidebar({
  state,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  state: RegisterState;
}) {
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
                  <span className="truncate text-xs">Inscription</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4">
          <Timeline>
            <TimelineItemLabel>Suivis inscription</TimelineItemLabel>
            {state.allHeaderSubtitles.map((subtitle, index) => (
              <TimelineStep
                key={index}
                label={subtitle}
                description={
                  state.stepDone > index
                    ? "Terminé"
                    : "En cours"
                }
                isCompleted={state.stepDone > index}
              />
            ))}
            <TimelineItemLabel>Récapitulatif</TimelineItemLabel>
            <TimelineStep
              label="Récapitulatif"
              description="En cours"
              isCompleted={state.stepDone >= 4}
            />
          </Timeline>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
