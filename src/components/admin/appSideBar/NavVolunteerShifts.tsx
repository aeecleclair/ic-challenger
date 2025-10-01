"use client";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "../../ui/sidebar";

import { useRouter } from "next/navigation";
import { Collapsible, CollapsibleTrigger } from "../../ui/collapsible";

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
            <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
              <ChevronRight />
              <span className="sr-only">Toggle</span>
            </SidebarMenuAction>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
      </SidebarGroup>
    </Collapsible>
  );
}
