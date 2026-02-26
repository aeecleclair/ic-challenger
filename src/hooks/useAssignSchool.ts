import { usePatchUsersUserId } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "../utils/errorTyping";

export const useAssignSchool = () => {
  const { token } = useAuth();

  const { mutate: mutateAssignSchool, isPending: isAssignLoading } =
    usePatchUsersUserId();

  const assignSchool = (
    userId: string,
    schoolId: string,
    callback: () => void,
  ) => {
    return mutateAssignSchool(
      {
        headers: { Authorization: `Bearer ${token}` },
        pathParams: { userId },
        body: { school_id: schoolId },
      },
      {
        onSettled: (data, error) => {
          if ((error as any)?.stack?.body || (error as any)?.stack?.detail) {
            toast({
              title: "Erreur lors de l'assignation",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            callback();
            toast({
              title: "École assignée",
              description: "L'utilisateur a été assigné à l'école.",
            });
          }
        },
      },
    );
  };

  return {
    assignSchool,
    isAssignLoading,
  };
};
