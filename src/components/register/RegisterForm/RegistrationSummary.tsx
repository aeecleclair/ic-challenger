import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import { useUser } from "@/src/hooks/useUser";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Badge } from "../../ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useSports } from "@/src/hooks/useSports";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";

export const RegistrationSummary = () => {
  const { me } = useUser();
  const { meCompetition } = useCompetitionUser();
  const { meParticipant } = useParticipant();
  const { sports } = useSports();
  const { teams } = useSchoolSportTeams({
    schoolId: me?.school_id,
    sportId: meParticipant?.sport_id,
  });
  const { userPurchases } = useUserPurchases({
    userId: me?.id,
  });

  const team = teams?.find((team) => team.id === meParticipant?.team_id);

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
            <h3 className="font-semibold">Produits sélectionnés</h3>

            {userPurchases && userPurchases.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {userPurchases.map((productItem, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm">
                      {productItem.product_variant_id}
                      {productItem.quantity > 1 &&
                        ` (x${productItem.quantity})`}{" "}
                      -{" "}
                      <span className="font-semibold">
                        {productItem.quantity / 100}€
                      </span>
                    </p>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-muted-foreground">Total:</p>
                  <Badge variant="outline">
                    {userPurchases
                      .reduce(
                        (total, item) =>
                          total + (item.quantity / 100) * item.quantity,
                        0,
                      )
                      .toFixed(2)}
                    €
                  </Badge>
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
