import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, ProductFormValues } from "@/src/forms/product";
import { useProducts } from "@/src/hooks/useProducts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductDialog = ({
  isOpen,
  onClose,
}: AddProductDialogProps) => {
  const { createProduct, isCreateLoading } = useProducts();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: ProductFormValues) {
    createProduct(values, () => {
      onClose();
      form.reset();
    });
  }

  function handleClose() {
    if (!isCreateLoading) {
      onClose();
      form.reset();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau produit</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau produit à votre catalogue. Vous pourrez ensuite
            créer des variantes pour ce produit.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StyledFormField
              form={form}
              label="Nom du produit"
              id="name"
              input={(field) => (
                <Input
                  placeholder="Ex: T-shirt, Sweat-shirt, Accessoire..."
                  {...field}
                />
              )}
            />

            <StyledFormField
              form={form}
              label="Description"
              id="description"
              input={(field) => (
                <Textarea
                  placeholder="Description du produit (optionnel)"
                  className="min-h-20"
                  {...field}
                />
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isCreateLoading}
              >
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isCreateLoading}>
                Créer le produit
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
