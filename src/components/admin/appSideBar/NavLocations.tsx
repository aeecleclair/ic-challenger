"use client";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useLocations } from "@/src/hooks/useLocations";
import { useRouter } from "next/navigation";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";

export function NavLocations() {
  const { locations } = useLocations();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/locations${path}`);
  };

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => handleClick("")}
            className="cursor-pointer hover:underline"
          >
            Lieux{" "}
            {(locations?.length ?? 0) > 0 && `(${locations!.length})`}
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
              <SidebarMenuButton asChild>
                <div
                  onClick={() => handleClick("/create")}
                  className="cursor-pointer flex justify-between items-center"
                >
                  <span>Ajouter un lieu</span>
                  <Plus className="h-4 w-4" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {locations && (
              <>
                {locations.map((location) => (
                  <SidebarMenuItem key={location.id}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() =>
                          handleClick(`?location_id=${location.id}`)
                        }
                        className="cursor-pointer flex items-center"
                      >
                        {location.name}
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
                          onClick={() =>
                            handleClick(`/edit?location_id=${location.id}`)
                          }
                        >
                          <span>Modifier</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
