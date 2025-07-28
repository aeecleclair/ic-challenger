"use client";

import {
  SellerComplete,
  Status,
  AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
} from "@/src/api/hyperionSchemas";
import { Accordion } from "@/src/components/ui/accordion";
import { TabsContent } from "@/src/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AddProductAccordionItem } from "./AddProductAccordionItem";
import { ProductAccordion } from "./productAccordion/ProductAccordion";
import { useProductExpansionStore } from "@/src/stores/productExpansionStore";

interface SellerProductListProps {
  status: Status;
  seller: SellerComplete;
  products: AppModulesSportCompetitionSchemasSportCompetitionProductComplete[];
  refetchProducts: () => void;
}

export const SellerProductList = ({
  status,
  seller,
  products,
  refetchProducts,
}: SellerProductListProps) => {
  const searchParams = useSearchParams();
  const activeSellerId = searchParams.get("sellerId");
  const userId = searchParams.get("userId");
  const { productExpansion, setExpandedProducts } = useProductExpansionStore();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      productExpansion[seller.id] === undefined &&
      seller.id === activeSellerId &&
      products &&
      products.length > 0
    ) {
      setExpandedProducts(
        seller.id,
        products.map((product) => product.id),
      );
    }
  }, [
    productExpansion,
    seller.id,
    setExpandedProducts,
    products,
    activeSellerId,
  ]);

  return (
    <TabsContent value={seller.id} className="min-w-96 w-full">
      <AddProductAccordionItem
        seller={seller}
        refreshProduct={refetchProducts}
      />
      {products.length > 0 ? (
        <Accordion
          type="multiple"
          value={productExpansion[seller.id]}
          onValueChange={(value) => setExpandedProducts(seller.id, value)}
        >
          {products.map((product) => (
            <ProductAccordion
              key={product.id}
              product={product}
              sellerId={seller.id}
              userId={userId!}
              canAdd={status.status !== "closed"}
              canEdit={
                status.status === "pending" ||
                (status.status === "online" && !product.available_online)
              }
              canRemove={
                status.status === "pending" ||
                (status.status === "online" && !product.available_online)
              }
              canDisable={status.status !== "closed"}
              refreshProduct={refetchProducts}
              isSelectable={status.status === "onsite"}
              isAdmin
            />
          ))}
        </Accordion>
      ) : (
        <div className="p-4 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold">No products found</h3>
        </div>
      )}
    </TabsContent>
  );
};
