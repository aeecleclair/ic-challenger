import {
  AppModulesSportCompetitionSchemasSportCompetitionProductBase,
  SellerComplete,
} from "@/src/api/hyperionSchemas";
import { CustomDialog } from "@/src/components/custom/CustomDialog";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { productFormSchema } from "@/src/forms/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
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
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produits enregistrés</h1>
        <Button onClick={() => setIsAddDialogOpened(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

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
      />
    </>
  );
};
