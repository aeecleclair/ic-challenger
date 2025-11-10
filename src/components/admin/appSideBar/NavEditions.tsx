"use client";
import { ChevronRight } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "../../ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { useRouter } from "next/navigation";
import { useEditions } from "@/src/hooks/useEditions";

export function NavEditions() {
  const router = useRouter();
  const { editions } = useEditions();

  return (
    <Collapsible asChild defaultOpen={false}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <div
            onClick={() => router.push(`/admin/editions`)}
            className="cursor-pointer hover:underline"
          >
            Edition {(editions?.length ?? 0) > 0 && `(${editions?.length})`}
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
