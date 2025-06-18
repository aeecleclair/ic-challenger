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

  const handleAddSchool = () => {
    router.push("/admin/schools/create");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Écoles</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div onClick={handleAddSchool}>
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
                  <a href={school.school_id}>
                    <span>{school.school.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
