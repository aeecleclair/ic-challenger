import { registeringFormSchema } from "@/src/forms/registering";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { RegisterFormField } from "./RegisterFormField";
import { Form } from "../../ui/form";
import { RegisterState } from "@/src/infra/registerState";

interface RegisterFormProps {
  setState: (state: RegisterState) => void;
  state: RegisterState;
}

export const RegisterForm = ({
  setState,
  state
} : RegisterFormProps
) => {
  const [isLoading, setIsLoading] = useState(false);

  const sports = [
    { id: "football", name: "Football" },
    { id: "basketball", name: "Basketball" },
    { id: "volleyball", name: "Volleyball" },
    { id: "handball", name: "Handball" },
    { id: "rugby", name: "Rugby" },
  ];

  const form = useForm<z.infer<typeof registeringFormSchema>>({
    resolver: zodResolver(registeringFormSchema),
    mode: "onBlur",
    defaultValues: {
      party: false,
      bottle: false,
      tShirt: false,
    },
  });

  async function onSubmit(values: z.infer<typeof registeringFormSchema>) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <RegisterFormField
          form={form}
          sports={sports}
          isLoading={isLoading}
          onSubmit={onSubmit}
          setState={setState}
          state={state}
        />
      </form>
    </Form>
  );
};
