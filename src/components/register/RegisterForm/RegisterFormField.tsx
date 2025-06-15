import { LoadingButton } from "../../custom/LoadingButton";
import { UseFormReturn } from "react-hook-form";
import { registeringFormSchema } from "@/src/forms/registering";
import z from "zod";
import { Carousel, CarouselApi, CarouselContent } from "../../ui/carousel";
import { InformationCard } from "./InformationCard";
import { ParticipationCard } from "./ParticipationCard";
import { SportCard } from "./SportCard";
import { PackageCard } from "./PackageCard";
import { useState } from "react";
import { Button } from "../../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RegisterState } from "@/src/infra/registerState";
import { SummaryCard } from "./SummaryCard";

interface RegisterFormFieldProps {
  form: UseFormReturn<z.infer<typeof registeringFormSchema>>;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof registeringFormSchema>) => void;
  sports: { id: string; name: string }[];
  setState: (state: RegisterState) => void;
  state: RegisterState;
}

export const RegisterFormField = ({
  form,
  isLoading,
  onSubmit,
  sports,
  setState,
  state,
}: RegisterFormFieldProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const status = form.watch("status");
  const showSportFields = status === "sport";

  const handleParticipationChange = (value: string) => {
    const isSport = value === "sport";
    const newSubtitles = [...state.allHeaderSubtitles];

    if (isSport) {
      newSubtitles.splice(2, 0, "Sport");
    } else if (state.allHeaderSubtitles[2] === "Sport") {
      newSubtitles.splice(2, 1);
    }

    setState({
      ...state,
      allHeaderSubtitles: newSubtitles,
      stepDone: Math.min(state.stepDone, 2),
    });
  };

  return (
    <div className="gap-6 p-8 w-full flex flex-col h-[calc(100vh-12rem)] rounded-lg lg:w-1/2">
      <Carousel setApi={setApi} opts={{ watchDrag: false }}>
        <CarouselContent className="h-[calc(100vh-16rem)]" draggable={false}>
          <InformationCard form={form} />
          <ParticipationCard form={form} onChange={handleParticipationChange} />
          {showSportFields && <SportCard form={form} sports={sports} />}
          <PackageCard form={form} />
          <SummaryCard form={form} />
        </CarouselContent>
      </Carousel>

      <div className="flex justify-center mt-4 gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            api?.scrollPrev();
            setState({
              ...state,
              currentStep: Math.max(0, state.currentStep - 1),
              headerSubtitle:
                state.allHeaderSubtitles[Math.max(0, state.currentStep - 1)],
            });
          }}
          disabled={!api?.canScrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {api?.canScrollNext() ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              form.trigger().then((result) => {
                if (!result) {
                  const shouldBeValid = state.pageFields[state.headerSubtitle];
                  const isValid = shouldBeValid.every(
                    (field) => !form.getFieldState(field).invalid
                  );
                  if (!isValid) {
                    return;
                  }
                }
                api?.scrollNext();
                setState({
                  ...state,
                  currentStep: Math.min(3, state.currentStep + 1),
                  headerSubtitle:
                    state.allHeaderSubtitles[
                      state.currentStep + 1
                    ],
                  stepDone: Math.max(
                    state.stepDone,
                    state.currentStep + 1,
                  ),
                });
              });
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <LoadingButton
            isLoading={isLoading}
            className="w-[200px]"
            type="submit"
            onClick={() => onSubmit(form.getValues())}
          >
            S&apos;inscrire
          </LoadingButton>
        )}
      </div>
    </div>
  );
};
