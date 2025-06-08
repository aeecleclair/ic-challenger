import {
  usePostRaidParticipantParticipantIdPayment,
  usePostRaidParticipantParticipantIdTShirtPayment,
} from "../api/hyperionComponents";
import { toast } from "../components/ui/use-toast";
import { useAuth } from "./useAuth";

export const usePayment = () => {
  const { token } = useAuth();

  const { mutate: mutateValidatePayment, isPending: isPaymentLoading } =
    usePostRaidParticipantParticipantIdPayment();

  const validatePayment = (participantId: string, callback: () => void) => {
    mutateValidatePayment(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          participantId: participantId,
        },
      },
      {
        onSettled: () => {
          callback();
        },
      },
    );
  };

  const {
    mutate: mutateValidateTShirtPayment,
    isPending: isTshirtPaymentLoading,
  } = usePostRaidParticipantParticipantIdTShirtPayment();

  const validateTShirtPayment = (
    participantId: string,
    callback: () => void,
  ) => {
    mutateValidateTShirtPayment(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          participantId: participantId,
        },
      },
      {
        onSettled: () => {
          callback();
        },
      },
    );
  };

  return {
    validatePayment,
    isPaymentLoading,
    validateTShirtPayment,
    isTshirtPaymentLoading,
  };
};
