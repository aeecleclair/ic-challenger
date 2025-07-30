import {
  AppModulesSportCompetitionSchemasSportCompetitionProductBase,
  SellerComplete,
} from "@/src/api/hyperionSchemas";
import { CustomDialog } from "@/src/components/custom/CustomDialog";
import { Form } from "@/src/components/ui/form";
import { productFormSchema } from "@/src/forms/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiPlus } from "react-icons/hi2";
import { z } from "zod";
import { AddEditProductForm } from "./AddEditProductForm";
import { useProducts } from "@/src/hooks/useProducts";

export const AddProductAccordionItem = () => {
  const { createProduct, isCreateLoading } = useProducts();
  const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    const body: AppModulesSportCompetitionSchemasSportCompetitionProductBase = {
      ...values,
    };
    createProduct(body, () => {
      form.reset();
    });
  }

  return (
    <CustomDialog
      title="Nouveau produit"
      isFullWidth
      description={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AddEditProductForm
              form={form}
              setIsOpened={setIsAddDialogOpened}
              isLoading={isCreateLoading}
            />
          </form>
        </Form>
      }
      isOpened={isAddDialogOpened}
      setIsOpened={setIsAddDialogOpened}
    >
      <div className="flex flex-1 items-center justify-start py-4 font-medium border-b cursor-pointer ">
        <HiPlus className="w-4 h-4 mr-6" />
        <h3 className="text-lg font-semibold">Nouveau produit</h3>
        <div className="flex grow"></div>
      </div>
    </CustomDialog>
  );
};
