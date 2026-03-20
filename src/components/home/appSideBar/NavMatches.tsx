"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";

export function NavMatches() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/matches")}
          className="cursor-pointer hover:underline"
        >
          Mes Matchs
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
