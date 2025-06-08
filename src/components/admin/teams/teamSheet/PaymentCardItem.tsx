import { Participant } from "@/src/api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { LoadingButton } from "../../../custom/LoadingButton";
import { useState } from "react";

interface PaymentCardItemProps {
  participant: Participant;
  validateCallback: (participantId: string, callback: () => void) => void;
  validateTShirtCallback: (participantId: string, callback: () => void) => void;
}

export const PaymentCardItem = ({
  participant,
  validateCallback,
  validateTShirtCallback,
}: PaymentCardItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTShirtLoading, setIsTShirtLoading] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {participant.firstname} {participant.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          {participant.payment ? (
            <p className="w-full">{"L'inscription à été payée"}</p>
          ) : (
            <LoadingButton
              onClick={(_) => {
                setIsLoading(true);
                validateCallback(participant.id, () => {
                  setIsLoading(false);
                });
              }}
              isLoading={isLoading}
              label={"Valider le paiement de l'inscription"}
              className="w-full"
            />
          )}
          {participant.t_shirt_size && (
            <>
              {participant.t_shirt_payment ? (
                <p className="w-full">{"Le T-Shirt à été payée"}</p>
              ) : (
                <LoadingButton
                  onClick={(_) => {
                    setIsTShirtLoading(true);
                    validateTShirtCallback(participant.id, () => {
                      setIsTShirtLoading(false);
                    });
                  }}
                  isLoading={isTShirtLoading}
                  label={"Valider le paiement du T-Shirt"}
                  className="w-full"
                />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
