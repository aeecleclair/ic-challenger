"use client";

import {
  AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
} from "@/src/api/hyperionSchemas";
import { Accordion } from "@/src/components/ui/accordion";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AddProductAccordionItem } from "./AddProductAccordionItem";
import { ProductAccordion } from "./productAccordion/ProductAccordion";
import { useProductExpansionStore } from "@/src/stores/productExpansionStore";

interface SellerProductListProps {
  products: AppModulesSportCompetitionSchemasSportCompetitionProductComplete[];
}

export const SellerProductList = ({ products }: SellerProductListProps) => {
  const searchParams = useSearchParams();
  const activeSellerId = searchParams.get("sellerId");
  const userId = searchParams.get("userId");
  const { productExpansion, setExpandedProducts } = useProductExpansionStore();

  useEffect(() => {
    if (typeof window !== "undefined" && products && products.length > 0) {
      setExpandedProducts(products.map((product) => product.id));
    }
  }, [productExpansion, setExpandedProducts, products, activeSellerId]);

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
              userId={userId!}
              canAdd
              canEdit
              canRemove
              canDisable
              isSelectable
              isAdmin
            />
          ))}
        </Accordion>
      ) : (
        <div className="p-4 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold">No products found</h3>
        </div>
      )}
    </div>
  );
};
