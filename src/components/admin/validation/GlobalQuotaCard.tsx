import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Users, CheckCircle, AlertCircle, School } from "lucide-react";

interface GlobalQuotaCardProps {
  totalParticipants: number;
  totalValidated: number;
  sportQuotas: any[];
  schoolName: string;
}

export const GlobalQuotaCard = ({
  totalParticipants,
  totalValidated,
  sportQuotas,
  schoolName,
}: GlobalQuotaCardProps) => {
  const totalQuota = sportQuotas.reduce(
    (sum, quota) => sum + (quota?.participant_quota || 0),
    0,
  );
  const isOverGlobalQuota = totalQuota > 0 && totalParticipants > totalQuota;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Aperçu global - {schoolName}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isOverGlobalQuota && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Quota global dépassé
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total participants</span>
            </div>
            <div
              className={`text-2xl font-bold ${isOverGlobalQuota ? "text-destructive" : ""}`}
            >
              {totalParticipants}
            </div>
            {totalQuota > 0 && (
              <div className="text-xs text-muted-foreground">
                Quota total: {totalQuota}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Participants validés
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {totalValidated}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalParticipants > 0
                ? Math.round((totalValidated / totalParticipants) * 100)
                : 0}
              % validés
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">En attente</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {totalParticipants - totalValidated}
            </div>
            <div className="text-xs text-muted-foreground">
              Participants non validés
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Progression de validation
            </span>
            <span className="font-medium">
              {totalValidated} / {totalParticipants}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-primary rounded-full h-3 transition-all"
              style={{
                width: `${totalParticipants > 0 ? (totalValidated / totalParticipants) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
