"use client";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
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
import { useSports } from "@/src/hooks/useSports";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";

export function NavSports() {
  const { updateSport, sports } = useSports();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/sports${path}`);
  };

  const toggleActivated = (sportId: string, activated: boolean) => {
    updateSport(sportId, { activated: !activated }, () => {
      router.refresh();
    });
  };

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => handleClick("")}
            className="cursor-pointer hover:underline"
          >
            Sports
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
                  <span>Ajouter un sport</span>
                  <Plus className="h-4 w-4" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {sports && (
              <>
                {sports.map((sport) => (
                  <SidebarMenuItem key={sport.id}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => handleClick(`?school_id=${sport.id}`)}
                        className={`"cursor-pointer flex items-center ${sport.activated ? "" : "text-muted-foreground"}`}
                      >
                        {sport.name}{" "}
                        {sport.sport_category &&
                          sport.sport_category.charAt(0).toUpperCase()}
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
                            toggleActivated(sport.id, sport.activated ?? true)
                          }
                        >
                          <span>
                            {sport.activated ? "Désactiver" : "Activer"}
                          </span>
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
