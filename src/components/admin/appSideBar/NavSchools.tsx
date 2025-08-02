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
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useRouter } from "next/navigation";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

export function NavSchools() {
  const { sportSchools } = useSportSchools();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/schools${path}`);
  };

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => handleClick("")}
            className="cursor-pointer hover:underline"
          >
            Écoles{" "}
            {(sportSchools?.length ?? 0) > 0 && `(${sportSchools!.length})`}
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
                  <span>Ajouter une école</span>
                  <Plus className="h-4 w-4" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {sportSchools && (
              <>
                {sportSchools.map((school) => (
                  <SidebarMenuItem key={school.school_id}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() =>
                          handleClick(`?school_id=${school.school_id}`)
                        }
                        className="cursor-pointer flex items-center"
                      >
                        {formatSchoolName(school.school.name)}
                      </div>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem onClick={() => {}}>
                          <span>
                            {/* {sport.active ? "Désactiver" : "Activer"} */}
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
