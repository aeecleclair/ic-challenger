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
  sellerId: string;
  userId: string;
  showDescription: boolean;
  refreshProduct: () => void;
  isSelectable: boolean;
  isAdmin: boolean;
  displayWarning?: boolean;
}

export const VariantCardWithOptions = ({
  variant,
  canEdit,
  canRemove,
  canDisable,
  product,
  sellerId,
  userId,
  showDescription,
  refreshProduct,
  isSelectable,
  isAdmin,
  displayWarning,
}: VariantCardWithOptionsProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <VariantCard
          variant={variant}
          sellerId={sellerId}
          userId={userId}
          showDescription={showDescription}
          isSelectable={isSelectable}
          isAdmin={isAdmin}
          displayWarning={displayWarning}
          productId={product.id}
        />
      </ContextMenuTrigger>
      <VariantCardOptions
        variant={variant}
        canEdit={canEdit}
        canRemove={canRemove}
        canDisable={canDisable}
        sellerId={sellerId}
        productId={product.id}
        userId={userId}
        refreshProduct={refreshProduct}
      />
    </ContextMenu>
  );
};
