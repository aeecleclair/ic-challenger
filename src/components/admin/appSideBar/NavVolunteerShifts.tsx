"use client";
import { ChevronRight, Users } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

import { useRouter } from "next/navigation";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "../../ui/collapsible";

export function NavVolunteerShifts() {
  const router = useRouter();

  const handleClick = (path: string = "") => {
    router.push(`/admin/volunteer-shifts${path}`);
  };

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => handleClick("")}
            className="cursor-pointer hover:underline"
          >
            Créneaux Bénévoles
          </div>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:rotate-90">
              <ChevronRight />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleClick("")}>
                <Users />
                Gestion des Créneaux
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
