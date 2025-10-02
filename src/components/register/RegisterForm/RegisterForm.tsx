import {
  registeringFormSchema,
  RegisteringFormValues,
} from "@/src/forms/registering";
import { useEffect, useState } from "react";
import { RegisterFormField } from "./RegisterFormField";
import { Form } from "../../ui/form";
import { RegisterState } from "@/src/infra/registerState";
import { useSports } from "@/src/hooks/useSports";
import { useUser } from "@/src/hooks/useUser";
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import { WaitingPage } from "./WaitingPage";
import { ValidatedPage } from "./ValidatedPage";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useRouter } from "next/navigation";
import { CarouselApi } from "../../ui/carousel";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { UseFormReturn } from "react-hook-form";

interface RegisterFormProps {
  setState: (state: RegisterState) => void;
  state: RegisterState;
  form: UseFormReturn<RegisteringFormValues>;
}

export const RegisterForm = ({ setState, state, form }: RegisterFormProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { sports } = useSports();
  const { me } = useUser();
  const { meCompetition } = useCompetitionUser();
  const { meParticipant } = useParticipant();
  const { userMePurchases } = useUserPurchases({ userId: me?.id });
  const router = useRouter();
  useEffect(() => {
    form.setValue("phone", me?.phone || meCompetition?.user.phone || "");
    form.setValue("sex", meCompetition?.sport_category || "masculine");
    form.setValue("is_athlete", meCompetition?.is_athlete || false);
    form.setValue("is_cameraman", meCompetition?.is_cameraman || false);
    form.setValue("is_fanfare", meCompetition?.is_fanfare || false);
    form.setValue("is_pompom", meCompetition?.is_pompom || false);
    form.setValue("is_volunteer", meCompetition?.is_volunteer || false);
  }, [form, me, meCompetition]);

  async function onSubmit(values: RegisteringFormValues) {
    setIsLoading(true);
    router.push("/register");
  }

  useEffect(() => {
    const newSubtitles = [...state.allHeaderSubtitles];
    if (meCompetition?.is_athlete && state.allHeaderSubtitles[2] !== "Sport") {
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
      return;
    }
    if (userMePurchases === undefined || userMePurchases.length === 0) {
      setState({
        ...state,
        currentStep: !!meParticipant ? 4 : 3,
        stepDone: !!meParticipant ? 3 : 2,
        headerSubtitle: "Panier",
        allHeaderSubtitles: newSubtitles,
      });
      return;
    }
    if (meCompetition && !meCompetition.validated) {
      setState({
        ...state,
        currentStep: !!meParticipant ? 5 : 4,
        stepDone: !!meParticipant ? 5 : 4,
        headerTitle: "Confirmation de l'inscription",
        headerSubtitle: "Récapitulatif",
        allHeaderSubtitles: newSubtitles,
      });
      return;
    }
    if (meCompetition && meCompetition.validated) {
      setState({
        ...state,
        currentStep: !!meParticipant ? 6 : 5,
        stepDone: !!meParticipant ? 6 : 5,
        headerTitle: "Paiement",
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
    (meCompetition.is_athlete && meParticipant === undefined) ||
    userMePurchases === undefined ||
    userMePurchases.length === 0 ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
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
