import { Participant } from "@/src/api/hyperionSchemas";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Progress } from "../../ui/progress";
import { Button } from "../../ui/button";
import { HiPencil, HiX } from "react-icons/hi";
import { Skeleton } from "../../ui/skeleton";
import { useState } from "react";
import { ParticipantLoading } from "./ParticipantLoading";
// import { PaymentButton } from "./PaymentButton";
import { Checkbox } from "../../ui/checkbox";
import { getSituationLabel } from "@/src/infra/teamUtils";
import { PaymentButton } from "./PaymentButton";
import { usePrice } from "@/src/hooks/usePrice";
import { ViewEditParticipant } from "./ViewEditParticipant";
import { useInformation } from "@/src/hooks/useInformation";

interface ParticipantCardProps {
  participant?: Participant;
  isCaptain: boolean;
}

export const ParticipantCard = ({
  participant,
  isCaptain,
}: ParticipantCardProps) => {
  // const { price } = usePrice();
  const { information } = useInformation();
  const [isEdit, setIsEdit] = useState(false);

  function toggleEdit() {
    setIsEdit(!isEdit);
  }

  return (
    <Card className="w-full flex flex-col justify-between">
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div>
            <CardTitle>
              {participant?.firstname && participant?.firstname ? (
                participant?.firstname + " " + participant?.name
              ) : (
                <div className="flex flex-row gap-2">
                  <Skeleton className="w-32 h-8" />
                  <Skeleton className="w-32 h-8" />
                </div>
              )}
            </CardTitle>
            <CardDescription>
              {participant ? (
                <>{isCaptain ? "Capitaine" : " "}</>
              ) : (
                <Skeleton className="w-24 h-5 mt-1" />
              )}
            </CardDescription>
          </div>
          {isEdit && participant ? (
            <Button
              variant="destructive"
              onClick={toggleEdit}
              className="w-[110px]"
            >
              <HiX className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={toggleEdit}
              className="w-[110px]"
            >
              <HiPencil className="mr-2 h-4 w-4" />
              Éditer
            </Button>
          )}
        </div>
      </CardHeader>
      {participant ? (
        <ViewEditParticipant
          participant={participant}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      ) : (
        <ParticipantLoading />
      )}
      {!isEdit && (
        <>
          <CardFooter className="w-full">
            {participant ? (
              <div className="grid p-2 grid-cols-6 items-center w-full">
                <span className="font-semibold text-left my-auto col-span-2">
                  Paiement
                </span>
                {/* When paying by HelloAsso */}
                {/* {(!participant?.payment ||
                  (participant.t_shirt_size && !participant.t_shirt_payment)) &&
                getSituationLabel(participant?.situation ?? undefined) !==
                  "corporatepartner" &&
                !!price?.student_price &&
                !!price?.t_shirt_price ? (
                  <PaymentButton />
                ) : (
                  <Checkbox
                    checked={participant?.payment}
                    disabled
                    className="col-span-4 ml-auto disabled:opacity-100"
                  />
                )} */}
                {!participant?.payment &&
                getSituationLabel(participant?.situation ?? undefined) !==
                  "corporatepartner" ? (
                  <>
                    {information?.payment_link ? (
                      <Button
                        className="col-span-4 ml-auto w-[100px]"
                        onClick={() => {
                          window.open(information!.payment_link!, "_blank");
                        }}
                      >
                        {"Payer"}
                      </Button>
                    ) : (
                      <span>{"Aucun lien"}</span>
                    )}
                  </>
                ) : (
                  <Checkbox
                    checked={participant?.payment}
                    disabled
                    className="col-span-4 ml-auto disabled:opacity-100"
                  />
                )}
              </div>
            ) : (
              <div className="grid p-2 grid-cols-6 items-center w-full h-[65px]">
                <span className="font-semibold text-left my-auto col-span-2">
                  <Skeleton className="w-32 h-7" />
                </span>
                <Skeleton className="w-64 h-6 col-span-4 ml-auto" />
              </div>
            )}
          </CardFooter>
          <Progress value={participant?.validation_progress} />
        </>
      )}
    </Card>
  );
};
