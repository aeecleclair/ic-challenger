import { CheckCircle2, CreditCard } from "lucide-react";
import { useState } from "react";
import { Card, CardDescription, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { WarningDialog } from "../../custom/WarningDialog";
import { HelloAssoButton } from "../../custom/HelloAssoButton";
import { RegistrationSummary } from "./RegistrationSummary";
import { usePayment } from "../../../hooks/usePayment";
import { useUserPayments } from "../../../hooks/useUserPayments";

export const ValidatedPage = () => {
  const [isPaymentDialogOpened, setIsPaymentDialogOpened] = useState(false);

  const { getPaymentUrl, isPaymentLoading } = usePayment();
  const {
    hasPaid,
    isLoading: isPaymentsLoading,
    refetchPayments,
  } = useUserPayments();

  const handlePaymentRefetch = () => {
    getPaymentUrl((paymentUrl) => {
      setIsPaymentDialogOpened(false);
      refetchPayments();
      window.location.href = paymentUrl;
    });
  };

  return (
    <div className="flex w-full flex-col p-12 pt-6">
      <div className="space-y-6">
        <Card className="p-6 bg-green-700 text-white border-green-800 shadow-md shadow-green-500/50">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Inscription validée
          </CardTitle>
          <CardDescription className="text-white">
            Félicitations ! Ton inscription a été validée par ton BDS. Tu
            recevras bientôt plus d&apos;informations par e-mail concernant la
            compétition.
          </CardDescription>
        </Card>

        {!isPaymentsLoading && !hasPaid && (
          <Card className="p-6 bg-gray-50 border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CreditCard className="h-5 w-5" />
              Finaliser votre inscription
            </CardTitle>
            <CardDescription className="text-gray-700 mb-4">
              Pour compléter votre inscription, veuillez procéder au paiement de
              votre participation à la compétition.
            </CardDescription>

            <WarningDialog
              isOpened={isPaymentDialogOpened}
              setIsOpened={setIsPaymentDialogOpened}
              isLoading={isPaymentLoading}
              title="Procéder au paiement"
              description={
                <p>
                  Vous allez être redirigés vers HelloAsso pour procéder au
                  paiement. HelloAsso est une entreprise française proposant des
                  solutions de paiement pour les associations. Elle se finance
                  uniquement par des dons. Par défaut, HelloAsso vous proposera
                  de faire un don (nommé &apos;contribution volontaire&apos;),
                  vous pouvez refuser de le faire sans compromettre le paiement.
                  Si vous choisissez de faire un don, seul HelloAsso en
                  bénéficiera.
                </p>
              }
              customButton={
                <HelloAssoButton
                  isLoading={isPaymentLoading}
                  onClick={handlePaymentRefetch}
                />
              }
            />

            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsPaymentDialogOpened(true)}
              disabled={isPaymentLoading}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Procéder au paiement
            </Button>
          </Card>
        )}

        {!isPaymentsLoading && hasPaid && (
          <Card className="p-6 bg-green-100 border-green-300">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              Paiement effectué
            </CardTitle>
            <CardDescription className="text-green-700">
              Votre paiement a été effectué avec succès. Votre inscription est
              maintenant complète !
            </CardDescription>
          </Card>
        )}
        <RegistrationSummary />
      </div>
    </div>
  );
};
