import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  CompetitionEdition,
  Sport,
  Location,
  CoreSchool,
} from "@/src/api/hyperionSchemas";
import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";

interface ConfigurationStatusCardProps {
  edition: CompetitionEdition;
  podiumStats: { totalRankings: number; schoolsWithRankings: number } | null;
  sports?: Sport[];
  schools?: CoreSchool[];
  locations?: Location[];
  products?: AppModulesSportCompetitionSchemasSportCompetitionProductComplete[];
}

export const ConfigurationStatusCard = ({
  edition,
  podiumStats,
  sports = [],
  schools = [],
  locations = [],
  products = [],
}: ConfigurationStatusCardProps) => {
  // Filter out no_school
  const NoSchoolId = "dce19aa2-8863-4c93-861e-fb7be8f610ed";
  const realSchools = schools.filter((school) => school.id !== NoSchoolId);

  // Calculate configuration status
  const activeSports = sports.filter((sport) => sport.active !== false);
  const enabledProducts = products.filter(
    (product) =>
      product.variants &&
      product.variants.length > 0 &&
      product.variants.some((variant) => variant.enabled !== false),
  );

  const getStatusBadge = (
    condition: boolean,
    trueText: string,
    falseText: string,
  ) => (
    <Badge variant={condition ? "default" : "secondary"}>
      {condition ? trueText : falseText}
    </Badge>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>État de Configuration</CardTitle>
        <CardDescription>
          Résumé de la configuration de la compétition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm">
                    Sports ({activeSports.length}/{sports.length})
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {activeSports.length} sports actifs sur {sports.length} au
                    total
                  </p>
                </TooltipContent>
              </Tooltip>
              {getStatusBadge(
                sports.length > 0,
                sports.length === activeSports.length
                  ? "Tous actifs"
                  : "Partiellement configurés",
                "Aucun sport",
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Écoles</span>
              <Badge variant={realSchools.length > 0 ? "default" : "secondary"}>
                {realSchools.length > 0
                  ? `${realSchools.length} configurées`
                  : "Aucune école"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Lieux</span>
              <Badge variant={locations.length > 0 ? "default" : "secondary"}>
                {locations.length > 0
                  ? `${locations.length} configurés`
                  : "Aucun lieu"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm">
                    Produits ({enabledProducts.length}/{products.length})
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {enabledProducts.length} produits actifs sur{" "}
                    {products.length} au total
                  </p>
                </TooltipContent>
              </Tooltip>
              {getStatusBadge(
                products.length > 0,
                enabledProducts.length === products.length
                  ? "Tous actifs"
                  : "Partiellement actifs",
                "Aucun produit",
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Podium</span>
              <Badge variant={podiumStats ? "default" : "secondary"}>
                {podiumStats
                  ? `${podiumStats.totalRankings} classements`
                  : "Non configuré"}
              </Badge>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
