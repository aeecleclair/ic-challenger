"use client";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { useRouter } from "next/navigation";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { useUser } from "@/src/hooks/useUser";

export function NavTeams() {
  const { me } = useUser();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/teams`);
  };

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => handleClick(me?.school_id || "")}
            className="cursor-pointer hover:underline"
          >
            Gestion des équipes
          </div>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
              <ChevronRight />
              <span className="sr-only">Toggle</span>
            </SidebarMenuAction>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push("/admin/teams")}>
                <span>Voir toutes les équipes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
