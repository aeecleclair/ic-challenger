import { Card, CardDescription, CardTitle } from "../../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { useState } from "react";
import { BasketCard } from "./BasketCard";
import { RegistrationSummary } from "./RegistrationSummary";
import { editProductSchema, EditProductValues } from "@/src/forms/editProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { useUser } from "@/src/hooks/useUser";
import { Form } from "../../ui/form";
import { LoadingButton } from "../../custom/LoadingButton";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase } from "@/src/api/hyperionSchemas";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { DialogTitle } from "@radix-ui/react-dialog";

export const WaitingPage = () => {
  const { availableProducts } = useAvailableProducts();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { me } = useUser();
  const { userPurchases, createPurchase, deletePurchase } = useUserPurchases({
    userId: me?.id,
  });
  const form = useForm<EditProductValues>({
    resolver: zodResolver(editProductSchema),
    mode: "onChange",
    defaultValues: {
      products:
        userPurchases
          ?.map((purchase) => {
            const productItem = availableProducts?.find(
              (product) => product.id === purchase.product_variant_id,
            );
            if (!productItem) return undefined;
            return {
              product: productItem,
              quantity: purchase.quantity,
            };
          })
          .filter((item) => item !== undefined) || [],
    },
  });

  async function onSubmit(values: EditProductValues) {
    setIsLoading(true);
    const newPurchases = values.products;

    const requiredProductIds = availableProducts
      ? availableProducts
          .filter((product) => product.product.required === true)
          .map((product) => product.id)
      : [];

    const allPurchasesProductIds = newPurchases.map(
      (purchase) => purchase.product.id,
    );

    const hasAllRequired = requiredProductIds.every((id) =>
      allPurchasesProductIds.includes(id),
    );

    if (!hasAllRequired) {
      for (const id of requiredProductIds) {
        if (!allPurchasesProductIds.includes(id)) {
          const productName = availableProducts?.find(
            (product) => product.product_id === id,
          )?.product.name;
          const index = newPurchases.findIndex(
            (purchase) => purchase.product.id === id,
          );
          form.setError(index !== -1 ? `products.${index}` : "products", {
            type: "manual",
            message: `Le produit ${productName} est requis.`,
          });
        }
      }
      return;
    }

    const toCreate = newPurchases.filter(
      (newPurchase) =>
        !userPurchases?.some(
          (purchase) => purchase.product_variant_id === newPurchase.product.id && purchase.quantity === newPurchase.quantity,
        ),
    );
    const toDelete = userPurchases?.filter(
      (purchase) =>
        !newPurchases.some(
          (newPurchase) =>
            newPurchase.product.id === purchase.product_variant_id,
        ),
    );

    toDelete?.map((purchase) => {
      deletePurchase(purchase.product_variant_id, () => {});
    });

    toCreate.map((purchase) => {
      const body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase =
        {
          product_variant_id: purchase.product.id,
          quantity: purchase.quantity,
        };
      createPurchase(body, () => {});
    });

    setIsLoading(false);
    setOpen(false);
  }

  return (
    <div className="flex w-full flex-col p-12 pt-6">
      <div className="space-y-6">
        <Card className="p-6 bg-red-700 text-white border-red-800 shadow-md shadow-red-500/50">
          <CardTitle>En attente de validation</CardTitle>
          <CardDescription className="text-white">
            Ton inscription est en cours de validation par ton BDS.
          </CardDescription>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTitle className="text-2xl font-bold mb-4">Modifier ma formule</DialogTitle>
          <RegistrationSummary onEdit={() => setOpen(true)} />
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <BasketCard form={form} />
                <LoadingButton type="submit" isLoading={isLoading}>
                  Valider
                </LoadingButton>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
