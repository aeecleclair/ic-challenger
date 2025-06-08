import {
  usePostUsersRecover,
  usePostUsersResetPassword,
} from "../api/hyperionComponents";
import {
  BodyRecoverUserUsersRecoverPost,
  ResetPasswordRequest,
} from "../api/hyperionSchemas";
import { toast } from "../components/ui/use-toast";
import { useAuth } from "./useAuth";

export const useRecoverPassword = () => {
  const { token } = useAuth();

  const { mutate: mutateRecoverPassword, isPending: isRecoverLoading } =
    usePostUsersRecover();

  const recoverPassword = (email: string, callback: () => void) => {
    const body: BodyRecoverUserUsersRecoverPost = {
      email: email,
    };
    mutateRecoverPassword(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: () => {
          callback();
        },
      },
    );
  };

  const { mutate: mutateResetPassword, isPending: isResetLoading } =
    usePostUsersResetPassword();

  const resetPassword = (
    password: string,
    code: string,
    callback: () => void,
  ) => {
    const body: ResetPasswordRequest = {
      new_password: password,
      reset_token: code,
    };
    mutateResetPassword(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: () => {
          callback();
        },
      },
    );
  };

  return { recoverPassword, isRecoverLoading, resetPassword, isResetLoading };
};
