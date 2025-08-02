import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantBase } from "@/src/api/hyperionSchemas";
import { Form } from "@/src/components/ui/form";
import { variantFormSchema, VariantFormValues } from "@/src/forms/variant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiPlus } from "react-icons/hi2";

import { Card, CardContent } from "@/src/components/ui/card";
import { CustomDialog } from "@/src/components/custom/CustomDialog";
import { AddEditVariantForm } from "./AddEditVariantForm";
import { useProducts } from "@/src/hooks/useProducts";

interface AddingVariantCardProps {
  productId: string;
}

export const AddingVariantCard = ({ productId }: AddingVariantCardProps) => {
  const { createVariant, isCreateVariantLoading } = useProducts();
  const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    mode: "onBlur",
    defaultValues: {},
  });

  async function onSubmit(values: VariantFormValues) {
    const body: AppModulesSportCompetitionSchemasSportCompetitionProductVariantBase =
      {
        ...values,
        price: Math.round(parseFloat(values.price) * 100),
        unique: values.unique === "unique",
        enabled: true,
        school_type: values.schoolType,
        public_type: values.publicType || undefined,
        product_id: productId,
      };
    createVariant(productId, body, () => {
      setIsAddDialogOpened(false);
      form.reset();
    });
  }
  return (
    <CustomDialog
      isOpened={isAddDialogOpened}
      setIsOpened={setIsAddDialogOpened}
      title="Ajouter une variante"
      description={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AddEditVariantForm
              form={form}
              setIsOpened={setIsAddDialogOpened}
              isLoading={isCreateVariantLoading}
            />
          </form>
        </Form>
      }
    >
      <Card className={`min-w-40 min-h-20 h-full`}>
        <CardContent className="flex flex-col items-center justify-center m-auto h-full p-0 cursor-pointer">
          <HiPlus className="w-8 h-8" />
        </CardContent>
      </Card>
    </CustomDialog>
  );
};
