import {
  AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
  AppModulesSportCompetitionSchemasSportCompetitionProductEdit,
} from "@/src/api/hyperionSchemas";
import { Button } from "@/src/components/ui/button";
import {
  ContextMenuContent,
  ContextMenuShortcut,
} from "@/src/components/ui/context-menu";
import { Form } from "@/src/components/ui/form";
import { toast, useToast } from "@/src/components/ui/use-toast";
import { productFormSchema } from "@/src/forms/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomDialog } from "@/src/components/custom/CustomDialog";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { AddEditProductForm } from "../AddEditProductForm";
import { useProducts } from "@/src/hooks/useProducts";

interface ProductAccordionOptionsProps {
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  canEdit?: boolean;
  canRemove?: boolean;
}

export const ProductAccordionOptions = ({
  product,
  canEdit,
  canRemove,
}: ProductAccordionOptionsProps) => {
  const { toast } = useToast();
  const { updateProduct, isUpdateLoading, deleteProduct, isDeleteLoading } =
    useProducts();
  const [isEditDialogOpened, setIsEditDialogOpened] = useState(false);
  const [isRemoveDialogOpened, setIsRemoveDialogOpened] = useState(false);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    const body: AppModulesSportCompetitionSchemasSportCompetitionProductEdit = {
      ...values,
    };
    updateProduct(product.id, body, () => {
      setIsEditDialogOpened(false);
      form.reset(values);
    });
  }

  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsRemoveDialogOpened(false);
  }

  async function removeProduct() {
    deleteProduct(product.id, () => {
      setIsRemoveDialogOpened(false);
    });
  }
  return (
    (canEdit || canRemove) && (
      <ContextMenuContent className="w-40">
        {canEdit && (
          <CustomDialog
            isOpened={isEditDialogOpened}
            setIsOpened={setIsEditDialogOpened}
            title="Modifier le produit"
            isFullWidth
            description={
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AddEditProductForm
                    form={form}
                    setIsOpened={setIsEditDialogOpened}
                    isLoading={isUpdateLoading}
                    isEdit
                  />
                </form>
              </Form>
            }
          >
            <Button className="w-full" variant="ghost">
              Modifier
              <ContextMenuShortcut>
                <PencilIcon className="w-4 h-4" />
              </ContextMenuShortcut>
            </Button>
          </CustomDialog>
        )}
        {canRemove && (
          <CustomDialog
            isOpened={isRemoveDialogOpened}
            setIsOpened={setIsRemoveDialogOpened}
            title="Supprimer le produit"
            isFullWidth
            description={
              <>
                <div>Êtes-vous sûr de vouloir supprimer ce produit ?</div>
                <div className="flex justify-end mt-2 space-x-4">
                  <Button
                    variant="outline"
                    onClick={closeDialog}
                    disabled={isDeleteLoading}
                    className="w-[100px]"
                  >
                    Annuler
                  </Button>
                  <LoadingButton
                    isLoading={isDeleteLoading}
                    className="w-[100px]"
                    variant="destructive"
                    onClick={removeProduct}
                  >
                    Supprimer
                  </LoadingButton>
                </div>
              </>
            }
          >
            <Button
              className="w-full text-destructive hover:text-destructive"
              variant="ghost"
            >
              Supprimer
              <ContextMenuShortcut>
                <TrashIcon className="w-4 h-4 text-destructive" />
              </ContextMenuShortcut>
            </Button>
          </CustomDialog>
        )}
      </ContextMenuContent>
    )
  );
};
