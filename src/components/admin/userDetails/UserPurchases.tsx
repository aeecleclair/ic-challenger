"use client";

import { GetCompetitionProductsResponse } from "@/src/api/hyperionComponents";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete } from "@/src/api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { CreditCard, ShoppingCart } from "lucide-react";

export const UserPurchases = ({
  userPurchases,
  products,
}: {
  userPurchases: AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete[];
  products: GetCompetitionProductsResponse;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Achats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col space-y-6">
          <div>
            <div className="space-y-3">
              {userPurchases.length > 0 ? (
                userPurchases.map((purchase) => {
                  return (
                    <div
                      key={purchase.product_variant_id}
                      className="border p-3 rounded flex-row flex gap-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Produit
                        </p>
                        <p className="text-sm">
                          {purchase.product_variant.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Quantité
                        </p>
                        <p className="text-sm">{purchase.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Montant total
                        </p>
                        <p className="text-sm">
                          {(purchase.product_variant.price *
                            purchase.quantity) /
                            100}{" "}
                          €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Validé
                        </p>
                        <p className="text-sm">
                          {purchase.validated ? "Oui" : "Non"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun achat trouvé.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
