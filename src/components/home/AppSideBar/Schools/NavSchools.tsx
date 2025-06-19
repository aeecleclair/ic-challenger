"use client";
import { Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../ui/sidebar";

import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useRouter } from "next/navigation";

export function NavSchools() {
  const { sportSchools } = useSportSchools();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/schools${path}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => handleClick("")}
          className="cursor-pointer hover:underline"
        >
          Écoles
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
              <span>Ajouter une école</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {sportSchools && (
          <>
            {sportSchools.map((school) => (
              <SidebarMenuItem key={school.school_id}>
                <SidebarMenuButton asChild>
                  <div
                    onClick={() => handleClick(`?school_id=${school.school_id}`)}
                    className="cursor-pointer flex items-center"
                  >
                    {school.school.name}
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
