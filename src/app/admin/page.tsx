"use client";

import { DataTable } from "@/src/components/admin/registered-table/DataTable";
import { AppSidebar } from "@/src/components/home/AppSideBar/AppSidebar";
import { Breadcrumb,  BreadcrumbItem,  BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/src/components/ui/breadcrumb";
import { Separator } from "@/src/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { useUser } from "@/src/hooks/useUser";
import { useRouter } from "next/navigation";
import { columns, Participant } from "@/src/components/admin/registered-table/Columns";

const Dashboard = () => {
  const { isAdmin } = useUser();
  const router = useRouter();


  if (!isAdmin() && typeof window !== "undefined") {
    router.replace("/?redirect=/admin");
  }

  const data: Participant[] = [
    {
      firstname: "John",
      name: "Doe",
      sport: "Football",
      license: "123456",
      validated: true,
    },
    {
      firstname: "Jane",
      name: "Smith",
      sport: "Basketball",
      license: "654321",
      validated: false,
    },
    {
      firstname: "Alice",
      name: "Johnson",
      sport: "Tennis",
      license: "",
      validated: true,
    },
    {
      firstname: "Bob",
      name: "Brown",
      sport: "Swimming",
      license: "345678",
      validated: false,
    },
    {
      firstname: "Charlie",
      name: "Davis",
      sport: "Cycling",
      license: "901234",
      validated: true,
    },
    {
      firstname: "Eve",
      name: "Wilson",
      sport: "Running",
      license: "567890",
      validated: false,
    },
  ];

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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <DataTable columns={columns} data={data}/>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
