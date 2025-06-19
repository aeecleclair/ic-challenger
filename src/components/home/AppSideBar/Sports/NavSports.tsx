"use client";
import { Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../ui/sidebar";

import { useRouter } from "next/navigation";
import { useSports } from "@/src/hooks/useSports";

export function NavSports() {
  const { sports } = useSports();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/sports${path}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => handleClick("")}
          className="cursor-pointer hover:underline"
        >
          Sports
        </div>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div
              onClick={() => handleClick("/create")}
              className="cursor-pointer flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Ajouter un sport</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {sports && (
          <>
            {sports.map((sport) => (
              <SidebarMenuItem key={sport.id}>
                <SidebarMenuButton asChild>
                  <div
                    onClick={() =>
                      handleClick(`?school_id=${sport.id}`)
                    }
                    className="cursor-pointer flex items-center"
                  >
                    {sport.name} {sport.sport_category && `(${sport.sport_category})`}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
