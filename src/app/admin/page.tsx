"use client";

import EditionForm from "@/src/components/admin/EditionForm";
import { EditionFormSchema, editionFormSchema } from "@/src/forms/edition";
import { useEdition } from "@/src/hooks/useEdition";
import { useUser } from "@/src/hooks/useUser";
import { useSchools } from "@/src/hooks/useSchools";
import { useSports } from "@/src/hooks/useSports";
import { useLocations } from "@/src/hooks/useLocations";
import { useProducts } from "@/src/hooks/useProducts";
import { usePodiums } from "@/src/hooks/usePodiums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { Badge } from "@/src/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ConfigurationStatusCard,
  LocationsCard,
  ProductsCard,
  SportsCard,
  SchoolsCard,
} from "@/src/components/admin/home";

const AdminPage = () => {
  const {
    edition,
    createEdition,
    isCreationLoading,
    openEditionInscription,
    isOpenInscriptionLoading,
  } = useEdition();
  const { isAdmin } = useUser();
  const { schools } = useSchools();
  const { sports } = useSports();
  const { locations } = useLocations();
  const { products } = useProducts();
  const { globalPodium } = usePodiums();

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: {},
    mode: "onChange",
  });

  const stats = useMemo(() => {
    if (!schools || !sports) {
      return null;
    }

    const totalSchools = schools.length;
    const totalSports = sports.length;
    const totalLocations = locations?.length || 0;
    const totalProducts = products?.length || 0;

    // Calculate total product variants
    const totalVariants =
      products?.reduce(
        (acc, product) => acc + (product.variants?.length || 0),
        0,
      ) || 0;

    // Calculate podium statistics
    const podiumStats = globalPodium
      ? {
          totalRankings: globalPodium.length,
          schoolsWithRankings: new Set(globalPodium.map((p) => p.school_id))
            .size,
        }
      : null;

    return {
      totalSchools,
      totalSports,
      totalLocations,
      totalProducts,
      totalVariants,
      podiumStats,
    };
  }, [schools, sports, locations, products, globalPodium]);

  const isPreRegistration = useMemo(() => {
    if (!edition) return false;
    const now = new Date();
    const startDate = new Date(edition.start_date);
    return now < startDate;
  }, [edition]);

  function onSubmit(values: EditionFormSchema) {
    createEdition(
      {
        name: values.name,
        start_date: values.startDate.toISOString().slice(0, 10),
        end_date: values.endDate.toISOString().slice(0, 10),
        year: values.startDate.getFullYear(),
        active: true,
      },
      () => {
        form.reset();
      },
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {isAdmin() && edition === null && (
        <EditionForm
          form={form}
          isLoading={isCreationLoading}
          onSubmit={onSubmit}
          submitLabel="Créer l'édition"
        />
      )}

      {isAdmin() && edition && !isPreRegistration && (
        <div className="space-y-6">
          {/* Edition Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {edition.name}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {format(new Date(edition.start_date), "dd MMMM yyyy", {
                    locale: fr,
                  })}{" "}
                  -{" "}
                  {format(new Date(edition.end_date), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </span>
              </div>
            </div>
          </div>

          {stats && (
            <>
              {/* Details sections */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ConfigurationStatusCard
                  edition={edition}
                  podiumStats={stats.podiumStats}
                  sports={sports}
                  schools={schools}
                  locations={locations}
                  products={products}
                  onOpenInscription={openEditionInscription}
                  isOpenInscriptionLoading={isOpenInscriptionLoading}
                />

                <LocationsCard locations={locations || []} />

                <ProductsCard products={products || []} />
              </div>

              {/* Core entities overview */}
              <div className="grid gap-6 md:grid-cols-2">
                <SportsCard sports={sports || []} />

                <SchoolsCard schools={schools || []} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
