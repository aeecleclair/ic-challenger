import {
  registeringFormSchema,
  RegisteringFormValues,
} from "@/src/forms/registering";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { RegisterFormField } from "./RegisterFormField";
import { Form } from "../../ui/form";
import { RegisterState } from "@/src/infra/registerState";
import { useSports } from "@/src/hooks/useSports";
import { useUser } from "@/src/hooks/useUser";
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";

interface RegisterFormProps {
  setState: (state: RegisterState) => void;
  state: RegisterState;
}

export const RegisterForm = ({ setState, state }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { sports } = useSports();
  const { me } = useUser();
  const { meCompetition } = useCompetitionUser();

  const form = useForm<RegisteringFormValues>({
    resolver: zodResolver(registeringFormSchema),
    mode: "onChange",
    defaultValues: {
      is_athlete: false,
      is_cameraman: false,
      is_fanfare: false,
      is_pompom: false,
      is_volunteer: false,
      products: [],
    },
  });

  useEffect(() => {
    form.setValue("phone", me?.phone || meCompetition?.user.phone || "");
    form.setValue("sex", meCompetition?.sport_category || "masculine");
  }, [form, me, meCompetition]);

  async function onSubmit(values: RegisteringFormValues) {
    setIsLoading(true);
  }

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
