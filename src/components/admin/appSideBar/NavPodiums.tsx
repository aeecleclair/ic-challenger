"use client";
import { ChevronRight, MoreHorizontal, Trophy } from "lucide-react";
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
import { useSports } from "@/src/hooks/useSports";
import { useRouter } from "next/navigation";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";

export function NavPodiums() {
  const { sports } = useSports();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/podiums${path}`);
  };

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => handleClick("")}
            className="cursor-pointer hover:underline"
          >
            Podiums {(sports?.length ?? 0) > 0 && `(${sports!.length} sports)`}
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
                  onClick={() => handleClick("")}
                  className="cursor-pointer flex justify-between items-center"
                >
                  <span>Podium global</span>
                  <Trophy className="h-4 w-4" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {sports && (
              <>
                {sports.map((sport) => (
                  <SidebarMenuItem key={sport.id}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => handleClick(`?sport_id=${sport.id}`)}
                        className="cursor-pointer flex items-center"
                      >
                        {sport.name}
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
                          onClick={() => handleClick(`?sport_id=${sport.id}`)}
                        >
                          <span>Voir le podium</span>
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
