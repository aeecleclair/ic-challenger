import { StyledFormField } from "../../custom/StyledFormField";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { UseFormReturn } from "react-hook-form";
import { RegisteringFormValues } from "@/src/forms/registering";
import { CardTemplate } from "./CardTemplate";
import { Checkbox } from "../../ui/checkbox";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { ProductVariant } from "@/src/api/hyperionSchemas";

interface PackageCardProps {
  form: UseFormReturn<RegisteringFormValues>;
}

export const PackageCard = ({ form }: PackageCardProps) => {
  const { availableProducts } = useAvailableProducts();
  const purchases = form.watch("products");
  const ids = purchases.map((purchase) => purchase.product.id);
  const groupedByProductId: Record<string, ProductVariant[]> = {};
  availableProducts?.forEach((product) => {
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

  return (
    <CardTemplate>
      <h2 className="text-xl font-semibold">Ta formule :</h2>
      {Object.entries(groupedByProductId).map(([productId, products]) => (
        <StyledFormField
          key={productId}
          form={form}
          label={productId}
          id={`products[${productId}]`}
          input={(field) => (
            <>
              {products.length > 1 ? (
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
              ) : (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id={`products[${productId}]`}
                    value={products[0].id}
                    checked={ids.includes(products[0].id)}
                    onCheckedChange={() => {
                      if (ids.includes(products[0].id)) {
                        form.setValue(
                          "products",
                          purchases.filter(
                            (purchase) =>
                              purchase.product.id !== products[0].id,
                          ),
                        );
                        return;
                      }
                      form.setValue("products", [
                        ...purchases.filter(
                          (purchase) => purchase.product.id !== productId,
                        ),
                        {
                          product: products[0],
                          quantity: 1,
                        },
                      ]);
                    }}
                  />
                  <Label htmlFor={`products[${productId}]`}>
                    {products[0].name} - {products[0].price / 100}€
                  </Label>
                </div>
              )}
            </>
          )}
        />
      ))}
    </CardTemplate>
  );
};
