"use client";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";

export function NavPodium() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/podium");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div onClick={handleClick} className="cursor-pointer hover:underline">
          Podiums
        </div>
        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
