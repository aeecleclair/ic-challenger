"use client";
import { ChevronRight, Plus, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../ui/sidebar";

import { useSchools } from "@/src/hooks/useSchools";

export function NavSports() {
  const { schools, error } = useSchools();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Écoles</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="/schools/add">
              <Plus className="mr-2 h-4 w-4" />
              <span>Ajouter une école</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {schools && (
          <>
            {schools.map((school) => (
              <SidebarMenuItem key={school.school_id}>
                <SidebarMenuButton asChild>
                  <a href={school.school_id}>
                    <span>{school.school.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
