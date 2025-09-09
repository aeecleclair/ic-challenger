"use client";

import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";
import { Accordion } from "@/src/components/ui/accordion";
import { AddProductAccordionItem } from "./AddProductAccordionItem";
import { ProductAccordion } from "./productAccordion/ProductAccordion";
import { useProductExpansionStore } from "@/src/stores/productExpansionStore";

interface SellerProductListProps {
  products: AppModulesSportCompetitionSchemasSportCompetitionProductComplete[];
}

export const SellerProductList = ({ products }: SellerProductListProps) => {
  const { productExpansion, setExpandedProducts } = useProductExpansionStore();

  return (
    <div className="min-w-96 w-full">
      <AddProductAccordionItem />
      {products.length > 0 ? (
        <Accordion
          type="multiple"
          value={productExpansion}
          onValueChange={(value) => setExpandedProducts(value)}
        >
          {products.map((product) => (
            <ProductAccordion
              key={product.id}
              product={product}
              canAdd
              canEdit
              canRemove
              canDisable
            />
          ))}
        </Accordion>
      ) : (
        <h3 className="text-lg font-semibold text-muted-foreground">
          Pas de produits
        </h3>
      )}
    </div>
  );
};
