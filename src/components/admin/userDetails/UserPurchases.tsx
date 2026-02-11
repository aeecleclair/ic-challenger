"use client";

import { GetCompetitionProductsResponse } from "@/src/api/hyperionComponents";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete } from "@/src/api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ShoppingCart, CheckCircle, XCircle, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { useMemo } from "react";

export const UserPurchases = ({
  userPurchases,
  products,
}: {
  userPurchases: AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete[];
  products: GetCompetitionProductsResponse;
}) => {
  const totalAmount = useMemo(() => {
    return userPurchases.reduce(
      (sum, purchase) =>
        sum + purchase.product_variant.price * purchase.quantity,
      0,
    );
  }, [userPurchases]);

  const validatedAmount = useMemo(() => {
    return userPurchases
      .filter((p) => p.validated)
      .reduce(
        (sum, purchase) =>
          sum + purchase.product_variant.price * purchase.quantity,
        0,
      );
  }, [userPurchases]);

  const validatedCount = userPurchases.filter((p) => p.validated).length;

  const getProductRequiredStatus = (productVariantId: string) => {
    const product = products?.find((p) =>
      p.variants?.some((v) => v.id === productVariantId),
    );
    return product?.required || false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Achats
          {userPurchases.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {userPurchases.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userPurchases.length > 0 ? (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-center">Quantité</TableHead>
                    <TableHead className="text-right">Prix unitaire</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPurchases.map((purchase) => {
                    const isRequired = getProductRequiredStatus(
                      purchase.product_variant_id,
                    );
                    const unitPrice = purchase.product_variant.price / 100;
                    const totalPrice =
                      (purchase.product_variant.price * purchase.quantity) /
                      100;

                    return (
                      <TableRow key={purchase.product_variant_id}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="font-medium">
                              {purchase.product_variant.name}
                            </div>
                            {purchase.product_variant.description && (
                              <div className="text-xs text-muted-foreground">
                                {purchase.product_variant.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          <Badge variant="outline">{purchase.quantity}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {unitPrice.toFixed(2)} €
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {totalPrice.toFixed(2)} €
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={isRequired ? "default" : "secondary"}
                            className={
                              isRequired
                                ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                : ""
                            }
                          >
                            <Package className="h-3 w-3 mr-1" />
                            {isRequired ? "Requis" : "Optionnel"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {purchase.validated ? (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Validé
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Total des achats
                    </p>
                    <p className="text-2xl font-bold">
                      {(totalAmount / 100).toFixed(2)} €
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Montant validé
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {(validatedAmount / 100).toFixed(2)} €
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Achats validés
                    </p>
                    <p className="text-2xl font-bold">
                      {validatedCount} / {userPurchases.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun achat trouvé.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
