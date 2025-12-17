"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Package } from "lucide-react";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { useProducts } from "@/src/hooks/useProducts";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";

interface UserProductsCellProps {
  userId: string;
  fullName: string;
}

export const UserProductsCell = ({
  userId,
  fullName,
}: UserProductsCellProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { userPurchases } = useUserPurchases({
    userId: isOpen ? userId : undefined,
  });
  const { products } = useProducts();
  const { availableProducts } = useAvailableProducts();

  const requiredProducts = React.useMemo(() => {
    if (!userPurchases || !products || !availableProducts) return [];

    return userPurchases
      .map((purchase) => {
        const variant = availableProducts.find(
          (v) => v.id === purchase.product_variant_id,
        );
        const product = products.find((p) => p.id === variant?.product_id);
        return {
          ...purchase,
          variant,
          product,
          isRequired: product?.required || false,
        };
      })
      .filter((p) => p.isRequired);
  }, [userPurchases, products, availableProducts]);

  const hasRequiredProducts = requiredProducts.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={!hasRequiredProducts && isOpen}
        >
          <Package className="h-4 w-4" />
          {hasRequiredProducts ? requiredProducts.length : "Aucun"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Produits obligatoires - {fullName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {!userPurchases ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : requiredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun produit obligatoire pris
            </div>
          ) : (
            <div className="space-y-3">
              {requiredProducts.map((purchase) => (
                <div
                  key={purchase.product_variant_id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{purchase.product?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {purchase.variant?.name} -{" "}
                      {purchase.variant ? purchase.variant.price / 100 : 0}€
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quantité: {purchase.quantity}
                    </div>
                  </div>
                  <div>
                    {purchase.validated ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        Payé
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Non payé</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
