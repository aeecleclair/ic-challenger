import {
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete,
  AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
} from "@/src/api/hyperionSchemas";
import { useTokenStore } from "@/src/stores/token";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi2";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";

interface VariantCardProps {
  variant: AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete;
  userId: string;
  showDescription: boolean;
  isSelectable: boolean;
  isAdmin: boolean;
  displayWarning?: boolean;
}

export const VariantCard = ({
  variant,
  userId,
  showDescription,
  isSelectable,
  isAdmin,
  displayWarning,
}: VariantCardProps) => {
  const {
    userPurchases,
    createPurchase,
    isCreatePurchaseLoading,
    deletePurchase,
    isDeletePurchaseLoading,
  } = useUserPurchases({ userId: userId });
  const numberSelectedVariant =
    userPurchases?.find(
      (purchase) => purchase.product_variant_id === variant.id,
    )?.quantity || 0;
  const selected = numberSelectedVariant > 0;
  const [inputQuantity, setInputQuantity] = useState(numberSelectedVariant);

  useEffect(() => {
    setInputQuantity(numberSelectedVariant);
  }, [numberSelectedVariant]);

  const purchaseVariant = async (quantity: number) => {
    const body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase =
      {
        product_variant_id: variant.id,
        quantity: quantity,
      };
    createPurchase(body, () => {
      setInputQuantity(quantity);
    });
  };

  const cancelPurchase = async () => {
    deletePurchase(userId, variant.id, () => {});
  };

  const isLoading = isCreatePurchaseLoading || isDeletePurchaseLoading;

  return (
    <Card
      className={`min-w-40 h-full ${selected && "shadow-lg"} ${selected && (displayWarning ? "border-destructive shadow-destructive/30" : "border-black")} ${!variant.enabled && "text-muted-foreground"} ${(isSelectable || (!isSelectable && selected)) && variant.enabled && variant.unique && !isLoading && "cursor-pointer"}`}
      onClick={() => {
        if (isSelectable && variant.enabled && variant.unique && !isLoading) {
          if (selected) {
            cancelPurchase();
          } else {
            purchaseVariant(1);
          }
        }
        if (selected && !isSelectable) {
          cancelPurchase();
        }
      }}
    >
      {isSelectable && variant.enabled && variant.unique && isLoading && (
        <div className="w-full h-0 relative">
          <div
            className={`flex m-auto ${showDescription ? "h-[109px]" : "h-[93px]"} w-full bg-white rounded-md bg-opacity-50`}
          >
            <ReloadIcon className="flex h-6 w-6 animate-spin m-auto" />
          </div>
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1 gap-4">
        <CardTitle
          className={`text-sm font-medium ${!isSelectable && "text-muted-foreground"}`}
        >
          <span>{variant.name}</span>
        </CardTitle>
        {!variant.unique && (
          <div className="flex items-center space-x-2">
            <LoadingButton
              variant="outline"
              className="h-6 px-1"
              disabled={!selected || !isSelectable}
              onClick={(e) => {
                if (!isSelectable) {
                  if (selected) {
                    cancelPurchase();
                  }
                  return;
                }
                e.stopPropagation();
                const newQuantity = numberSelectedVariant - 1;
                if (newQuantity === 0) {
                  cancelPurchase();
                  return;
                }
                purchaseVariant(numberSelectedVariant - 1);
              }}
              isLoading={isLoading}
            >
              <HiMinus className="w-4 h-4" />
            </LoadingButton>
            <Input
              type="text"
              className="w-12 text-s flex h-6"
              value={inputQuantity}
              disabled={!isSelectable}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputQuantity(Number(e.target.value) || 0);
              }}
              onBlur={(e) => {
                if (!isSelectable) return;
                e.stopPropagation();
                const newQuantity = Number(e.target.value) || 0;
                if (newQuantity === 0) {
                  if (numberSelectedVariant !== 0) cancelPurchase();
                  return;
                }
                if (inputQuantity === 0 || !isAdmin) {
                  purchaseVariant(newQuantity);
                }
              }}
            />
            <LoadingButton
              variant="outline"
              className="h-6 px-1"
              disabled={!isSelectable}
              onClick={(e) => {
                if (!isSelectable) return;
                e.stopPropagation();
                if (numberSelectedVariant !== 0 || !isAdmin) {
                  purchaseVariant(numberSelectedVariant + 1);
                }
              }}
              isLoading={isLoading}
            >
              <HiPlus className="w-4 h-4" />
            </LoadingButton>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex p-4 pt-0 mr-auto">
        <div
          className={`text-2xl font-bold ${!isSelectable && "text-muted-foreground"}`}
        >
          <span>{variant.price / 100} €</span>
        </div>
        {showDescription && (
          <p className="text-xs text-muted-foreground">{variant.description}</p>
        )}
      </CardContent>
    </Card>
  );
};
