"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useVolunteerShifts } from "@/src/hooks/useVolunteerShifts";

export function NavVolunteerShifts() {
  const router = useRouter();
  const { volunteerShifts } = useVolunteerShifts();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/volunteer-shifts")}
          className="cursor-pointer hover:underline"
        >
          Créneaux Bénévoles{" "}
          {(volunteerShifts?.length ?? 0) > 0 &&
            `(${volunteerShifts!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
