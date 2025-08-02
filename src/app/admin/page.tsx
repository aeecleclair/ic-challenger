"use client";

import EditionForm from "@/src/components/admin/EditionForm";
import { EditionFormSchema, editionFormSchema } from "@/src/forms/edition";
import { useEdition } from "@/src/hooks/useEdition";
import { useUser } from "@/src/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const AdminPage = () => {
  const { edition, createEdition, isCreationLoading } = useEdition();
  const { isAdmin } = useUser();

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: {},
    mode: "onChange",
  });

  function onSubmit(values: EditionFormSchema) {
    createEdition(
      {
        name: values.name,
        start_date: values.startDate.toISOString().slice(0, 10),
        end_date: values.endDate.toISOString().slice(0, 10),
        year: values.startDate.getFullYear(),
        active: true,
      },
      () => {
        form.reset();
      },
    );
  }

  return (
    <>
      {isAdmin() && edition === null && (
        <EditionForm
          form={form}
          isLoading={isCreationLoading}
          onSubmit={onSubmit}
          submitLabel="Créer l'édition"
        />
      )}
    </>
  );
};

export default AdminPage;
