"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useAllTeams } from "@/src/hooks/useAllTeams";

export function NavTeams() {
  const router = useRouter();
  const { allTeams } = useAllTeams();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/teams")}
          className="cursor-pointer hover:underline"
        >
          Équipes{" "}
          {(allTeams?.length ?? 0) > 0 && `(${allTeams!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
