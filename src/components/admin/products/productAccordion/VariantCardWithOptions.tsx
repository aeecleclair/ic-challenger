import {
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete,
  AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
} from "@/src/api/hyperionSchemas";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/src/components/ui/context-menu";

import { VariantCardOptions } from "./VariantCardOptions";
import { VariantCard } from "./VariantCard";

interface VariantCardWithOptionsProps {
  variant: AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete;
  canEdit?: boolean;
  canRemove?: boolean;
  canDisable?: boolean;
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  showDescription: boolean;
}

export const VariantCardWithOptions = ({
  variant,
  canEdit,
  canRemove,
  canDisable,
  product,
  showDescription,
}: VariantCardWithOptionsProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <VariantCard variant={variant} showDescription={showDescription} />
      </ContextMenuTrigger>
      <VariantCardOptions
        variant={variant}
        canEdit={canEdit}
        canRemove={canRemove}
        canDisable={canDisable}
        productId={product.id}
      />
    </ContextMenu>
  );
};
