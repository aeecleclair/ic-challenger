import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/src/api/hyperionSchemas";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

interface VariantCardProps {
  variant: AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete;
  showDescription: boolean;
}

export const VariantCard = ({ variant, showDescription }: VariantCardProps) => {
  return (
    <Card
      className={`min-w-40 h-full ${!variant.enabled && "text-muted-foreground"}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1 gap-4">
        <CardTitle className={`text-sm font-medium`}>
          <span>{variant.name}</span>
        </CardTitle>
        <div className="flex flex-row items-center">
          <Badge variant="outline" className="h-6 px-1">
            {variant.public_type}
          </Badge>
          <div className="w-2"></div>
          <Badge className="h-6 px-1">{variant.school_type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex p-4 pt-0 mr-auto">
        <div className={`text-2xl font-bold`}>
          <span>{variant.price / 100} €</span>
        </div>
        {showDescription && (
          <p className="text-xs text-muted-foreground">{variant.description}</p>
        )}
      </CardContent>
    </Card>
  );
};
