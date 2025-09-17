"use client";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "@/src/components/ui/sidebar";

import { useLocations } from "@/src/hooks/useLocations";
import { useRouter } from "next/navigation";

export function NavLocations() {
  const { locations } = useLocations();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/locations${path}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => handleClick("")}
          className="cursor-pointer hover:underline"
        >
          Lieux {(locations?.length ?? 0) > 0 && `(${locations!.length})`}
        </div>
        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
