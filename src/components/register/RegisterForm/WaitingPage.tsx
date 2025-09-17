import {
  Card,
  CardDescription,
  CardTitle,
} from "../../ui/card";
import { RegistrationSummary } from "./RegistrationSummary";

export const WaitingPage = () => {
  return (
    <div className="flex w-full flex-col p-12 pt-6">
      <div className="space-y-6">
        <Card className="p-6 bg-red-700 text-white border-red-800 shadow-md shadow-red-500/50">
          <CardTitle>En attente de validation</CardTitle>
          <CardDescription className="text-white">
            Ton inscription est en cours de validation par ton BDS. Tu seras
            informé par e-mail une fois qu&apos;elle aura été examinée.
          </CardDescription>
        </Card>

        <RegistrationSummary />
      </div>
    </div>
  );
};
