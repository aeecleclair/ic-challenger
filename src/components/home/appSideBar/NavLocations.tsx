"use client";

import { MapPin, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "@/src/components/ui/sidebar";
import { useLocations } from "@/src/hooks/useLocations";
import { useMemo } from "react";

export function NavLocations() {
  const router = useRouter();
  const { locations } = useLocations();

  const totalLocations = useMemo(() => {
    return locations?.length || 0;
  }, [locations]);

  const handleLocationsClick = () => {
    router.push("/locations");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={handleLocationsClick}
          className="cursor-pointer hover:underline"
        >
          Lieux {totalLocations > 0 && `(${totalLocations})`}
        </div>
        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
