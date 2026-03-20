"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";

export function NavVolunteerShifts() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/volunteer-shifts")}
          className="cursor-pointer hover:underline"
        >
          Bénévolat
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
