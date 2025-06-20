"use client";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Form } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "@/src/components/ui/use-toast";
import { sportFormSchema, sportCategories } from "@/src/forms/sport";
import { useSports } from "@/src/hooks/useSports";

const Dashboard = () => {
  const { createSport, isCreateLoading: isLoading } = useSports();

  const form = useForm<z.infer<typeof sportFormSchema>>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: "",
      teamSize: 1,
      sportCategory: "masculine",
      substituteMax: 0,
      activated: true,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof sportFormSchema>) {
    createSport(
      {
        name: values.name,
        team_size: values.teamSize,
        sport_category: values.sportCategory,
        substitute_max: values.substituteMax,
        activated: values.activated,
      },
      () => {
        form.reset();
      },
    );
  }

  return (
    <div className="flex h-full w-full flex-col p-6">
      <span className="text-2xl font-bold mb-4">Ajouter un sport</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <StyledFormField
            form={form}
            label="Nom du sport"
            id="name"
            input={(field) => (
              <Input placeholder="Ex: Football, Basketball, etc." {...field} />
            )}
          />

          <div className="grid lg:grid-cols-3 gap-6 grid-cols-1">
            <StyledFormField
              form={form}
              label="Catégorie"
              id="sportCategory"
              input={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <StyledFormField
              form={form}
              label="Taille d'équipe"
              id="teamSize"
              input={(field) => (
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1)
                  }
                />
              )}
            />

            <StyledFormField
              form={form}
              label="Nombre de remplaçants max"
              id="substituteMax"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              )}
            />
          </div>

          <LoadingButton
            type="submit"
            className="w-full mt-6"
            isLoading={isLoading}
          >
            Ajouter le sport
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default Dashboard;
