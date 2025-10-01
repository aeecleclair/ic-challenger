"use client";
import { ChevronRight, Users } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useVolunteer } from "../../../hooks/useVolunteer";
import { useMemo } from "react";

export function NavVolunteerShifts() {
  const router = useRouter();
  const { volunteer } = useVolunteer();

  const volunteerShiftsCount = useMemo(() => {
    if (!volunteer) return 0;
    return volunteer.length;
  }, [volunteer]);

  const handleClick = () => {
    router.push("/volunteer-shifts");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div onClick={handleClick} className="cursor-pointer hover:underline">
          Mes Créneaux Bénévoles{" "}
          {volunteerShiftsCount > 0 && `(${volunteerShiftsCount})`}
        </div>
        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
