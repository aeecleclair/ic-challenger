"use client";

import {
  AppModulesSportCompetitionSchemasSportCompetitionPaymentBase,
  AppModulesSportCompetitionSchemasSportCompetitionPaymentComplete,
  CompetitionUser,
} from "@/src/api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { CreditCard, User } from "lucide-react";
import { Button } from "../../ui/button";
import { useUserPayments } from "@/src/hooks/useUserPayments";
import { useSchoolsPayments } from "@/src/hooks/useSchoolsPayments";
import { AddPaymentDialog } from "../validation/AddPaymentDialog";
import { useState } from "react";
import { useSchoolsPurchases } from "@/src/hooks/useSchoolsPurchases";

export const UserPayments = ({
  user,
  userPayments,
}: {
  user: CompetitionUser;
  userPayments: AppModulesSportCompetitionSchemasSportCompetitionPaymentComplete[];
}) => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { refetchSchoolsPayments } = useSchoolsPayments({
    schoolId: user.user.school_id,
  });
  const { refetchSchoolsPurchases } = useSchoolsPurchases({
    schoolId: user.user.school_id,
  });
  const { deleteUserPayment, makePayment, isPostingPayment } =
    useUserPayments();
  const onDeletePayment = (paymentId: string) => {
    deleteUserPayment(user.user_id, paymentId, () => {
      refetchSchoolsPayments();
      refetchSchoolsPurchases();
    });
  };

  const handleAddPayment = async (amount: number) => {
    const body: AppModulesSportCompetitionSchemasSportCompetitionPaymentBase = {
      total: amount * 100, // Convert to cents
    };
    await makePayment(user.user_id, body);
    await refetchSchoolsPayments();
    await refetchSchoolsPurchases();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiements
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(true)}
              className="ml-auto"
            >
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col space-y-6">
            <div>
              <div className="space-y-3">
                {userPayments.length > 0 ? (
                  userPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border p-3 rounded flex-row flex gap-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Montant
                        </p>
                        <p className="text-sm">{payment.total / 100} €</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Type
                        </p>
                        <p className="text-sm">
                          {payment.method == "manual" ? "Manuel" : "HelloAsso"}
                        </p>
                      </div>
                      {payment.method == "manual" && (
                        <Button
                          variant="destructive"
                          onClick={() => onDeletePayment(payment.id)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucun paiement trouvé.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AddPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onConfirm={handleAddPayment}
        participantName={user.user.name || user.user.firstname || "Utilisateur"}
        isLoading={isPostingPayment}
      />
    </div>
  );
};
