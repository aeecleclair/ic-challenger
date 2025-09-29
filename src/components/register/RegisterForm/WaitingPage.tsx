import { Card, CardDescription, CardTitle } from "../../ui/card";
import { Dialog, DialogContent } from "../../ui/dialog";
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
import { licenseFormSchema, LicenseFormValues } from "@/src/forms/license";
import { useParticipant } from "@/src/hooks/useParticipant";
import { StyledFormField } from "../../custom/StyledFormField";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { toast } from "../../ui/use-toast";

export const WaitingPage = () => {
  const { availableProducts } = useAvailableProducts();
  const { meParticipant, createParticipant, withdrawParticipant } =
    useParticipant();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { me } = useUser();
  const { userPurchases, createPurchase, deletePurchase } = useUserPurchases({
    userId: me?.id,
  });

  const licenseForm = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseFormSchema),
    mode: "onChange",
    defaultValues: {
      license_number: meParticipant?.license || "",
    },
  });

  const onLicenseFormSubmit = (values: LicenseFormValues) => {
    if (!meParticipant?.sport_id) {
      setLicenseDialogOpen(false);
      toast({
        title: "Erreur",
        description: "Vous devez d'abord sélectionner un sport.",
        variant: "destructive",
      });
      return;
    }
    withdrawParticipant(meParticipant.sport_id, () =>
      createParticipant(
        {
          license: values.license_number!,
          team_id: meParticipant.team_id!,
          substitute: meParticipant.substitute,
        },
        meParticipant.sport_id,
        () => {
          setLicenseDialogOpen(false);
        },
      ),
    );
  };

  const productForm = useForm<EditProductValues>({
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

  async function onProductFormSubmit(values: EditProductValues) {
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

    const hasAllRequired = requiredProductIds.some((id) =>
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
          productForm.setError(
            index !== -1 ? `products.${index}` : "products",
            {
              type: "manual",
              message: `Le produit ${productName} est requis.`,
            },
          );
        }
      }
      return;
    }

    const toCreate = newPurchases.filter(
      (newPurchase) =>
        !userPurchases?.some(
          (purchase) =>
            purchase.product_variant_id === newPurchase.product.id &&
            purchase.quantity === newPurchase.quantity,
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
    setPurchaseDialogOpen(false);
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

        <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
          <RegistrationSummary
            onPurchaseEdit={() => setPurchaseDialogOpen(true)}
            onLicenseEdit={() => setLicenseDialogOpen(true)}
          />
          <DialogContent>
            <Form {...productForm}>
              <form
                onSubmit={productForm.handleSubmit(onProductFormSubmit)}
                className="space-y-4"
              >
                <BasketCard form={productForm} />
                <LoadingButton type="submit" isLoading={isLoading}>
                  Valider
                </LoadingButton>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog open={licenseDialogOpen} onOpenChange={setLicenseDialogOpen}>
          <DialogContent>
            <Form {...licenseForm}>
              <form onSubmit={licenseForm.handleSubmit(onLicenseFormSubmit)}>
                <div className="flex flex-col items-center gap-8">
                  <StyledFormField
                    form={licenseForm}
                    label="Numéro de licence"
                    id="license_number"
                    input={(field) => <Input {...field} className="" />}
                  />
                  <Button
                    type="submit"
                    disabled={!licenseForm.formState.isValid}
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
