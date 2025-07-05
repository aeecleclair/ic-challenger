"use client";
import { ChevronRight, MoreHorizontal, UserPlus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";

// Using the actual CompetitionGroupType definition: "sport_manager" | "schools_bds"
// Define available group types with proper names
const AVAILABLE_GROUPS = [
  { id: "schools_bds", name: "BDS" },
  { id: "sport_manager", name: "Gestionnaires de sport" },
];

export function NavGroups() {
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/groups${path}`);
  };

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => handleClick("")}
            className="cursor-pointer hover:underline"
          >
            Groupes{" "}
            {AVAILABLE_GROUPS.length > 0 && `(${AVAILABLE_GROUPS.length})`}
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
            <>
              {AVAILABLE_GROUPS.map((group) => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton asChild>
                    <div
                      onClick={() =>
                        handleClick(`?group_id=${group.id}`)
                      }
                      className="cursor-pointer flex items-center"
                    >
                      {group.name}
                    </div>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem 
                        onClick={() => handleClick(`?group_id=${group.id}`)}
                      >
                        <span>Gérer le groupe</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </>
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
