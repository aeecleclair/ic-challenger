"use client";

import { AppSidebar } from "@/src/components/register/AppSideBar/AppSidebar";
import { RegisterForm } from "@/src/components/register/RegisterForm/RegisterForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { Separator } from "@/src/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { RegisterState } from "@/src/infra/registerState";
import { useState } from "react";

const Register = () => {
  const { isTokenQueried, token } = useAuth();
  const router = useRouter();

  if (isTokenQueried && token === null) {
    router.replace("/login");
  }

  const [state, setState] = useState<RegisterState>({
    currentStep: 0,
    stepDone: 0,
    headerTitle: "Inscription",
    headerSubtitle: "Informations",
    allHeaderSubtitles: [
      "Informations",
      "Participation",
      "Package",
      "Récapitulatif",
    ],
    pageFields: {
      Informations: ["phone"],
      Participation: ["status"],
      Package: ["package", "party", "bottle", "tShirt"],
      Sport: ["sport.id", "sport.sex"],
    } as const,
  });
  return (
    <SidebarProvider>
      <AppSidebar state={state} />
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
                  <BreadcrumbLink href="#">{state.headerTitle}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{state.headerSubtitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <RegisterForm setState={setState} state={state} />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Register;
