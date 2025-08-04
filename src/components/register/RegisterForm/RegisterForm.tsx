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
import { WaitingPage } from "./WaintingPage";
import { ValidatedPage } from "./ValidatedPage";
import { useParticipant } from "@/src/hooks/useParticipant";

interface RegisterFormProps {
  setState: (state: RegisterState) => void;
  state: RegisterState;
}

export const RegisterForm = ({ setState, state }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { sports } = useSports();
  const { me } = useUser();
  const { meCompetition } = useCompetitionUser();
  const { meParticipant } = useParticipant();

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

  useEffect(() => {
    const newSubtitles = [...state.allHeaderSubtitles];
    if (meParticipant) {
      newSubtitles.splice(2, 0, "Sport");
    } else if (state.allHeaderSubtitles[2] === "Sport") {
      newSubtitles.splice(2, 1);
    }
    setState({
      ...state,
      allHeaderSubtitles: newSubtitles,
    });
    if (meCompetition && !meCompetition.validated) {
      setState({
        ...state,
        currentStep: meParticipant ? 5 : 4,
        stepDone: meParticipant ? 5 : 4,
        headerTitle: "Confirmation de l'inscription",
        headerSubtitle: "Récapitulatif",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meCompetition, meParticipant]);

  return (
    <>
      {meCompetition === null && (
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
      )}
      {meCompetition && !meCompetition.validated && <WaitingPage />}
      {meCompetition && meCompetition.validated && <ValidatedPage />}
    </>
  );
};
