import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/src/components/ui/context-menu";
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
  showDescription?: boolean;
}

export const ProductAccordion = ({
  product,
  canAdd,
  canEdit,
  canRemove,
  canDisable,
  showDescription = false,
}: ProductAccordionProps) => {
  const { size } = useSizeStore();
  const numberOfCard = Math.round(size / 15);

  return (
    ((product.variants?.length ?? 0) > 0) && (
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
            {product.variants && (
              <>
                {canAdd && (
                  <AddingVariantCard
                    productId={product.id}
                  />
                )}
                {product.variants.map((variant) => (
                  <VariantCardWithOptions
                    key={variant.id}
                    variant={variant}
                    product={product}
                    canEdit={canEdit}
                    canRemove={canRemove}
                    canDisable={canDisable}
                    showDescription={showDescription}
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
