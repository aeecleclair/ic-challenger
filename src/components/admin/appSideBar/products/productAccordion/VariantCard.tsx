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

export const VariantCard = ({
  variant,
  showDescription,
}: VariantCardProps) => {
  return (
    <Card
      className={`min-w-40 h-full ${!variant.enabled && "text-muted-foreground"} ${variant.enabled && variant.unique && "cursor-pointer"}`}
    >
      {variant.enabled && variant.unique && (
        <div className="w-full h-0 relative">
          <div
            className={`flex m-auto ${showDescription ? "h-[109px]" : "h-[93px]"} w-full bg-white rounded-md bg-opacity-50`}
          >
            <ReloadIcon className="flex h-6 w-6 animate-spin m-auto" />
          </div>
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1 gap-4">
        <CardTitle
          className={`text-sm font-medium`}
        >
          <span>{variant.name}</span>
        </CardTitle>
        <Badge variant="outline" className="h-6 px-1">
          {variant.unique ? "Unique" : "Multiple"}
        </Badge>
      </CardHeader>
      <CardContent className="flex p-4 pt-0 mr-auto">
        <div
          className={`text-2xl font-bold`}
        >
          <span>{variant.price / 100} €</span>
        </div>
        {showDescription && (
          <p className="text-xs text-muted-foreground">{variant.description}</p>
        )}
      </CardContent>
    </Card>
  );
};
