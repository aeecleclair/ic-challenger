"use client";

import { AppSidebar } from "@/src/components/home/AppSideBar/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Separator } from "@/src/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { useUser } from "@/src/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAdmin } = useUser();
  const router = useRouter();

  if (!isAdmin() && typeof window !== "undefined") {
    router.replace("/?redirect=/admin");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {pathname.split("/").map((segment, index) => {
                  if (index < 2 || segment === "") return null;
                  const href = `/${pathname
                    .split("/")
                    .slice(1, index + 1)
                    .join("/")}`;
                  return index === pathname.split("/").length - 1 ? (
                    <BreadcrumbPage key={index}>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink href={href}>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </BreadcrumbLink>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </BreadcrumbItem>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col relative overflow-auto h-full m-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
