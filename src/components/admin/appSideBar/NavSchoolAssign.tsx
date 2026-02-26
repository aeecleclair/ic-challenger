"use client";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "../../ui/sidebar";

import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";

export function NavSchoolAssign() {
  const router = useRouter();

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => router.push(`/admin/school-assign`)}
            className="cursor-pointer hover:underline"
          >
            Assignation école
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
