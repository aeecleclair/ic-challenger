import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { Input } from "../../ui/input";
import { CardLayout } from "./CardLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingButton } from "../../custom/LoadingButton";
import { useDriveFolder } from "@/src/hooks/useDriveFolder";

export const DriveFolder = () => {
  const { driveFolder, updateDriveFolder } = useDriveFolder();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    parent_folder_id: z.string().min(1, {
      message: "Veuillez renseigner un dossier de drive",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parent_folder_id: driveFolder?.parent_folder_id
        ? "https://drive.google.com/drive/u/0/folders/" +
          driveFolder?.parent_folder_id
        : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    let folder_id = values.parent_folder_id.split("/folders/").pop();
    if (folder_id) {
      if (folder_id.endsWith("/")) {
        folder_id = folder_id.slice(0, -1);
      }
      updateDriveFolder(
        {
          parent_folder_id: folder_id,
        },
        () => {
          setIsLoading(false);
          setIsEdit(false);
          form.reset({ parent_folder_id: values.parent_folder_id });
        },
      );
    } else {
      setIsLoading(false);
    }
  }

  function toggleEdit() {
    setIsEdit(!isEdit);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardLayout label="Lien du dossier Drive">
          {isEdit ? (
            <>
              <FormField
                control={form.control}
                name="parent_folder_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="items-center gap-4">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex flex-row">
                <Button
                  variant="outline"
                  className="mt-2 mr-2 w-[120px]"
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  Annuler
                </Button>
                <LoadingButton
                  className="mt-2 w-[120px]"
                  type="submit"
                  label="Valider"
                  isLoading={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <div
                className={`${driveFolder?.parent_folder_id && "text-green-700 hover:text-green-800 underline"} text-2xl font-bold h-8`}
              >
                {driveFolder?.parent_folder_id ? (
                  <a
                    target="_blank"
                    href={
                      "https://drive.google.com/drive/u/0/folders/" +
                      driveFolder?.parent_folder_id
                    }
                  >
                    {"Lien du dossier Drive"}
                  </a>
                ) : (
                  <span>{"Aucun lien"}</span>
                )}
              </div>
              <Button
                variant="outline"
                className="mt-4 w-[120px]"
                type="button"
                onClick={toggleEdit}
              >
                Modifier
              </Button>
            </>
          )}
        </CardLayout>
      </form>
    </Form>
  );
};
