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
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import {
  AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
  CompetitionUserBase,
  ParticipantInfo,
} from "@/src/api/hyperionSchemas";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useUser } from "@/src/hooks/useUser";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";

const Register = () => {
  const { isTokenQueried, token } = useAuth();
  const { me, updateUser } = useUser();
  const { meCompetition, createCompetitionUser } = useCompetitionUser();
  const { meParticipant, createParticipant } = useParticipant();
  const { userPurchases, createPurchase, deletePurchase } = useUserPurchases({
    userId: me?.id,
  });
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
      Informations: ["phone", "sex"],
      Participation: [],
      Sport: ["sport.id", "sport.team_id"],
      Package: [],
      Récapitulatif: [],
    } as const,
    onValidateCardActions: {
      Informations: (values, callback) => {
        if (values.phone !== me!.phone) {
          updateUser({ phone: "+" + values.phone }, callback);
        } else {
          callback();
        }
      },
      Participation: (values, callback) => {
        if (meCompetition !== undefined) {
          callback();
          return;
        }
        const body: CompetitionUserBase = {
          sport_category: values.sex,
          is_athlete: values.is_athlete,
          is_cameraman: values.is_cameraman,
          is_fanfare: values.is_fanfare,
          is_pompom: values.is_pompom,
          is_volunteer: values.is_volunteer,
        };
        createCompetitionUser(body, callback);
      },
      Sport: (values, callback) => {
        if (meParticipant !== undefined) {
          callback();
          return;
        }
        const body: ParticipantInfo = {
          license: values.sport!.license_number!,
          team_id: values.sport!.team_id!,
          substitute: values.sport!.substitute,
        };
        createParticipant(body, values.sport!.id, callback);
      },
      Package: (values, callback) => {
        const newPurchases = values.products;

        const toCreate = newPurchases.filter(
          (newPurchase) =>
            !userPurchases?.some(
              (purchase) =>
                purchase.product_variant_id === newPurchase.product.id,
            ),
        );
        const toDelete = userPurchases?.filter(
          (purchase) =>
            !newPurchases.some(
              (newPurchase) =>
                newPurchase.product.id === purchase.product_variant_id,
            ),
        );

        toCreate.map((purchase) => {
          const body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase =
            {
              product_variant_id: purchase.product.id,
              quantity: purchase.quantity,
            };
          createPurchase(body, () => {});
        });

        toDelete?.map((purchase) => {
          deletePurchase(me?.id!, purchase.product_variant_id, () => {});
        });
        callback();
      },
      Récapitulatif: (values, callback) => {},
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
