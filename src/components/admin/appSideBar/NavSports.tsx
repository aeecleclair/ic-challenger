"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useSports } from "@/src/hooks/useSports";

export function NavSports() {
  const { sports } = useSports();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/sports")}
          className="cursor-pointer hover:underline"
        >
          Sports {(sports?.length ?? 0) > 0 && `(${sports!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
