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
import { useRouter } from "next/navigation";
import { CarouselApi } from "../../ui/carousel";

interface RegisterFormProps {
  setState: (state: RegisterState) => void;
  state: RegisterState;
}

export const RegisterForm = ({ setState, state }: RegisterFormProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { sports } = useSports();
  const { me } = useUser();
  const { meCompetition } = useCompetitionUser();
  const { meParticipant } = useParticipant();
  const router = useRouter();

  const form = useForm<RegisteringFormValues>({
    resolver: zodResolver(registeringFormSchema),
    mode: "onChange",
    defaultValues: {
      is_athlete: false,
      is_cameraman: false,
      is_fanfare: false,
      is_pompom: false,
      is_volunteer: false,
      sport: {
        team_leader: false,
      },
      products: [],
    },
  });

  useEffect(() => {
    form.setValue("phone", me?.phone || meCompetition?.user.phone || "");
    form.setValue("sex", meCompetition?.sport_category || "masculine");
    form.setValue("is_athlete", meCompetition?.is_athlete || false);
  }, [form, me, meCompetition]);

  async function onSubmit(values: RegisteringFormValues) {
    setIsLoading(true);
    router.push("/");
  }

  useEffect(() => {
    const newSubtitles = [...state.allHeaderSubtitles];
    if (meCompetition?.is_athlete) {
      newSubtitles.splice(2, 0, "Sport");
    } else if (state.allHeaderSubtitles[2] === "Sport") {
      newSubtitles.splice(2, 1);
    }
    if (
      meCompetition?.is_athlete &&
      meParticipant === undefined &&
      state.allHeaderSubtitles[2] !== "Sport"
    ) {
      setState({
        ...state,
        currentStep: 3,
        stepDone: 2,
        headerSubtitle: "Sport",
        allHeaderSubtitles: newSubtitles,
      });
      api?.scrollTo(2);
    } else if (meCompetition && !meCompetition.validated) {
      setState({
        ...state,
        currentStep: !!meParticipant ? 5 : 4,
        stepDone: !!meParticipant ? 5 : 4,
        headerTitle: "Confirmation de l'inscription",
        headerSubtitle: "Récapitulatif",
        allHeaderSubtitles: newSubtitles,
      });
    } else {
      setState({
        ...state,
        allHeaderSubtitles: newSubtitles,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meCompetition, meParticipant]);

  return meCompetition === undefined ||
    (meCompetition.is_athlete && meParticipant === undefined) ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <RegisterFormField
          form={form}
          sports={sports}
          isLoading={isLoading}
          onSubmit={onSubmit}
          setState={setState}
          state={state}
          api={api}
          setApi={setApi}
        />
      </form>
    </Form>
  ) : (
    <>
      {meCompetition && !meCompetition.validated && <WaitingPage />}
      {meCompetition && meCompetition.validated && <ValidatedPage />}
    </>
  );
};
