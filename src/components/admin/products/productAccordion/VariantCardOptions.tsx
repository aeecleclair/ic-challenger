import {
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete,
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantEdit,
} from "@/src/api/hyperionSchemas";
import { Button } from "@/src/components/ui/button";
import {
  ContextMenuContent,
  ContextMenuShortcut,
} from "@/src/components/ui/context-menu";
import { Form } from "@/src/components/ui/form";
import { variantFormSchema } from "@/src/forms/variant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomDialog } from "@/src/components/custom/CustomDialog";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { AddEditVariantForm } from "./AddEditVariantForm";
import { PencilIcon, PlayIcon, TrashIcon } from "lucide-react";
import { StopIcon } from "@radix-ui/react-icons";
import { useProducts } from "@/src/hooks/useProducts";

interface VariantCardOptionsProps {
  variant: AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete;
  canEdit?: boolean;
  canRemove?: boolean;
  canDisable?: boolean;
  productId: string;
}

export const VariantCardOptions = ({
  variant,
  canEdit,
  canRemove,
  canDisable,
  productId,
}: VariantCardOptionsProps) => {
  const {
    updateVariant,
    deleteVariant,
    isUpdateVariantLoading,
    isDeleteVariantLoading,
  } = useProducts();
  const [isEditDialogOpened, setIsEditDialogOpened] = useState(false);
  const [isRemoveDialogOpened, setIsRemoveDialogOpened] = useState(false);

  const form = useForm<z.infer<typeof variantFormSchema>>({
    resolver: zodResolver(variantFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: variant.name,
      description: variant?.description || undefined,
      price: (variant.price / 100).toString(),
      unique: variant.unique ? "unique" : "multiple",
      enabled: variant.enabled,
      schoolType: variant.school_type,
      publicType: variant.public_type || undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof variantFormSchema>) {
    const body: AppModulesSportCompetitionSchemasSportCompetitionProductVariantEdit =
      {
        ...values,
        price: Math.round(parseFloat(values.price) * 100),
        unique: values.unique === "unique",
        enabled: true,
      };
    updateVariant(variant.id, body, () => {
      setIsEditDialogOpened(false);
      form.reset(values);
    });
  }

  async function toggleEnabled() {
    const body: AppModulesSportCompetitionSchemasSportCompetitionProductVariantEdit =
      {
        enabled: !variant.enabled,
      };
    updateVariant(variant.id, body, () => {});
  }

  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsRemoveDialogOpened(false);
  }

  async function removeVariant() {
    deleteVariant(productId, variant.id, () => {
      setIsRemoveDialogOpened(false);
    });
  }

  return (
    (canEdit || canRemove || canDisable) && (
      <ContextMenuContent className="w-40">
        {canEdit && (
          <CustomDialog
            isOpened={isEditDialogOpened}
            setIsOpened={setIsEditDialogOpened}
            title="Modifier la variante"
            isFullWidth
            description={
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AddEditVariantForm
                    form={form}
                    setIsOpened={setIsEditDialogOpened}
                    isLoading={isUpdateVariantLoading}
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
        {variant.enabled && canDisable && (
          <LoadingButton
            className="w-full"
            variant="ghost"
            onClick={toggleEnabled}
            isLoading={isUpdateVariantLoading}
          >
            Désactiver
            <ContextMenuShortcut>
              <StopIcon className="w-4 h-4" />
            </ContextMenuShortcut>
          </LoadingButton>
        )}
        {!variant.enabled && canDisable && (
          <LoadingButton
            className="w-full"
            variant="ghost"
            onClick={toggleEnabled}
            isLoading={isUpdateVariantLoading}
          >
            Activer
            <ContextMenuShortcut>
              <PlayIcon className="w-4 h-4" />
            </ContextMenuShortcut>
          </LoadingButton>
        )}
        {canRemove && (
          <CustomDialog
            isOpened={isRemoveDialogOpened}
            setIsOpened={setIsRemoveDialogOpened}
            title="Supprimer la variante"
            isFullWidth
            description={
              <>
                <div>Êtes-vous sûr de vouloir supprimer cette variante ?</div>
                <div className="flex justify-end mt-2 space-x-4">
                  <Button
                    variant="outline"
                    onClick={closeDialog}
                    disabled={isDeleteVariantLoading}
                    className="w-[100px]"
                  >
                    Annuler
                  </Button>
                  <LoadingButton
                    isLoading={isDeleteVariantLoading}
                    className="w-[100px]"
                    variant="destructive"
                    onClick={removeVariant}
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
