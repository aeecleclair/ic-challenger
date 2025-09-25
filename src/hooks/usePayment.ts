import { usePostCompetitionPay } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";

export const usePayment = () => {
  const { token, isTokenExpired } = useAuth();

  const { mutate: mutateGetPaymentUrl, isPending: isPaymentLoading } =
    usePostCompetitionPay();

  const getPaymentUrl = (callback: (paymentUrl: string) => void) => {
    return mutateGetPaymentUrl(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la création de l'URL de paiement",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else if (data?.url) {
            callback(data.url);
            toast({
              title: "Redirection vers le paiement",
              description: "Vous allez être redirigé vers HelloAsso.",
            });
          }
        },
      },
    );
  };

  return {
    getPaymentUrl,
    isPaymentLoading,
  };
};
