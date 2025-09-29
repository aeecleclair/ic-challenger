import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import { useUser } from "@/src/hooks/useUser";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Badge } from "../../ui/badge";
import { Edit } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useSports } from "@/src/hooks/useSports";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { useState } from "react";
import { StyledFormField } from "../../custom/StyledFormField";
import { Input } from "../../ui/input";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { licenseFormSchema, LicenseFormValues } from "@/src/forms/license";
import { Button } from "react-day-picker";

interface RegistrationSummaryProps {
  onEdit?: () => void;
}

export const RegistrationSummary = ({ onEdit }: RegistrationSummaryProps) => {
  const { me } = useUser();
  const { availableProducts } = useAvailableProducts();
  const { meCompetition } = useCompetitionUser();
  const { meParticipant, createParticipant, withdrawParticipant } =
    useParticipant();
  const { sports } = useSports();
  const { teams } = useSchoolSportTeams({
    schoolId: me?.school_id,
    sportId: meParticipant?.sport_id,
  });
  const { userPurchases } = useUserPurchases({
    userId: me?.id,
  });

  const purchasedItems = userPurchases?.map((purchase) => {
    return availableProducts?.find(
      (product) => product.id === purchase.product_variant_id,
    );
  });

  const total = purchasedItems?.reduce((acc, item) => {
    if (item) {
      return (
        acc +
        (item.price *
          (userPurchases?.find((p) => p.product_variant_id === item.id)
            ?.quantity || 1)) /
          100
      );
    }
    return acc;
  }, 0);

  const team = teams?.find((team) => team.id === meParticipant?.team_id);

  const form = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseFormSchema),
    mode: "onChange",
    defaultValues: {
      license_number: meParticipant?.license || "",
    },
  });

  const onSubmit = (values: LicenseFormValues) => {
    if (!meParticipant?.sport_id) return;
    withdrawParticipant(meParticipant.sport_id, () =>
      createParticipant(
        {
          license: values.license_number!,
          team_id: meParticipant.team_id!,
          substitute: meParticipant.substitute,
        },
        meParticipant.sport_id,
        () => {},
      ),
    );
  };

  return (
    <>
      <h2 className="text-xl font-semibold">
        Récapitulatif de ton inscription
      </h2>

      <div className="space-y-2">
        <h3 className="font-semibold">Informations personnelles</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Prénom</p>
            <p>{me?.firstname || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nom</p>
            <p>{me?.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">École</p>
            <p>{me?.school_id ? formatSchoolName(me?.school?.name) : "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Téléphone</p>
            <p>{me?.phone || "-"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3 className="font-semibold">Participation</h3>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {meCompetition?.is_athlete && meParticipant && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium">Sportif</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Sport</p>
                      <p>
                        {sports?.find(
                          (sport) => sport.id === meParticipant.sport_id,
                        )?.name || "-"}{" "}
                        {meCompetition?.sport_category
                          ? `(${meCompetition.sport_category!})`
                          : ""}
                      </p>
                    </div>

                    {meParticipant.team_id && (
                      <div>
                        <p className="text-sm text-muted-foreground">Équipe</p>
                        <p>
                          {team?.name || "-"}{" "}
                          {team?.captain_id === me?.id ? "(capitaine)" : ""}
                        </p>
                      </div>
                    )}

                    {meParticipant.license === null ||
                    meParticipant.license === undefined ? (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                          <div className="flex items-center gap-2">
                            <StyledFormField
                              form={form}
                              label="Numéro de licence"
                              id="sport.license_number"
                              input={(field) => (
                                <Input {...field} className="w-60" />
                              )}
                            />
                            <Button
                              type="submit"
                              disabled={!form.formState.isValid}
                            >
                              Enregistrer
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          License{" "}
                          {meParticipant.is_license_valid
                            ? "Validée"
                            : "non validée"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {meCompetition?.is_cameraman && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Caméraman</p>
                </div>
              )}

              {meCompetition?.is_fanfare && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Fanfaron</p>
                </div>
              )}

              {meCompetition?.is_pompom && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Pompom</p>
                </div>
              )}

              {meCompetition?.is_volunteer && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Bénévole</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Produits sélectionnés</h3>
              {onEdit && (
                <button
                  type="button"
                  className="p-1 rounded hover:bg-muted transition-colors"
                  aria-label="Modifier les produits"
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4 text-primary" />
                </button>
              )}
            </div>

            {userPurchases && userPurchases.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {userPurchases.map((productItem, index) => {
                  const product = availableProducts?.find(
                    (p) => p.id === productItem.product_variant_id,
                  );
                  if (!product) return null;

                  return (
                    <div key={index} className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <p className="text-sm">
                        {product.product.name}
                        {productItem.quantity > 1 &&
                          ` (x${productItem.quantity})`}{" "}
                        -{" "}
                        <span className="font-semibold">
                          {(product.price * productItem.quantity) / 100}€
                        </span>
                      </p>
                    </div>
                  );
                })}

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-muted-foreground">Total:</p>
                  <Badge variant="outline">{total?.toFixed(2)}€</Badge>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 mt-2">
                <p className="text-sm text-muted-foreground">
                  Aucun produit sélectionné
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
