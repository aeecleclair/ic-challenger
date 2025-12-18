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
import { useEffect, useState } from "react";
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import {
  AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
  CompetitionUserBase,
  ParticipantInfo,
} from "@/src/api/hyperionSchemas";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useUser } from "@/src/hooks/useUser";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import {
  registeringFormSchema,
  RegisteringFormValues,
} from "@/src/forms/registering";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useEdition } from "@/src/hooks/useEdition";
import { useDocument } from "@/src/hooks/useDocument";

const Register = () => {
  const { edition } = useEdition();
  const { sportSchools } = useSportSchools();
  const { availableProducts, refetchAvailableProducts } =
    useAvailableProducts();
  const { isTokenQueried, token } = useAuth();
  const { me, updateUser } = useUser();
  const { meCompetition, createCompetitionUser, updateCompetitionUser } =
    useCompetitionUser();
  const { meParticipant, createParticipant, withdrawParticipant } =
    useParticipant();
  const { userMePurchases, createPurchase, deletePurchase } = useUserPurchases({
    userId: me?.id,
  });
  const { document, uploadDocument } = useDocument();
  const router = useRouter();

  if (isTokenQueried && token === null) {
    router.replace("/login");
  }
  const userSportSchool = sportSchools?.find(
    (school) => school.school_id === me?.school_id,
  );
  if (
    edition?.inscription_enabled === false ||
    userSportSchool?.inscription_enabled === false
  ) {
    router.replace("/");
  }

  const form = useForm<RegisteringFormValues>({
    resolver: zodResolver(registeringFormSchema),
    mode: "onChange",
    defaultValues: {
      is_athlete: false,
      is_cameraman: false,
      is_fanfare: false,
      is_pompom: false,
      allow_pictures: true,
      sport: {},
      products:
        userMePurchases
          ?.map((purchase) => {
            const productItem = availableProducts?.find(
              (product) => product.id === purchase.product_variant_id,
            );
            if (!productItem) return undefined;
            return {
              product: productItem,
              quantity: purchase.quantity,
            };
          })
          .filter((item) => item !== undefined) || [],
    },
  });

  const [state, setState] = useState<RegisterState>({
    currentStep: 0,
    stepDone: 0,
    headerTitle: "Inscription",
    headerSubtitle: "Informations",
    allHeaderSubtitles: [
      "Informations",
      "Participation",
      "Panier",
      "Récapitulatif",
    ],
    pageFields: {
      Informations: ["phone", "sex", "allow_pictures"],
      Participation: [],
      Sport: ["sport.id", "sport.team_id"],
      Panier: [],
      Récapitulatif: [],
    } as const,
    onValidateCardActions: {
      Informations: (values, callback) => {},
      Participation: (values, callback) => {},
      Sport: (values, callback) => {},
      Panier: (values, callback) => {},
      Récapitulatif: (values, callback) => {},
    } as const,
  });

  useEffect(() => {
    const newSubtitles = [...state.allHeaderSubtitles];
    if (meCompetition?.is_athlete && state.allHeaderSubtitles[2] !== "Sport") {
      newSubtitles.splice(2, 0, "Sport");
    } else if (state.allHeaderSubtitles[2] === "Sport") {
      newSubtitles.splice(2, 1);
    }
    console.log("SETTING VALIDATE ACTIONS");
    setState((state) => ({
      ...state,
      onValidateCardActions: {
        Informations: async (values, callback) => {
          if (values.phone !== me!.phone) {
            await updateUser({ phone: "+" + values.phone }, callback);
          } else {
            callback();
          }
        },
        Participation: async (values, callback) => {
          if (meCompetition !== undefined) {
            if (!values.is_athlete && meParticipant !== undefined) {
              withdrawParticipant(meParticipant.sport_id, () => {});
              return;
            }
            await updateCompetitionUser(
              {
                sport_category: values.sex,
                is_athlete: values.is_athlete,
                is_cameraman: values.is_cameraman,
                is_fanfare: values.is_fanfare,
                is_pompom: values.is_pompom,
                allow_pictures: values.allow_pictures,
              },
              callback,
            );
            return;
          }
          const body: CompetitionUserBase = {
            sport_category: values.sex,
            is_athlete: values.is_athlete,
            is_cameraman: values.is_cameraman,
            is_fanfare: values.is_fanfare,
            is_pompom: values.is_pompom,
            allow_pictures: values.allow_pictures,
          };
          await createCompetitionUser(body, callback);
          await refetchAvailableProducts();
        },
        Sport: async (values, callback) => {
          if (meParticipant !== undefined) {
            await withdrawParticipant(meParticipant.sport_id, async () => {
              await createParticipant(
                {
                  license: values.sport!.license_number!,
                  team_id: values.sport!.team_id!,
                  substitute: values.sport!.substitute,
                },
                values.sport!.id,
                callback,
              );
              if (values.sport?.certificate && document) {
                uploadDocument(document, values.sport!.id, callback);
              }
            });
            return;
          }
          const body: ParticipantInfo = {
            license: values.sport!.license_number!,
            team_id: values.sport!.team_id!,
            substitute: values.sport!.substitute,
          };
          await createParticipant(body, values.sport!.id, async () => {
            if (values.sport?.certificate && document) {
              uploadDocument(document, values.sport!.id, callback);
            }
          });
        },
        Panier: (values, callback) => {
          const newPurchases = values.products;

          const requiredProductIds = availableProducts
            ? availableProducts
                .filter((product) => product.product.required === true)
                .map((product) => product.id)
            : [];

          const allPurchasesProductIds = newPurchases.map(
            (purchase) => purchase.product.id,
          );

          const hasAllRequired = requiredProductIds.some((id) =>
            allPurchasesProductIds.includes(id),
          );

          if (!hasAllRequired) {
            for (const id of requiredProductIds) {
              if (!allPurchasesProductIds.includes(id)) {
                const productName = availableProducts?.find(
                  (product) => product.product_id === id,
                )?.product.name;
                const index = newPurchases.findIndex(
                  (purchase) => purchase.product.id === id,
                );
                form.setError(index !== -1 ? `products.${index}` : "products", {
                  type: "manual",
                  message: `Le produit ${productName} est requis.`,
                });
              }
            }
            return;
          }

          const toCreate = newPurchases.filter(
            (newPurchase) =>
              !userMePurchases?.some(
                (purchase) =>
                  purchase.product_variant_id === newPurchase.product.id &&
                  purchase.quantity === newPurchase.quantity,
              ),
          );
          const toDelete = userMePurchases?.filter(
            (purchase) =>
              !newPurchases.some(
                (newPurchase) =>
                  newPurchase.product.id === purchase.product_variant_id,
              ),
          );

          toDelete?.map((purchase) => {
            deletePurchase(purchase.product_variant_id, () => {});
          });

          toCreate.map((purchase) => {
            const body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase =
              {
                product_variant_id: purchase.product.id,
                quantity: purchase.quantity,
              };
            createPurchase(body, () => {});
          });
          callback();
        },
        Récapitulatif: (values, callback) => {},
      } as const,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, meCompetition, meParticipant, userMePurchases, availableProducts]);

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
        <RegisterForm
          setState={setState}
          state={state}
          form={form}
          userMePurchases={userMePurchases}
        />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Register;
