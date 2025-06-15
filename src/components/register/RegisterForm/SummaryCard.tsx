import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { registeringFormSchema } from "@/src/forms/registering";
import { useUser } from "@/src/hooks/useUser";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { CardTemplate } from "./CardTemplate";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { CheckCircle2 } from "lucide-react";

interface SummaryCardProps {
  form: UseFormReturn<z.infer<typeof registeringFormSchema>>;
}

export const SummaryCard = ({ form }: SummaryCardProps) => {
  const { me } = useUser();
  const formValues = form.getValues();
  const status = formValues.status;

  return (
    <CardTemplate>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Récapitulatif de ton inscription
        </h2>

        {/* Personal Information */}
        <div className="space-y-2">
          <h3 className="font-semibold">Informations personnelles</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Nom</p>
              <p>{me?.firstname || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prénom</p>
              <p>{me?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">École</p>
              <p>{me?.school_id ? formatSchoolName(me?.school?.name) : "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p>{formValues.phone || "-"}</p>
            </div>
          </div>
        </div>

        {/* Participation Details */}
        <div className="space-y-2">
          <h3 className="font-semibold">Participation</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Statut:</p>
            <Badge>{status}</Badge>
          </div>

          {status === "sport" && formValues.sport && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Sport</p>
                <p>{formValues.sport.id || "-"} {formValues.sport.sex ? `(${formValues.sport.sex})` : ""}</p>
              </div>

              {formValues.sport.team_leader && (
                <div>
                  <p className="text-sm text-muted-foreground">Équipe</p>
                  <p>{formValues.sport.team || "-"}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Package and Options */}
        <div className="space-y-2">
          <h3 className="font-semibold">Package et Options</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Package:</p>
            <Badge variant="outline">{formValues.package}</Badge>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-2">
            {formValues.party && (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-sm">Soirée</p>
              </div>
            )}

            {formValues.bottle && (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-sm">Gourde</p>
              </div>
            )}

            {formValues.tShirt && (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-sm">T-shirt {formValues.tShirtSize || ""}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardTemplate>
  );
};
