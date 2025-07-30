import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/src/components/ui/context-menu";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { useSizeStore } from "@/src/stores/sizeStore";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { AddingVariantCard } from "./AddingVariantCard";
import { ProductAccordionOptions } from "./ProductAccordionOptions";
import { VariantCardWithOptions } from "./VariantCardWithOptions";

interface ProductAccordionProps {
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  canAdd?: boolean;
  canEdit?: boolean;
  canRemove?: boolean;
  canDisable?: boolean;
  userId: string;
  showDescription?: boolean;
  isSelectable?: boolean;
  isAdmin?: boolean;
}

export const ProductAccordion = ({
  product,
  canAdd,
  canEdit,
  canRemove,
  canDisable,
  userId,
  showDescription = false,
  isSelectable = false,
  isAdmin = false,
}: ProductAccordionProps) => {
  const { size } = useSizeStore();
  const numberOfCard = Math.round(size / 20);
  const { userPurchases } = useUserPurchases({ userId: userId });
  const purchasedVariantIds = userPurchases?.map(
    (purchase) => purchase.product_variant_id,
  );
  const variantToDisplay = isAdmin
    ? product.variants
    : product.variants?.filter(
        (variant) =>
          variant.enabled || purchasedVariantIds?.includes(variant.id),
      );

  const isOneVariantTaken = product.variants?.some((variant) =>
    purchasedVariantIds?.includes(variant.id),
  );

  return (
    (isAdmin || (variantToDisplay?.length ?? 0) > 0) && (
      <AccordionItem value={product.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <AccordionTrigger>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col items-start justify-between">
                  <h3 className="text-lg font-semibold flex flex-row">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
              </div>
            </AccordionTrigger>
          </ContextMenuTrigger>
          <ProductAccordionOptions
            product={product}
            canEdit={canEdit}
            canRemove={product.variants?.length === 0 && canRemove}
          />
        </ContextMenu>
        <AccordionContent>
          {/* Take care to export all grid-cols-n
        Can't find a better way to do it for naw */}
          <div className="hidden grid-cols-5" />
          <div className="hidden grid-cols-4" />
          <div className="hidden grid-cols-3" />
          <div className="hidden grid-cols-2" />
          <div className="hidden grid-cols-1" />
          <div
            className={`grid ${showDescription ? "grid-row" : "grid-cols-" + numberOfCard} gap-4`}
          >
            {variantToDisplay && (
              <>
                {canAdd && (
                  <AddingVariantCard
                    productId={product.id}
                  />
                )}
                {variantToDisplay.map((variant) => (
                  <VariantCardWithOptions
                    key={variant.id}
                    variant={variant}
                    product={product}
                    userId={userId}
                    canEdit={canEdit}
                    canRemove={canRemove}
                    canDisable={canDisable}
                    showDescription={showDescription}
                    isSelectable={isSelectable}
                    isAdmin={isAdmin}
                    displayWarning={isOneVariantTaken || !variant.enabled}
                  />
                ))}
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  );
};
