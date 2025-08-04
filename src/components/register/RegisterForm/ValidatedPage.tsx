import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardTitle,
} from "../../ui/card";
import { RegistrationSummary } from "./RegistrationSummary";

export const ValidatedPage = () => {
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

        <RegistrationSummary />
      </div>
    </div>
  );
};
