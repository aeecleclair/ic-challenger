import { StyledFormField } from "../../custom/StyledFormField";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { UseFormReturn } from "react-hook-form";
import { RegisteringFormValues } from "@/src/forms/registering";
import { CardTemplate } from "./CardTemplate";
import { Checkbox } from "../../ui/checkbox";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/src/api/hyperionSchemas";
import { EditProductValues } from "@/src/forms/editProducts";
import { Input } from "../../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useEffect } from "react";

interface PackageCardProps {
  form: UseFormReturn<EditProductValues | RegisteringFormValues>;
}

export const BasketCard = ({ form }: PackageCardProps) => {
  const { availableProducts } = useAvailableProducts();
  const purchases = form.watch("products");
  const ids = purchases.map((purchase) => purchase.product.id);

  const groupedByProductId: Record<
    string,
    AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete[]
  > = {};
  availableProducts?.forEach((product) => {
    if (product.enabled !== true) return;
    if (!groupedByProductId[product.product_id]) {
      groupedByProductId[product.product_id] = [];
    }
    groupedByProductId[product.product_id].push(product);
  });

  const selectedPerProduct: Record<string, string[]> = {};
  Object.entries(groupedByProductId).forEach(([productId, products]) => {
    selectedPerProduct[productId] = products
      .filter((product) => ids.includes(product.id))
      .map((product) => product.id);
  });

  // Check if at least one required product is selected
  const requiredProducts = Object.entries(groupedByProductId).filter(
    ([_, products]) => products[0].product.required,
  );
  const hasRequiredProductSelected = requiredProducts.some(
    ([productId]) =>
      selectedPerProduct[productId] && selectedPerProduct[productId].length > 0,
  );

  // Set form error if no required products are selected
  useEffect(() => {
    if (requiredProducts.length > 0 && !hasRequiredProductSelected) {
      form.setError("products", {
        type: "required",
        message: "Vous devez sélectionner au moins un produit obligatoire",
      });
    } else {
      form.clearErrors("products");
    }
  }, [hasRequiredProductSelected, requiredProducts.length, form]);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Ta formule :</h2>
          {requiredProducts.length > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-blue-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Au moins un produit obligatoire doit être sélectionné. Les
                  produits obligatoires sont marqués d&apos;un astérisque (*) et
                  mis en évidence.
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {form.formState.errors.products && (
          <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded p-3">
            {form.formState.errors.products.message}
          </div>
        )}
        {Object.entries(groupedByProductId).map(([productId, products]) => {
          const product = products[0];
          const purchase = purchases.find((p) => p.product.id === product.id);
          return (
            <div
              key={productId}
              className={`${
                product.product.required
                  ? "border-2 border-red-200 bg-red-50 rounded-lg p-4"
                  : ""
              }`}
            >
              {product.product.required && (
                <div className="mb-2 text-red-600 text-sm font-semibold flex items-center gap-1">
                  <span className="text-red-500">⚠️</span> Produit obligatoire
                </div>
              )}
              <StyledFormField
                form={form}
                label={`${product.product.name}${product.product.required ? " *" : ""}`}
                id={`products[${productId}]`}
                input={(field) => (
                  <>
                    {products.length > 1 ? (
                      <div className="flex items-center space-x-2 pt-2">
                        <RadioGroup
                          onValueChange={(value) => {
                            form.setValue("products", [
                              ...purchases.filter(
                                (purchase) =>
                                  purchase.product.id !==
                                  selectedPerProduct[productId][0],
                              ),
                              {
                                product: availableProducts?.find(
                                  (product) => product.id === value,
                                )!,
                                quantity: 1,
                              },
                            ]);
                          }}
                          defaultValue={selectedPerProduct[productId][0] || ""}
                          value={selectedPerProduct[productId][0] || ""}
                        >
                          {products.map((product) => (
                            <div
                              className="flex items-center space-x-2"
                              key={product.id}
                            >
                              <RadioGroupItem
                                value={product.id}
                                id={`product-${product.id}`}
                              />
                              <Label htmlFor={`product-${product.id}`}>
                                {product.name} - {product.price / 100}€
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <>
                          {!product.unique && ids.includes(product.id) && (
                            <Input
                              type="number"
                              min={1}
                              value={purchase?.quantity || 1}
                              onChange={(e) => {
                                const value = Math.max(
                                  1,
                                  Math.min(99, Number(e.target.value)),
                                );
                                form.setValue(
                                  "products",
                                  purchases.map((p) =>
                                    p.product.id === product.id
                                      ? { ...p, quantity: value }
                                      : p,
                                  ),
                                );
                              }}
                              className="ml-2 w-16"
                            />
                          )}
                        </>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id={`products[${productId}]`}
                          value={product.id}
                          checked={ids.includes(product.id)}
                          onCheckedChange={() => {
                            if (ids.includes(product.id)) {
                              form.setValue(
                                "products",
                                purchases.filter(
                                  (purchase) =>
                                    purchase.product.id !== product.id,
                                ),
                              );
                              return;
                            }
                            form.setValue("products", [
                              ...purchases.filter(
                                (purchase) => purchase.product.id !== productId,
                              ),
                              {
                                product: product,
                                quantity: 1,
                              },
                            ]);
                          }}
                        />
                        <Label htmlFor={`products[${productId}]`}>
                          {product.name} - {product.price / 100}€
                        </Label>
                        {!product.unique && ids.includes(product.id) && (
                          <Input
                            type="number"
                            min={1}
                            value={purchase?.quantity || 1}
                            onChange={(e) => {
                              const value = Math.max(
                                1,
                                Math.min(99, Number(e.target.value)),
                              );
                              form.setValue(
                                "products",
                                purchases.map((p) =>
                                  p.product.id === product.id
                                    ? { ...p, quantity: value }
                                    : p,
                                ),
                              );
                            }}
                            className="ml-2 w-16"
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
