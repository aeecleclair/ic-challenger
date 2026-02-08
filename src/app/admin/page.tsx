"use client";

import EditionForm from "@/src/components/admin/EditionForm";
import { EditionFormSchema, editionFormSchema } from "@/src/forms/edition";
import { useEdition } from "@/src/hooks/useEdition";
import { useUser } from "@/src/hooks/useUser";
import { useSports } from "@/src/hooks/useSports";
import { useLocations } from "@/src/hooks/useLocations";
import { useProducts } from "@/src/hooks/useProducts";
import { usePodiums } from "@/src/hooks/usePodiums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ConfigurationStatusCard,
  LocationsCard,
  ProductsCard,
  SportsCard,
  SchoolsCard,
} from "@/src/components/admin/home";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { CustomDialog } from "@/src/components/custom/CustomDialog";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "@/src/components/ui/use-toast";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";

const AdminPage = () => {
  const {
    edition,
    createEdition,
    isCreationLoading,
    openEditionInscription,
    closeEditionInscription,
    isOpenInscriptionLoading,
    isCloseInscriptionLoading,
  } = useEdition();
  const { isAdmin } = useUser();
  const { token } = useAuth();
  const { sportSchools: schools } = useSportSchools();
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
    <>
      {isAdmin() && edition === null && (
        <EditionForm
          form={form}
          isLoading={isCreationLoading}
          onSubmit={onSubmit}
          submitLabel="Créer l'édition"
        />
      )}

      {isAdmin() && edition && (
        <div className="space-y-6">
          {/* Header with title and action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {edition.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
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
                  onCloseInscription={closeEditionInscription}
                  isOpenInscriptionLoading={isOpenInscriptionLoading}
                  isCloseInscriptionLoading={isCloseInscriptionLoading}
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
    </>
  );
};

export default AdminPage;
