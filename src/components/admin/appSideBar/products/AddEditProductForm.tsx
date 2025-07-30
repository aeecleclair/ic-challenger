import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { productFormSchema } from "@/src/forms/product";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface AddEditProductFormProps {
  form: UseFormReturn<z.infer<typeof productFormSchema>>;
  isLoading: boolean;
  setIsOpened: (value: boolean) => void;
  isEdit?: boolean;
}

export const AddEditProductForm = ({
  form,
  isLoading,
  setIsOpened,
  isEdit = false,
}: AddEditProductFormProps) => {
  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }

  return (
    <div className="grid gap-6 mt-4">
      <StyledFormField
        form={form}
        label="Nom"
        id="name"
        input={(field) => <Input {...field} />}
      />
      <StyledFormField
        form={form}
        label="Description"
        id="description"
        input={(field) => <Textarea {...field} />}
      />

      <div className="flex justify-end mt-2 space-x-4">
        <Button
          variant="outline"
          onClick={closeDialog}
          disabled={isLoading}
          className="w-[100px]"
        >
          Annuler
        </Button>
        <LoadingButton
          isLoading={isLoading}
          className="w-[100px]"
          type="submit"
        >
          {isEdit ? "Modifier" : "Ajouter"}
        </LoadingButton>
      </div>
    </div>
  );
};
