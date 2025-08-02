"use client";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useProducts } from "@/src/hooks/useProducts";

export function NavProducts() {
  const { products } = useProducts();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/admin/products${path}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => handleClick("")}
          className="cursor-pointer hover:underline"
        >
          Produits {(products?.length ?? 0) > 0 && `(${products!.length})`}
        </div>
        <SidebarMenuAction className="data-[state=open]:rotate-90 mr-2">
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
