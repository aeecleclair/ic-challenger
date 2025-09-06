import {
  useGetSchools,
  usePostSchools,
  usePatchSchoolsSchoolId,
} from "@/src/api/hyperionComponents";
import { useUser } from "./useUser";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";
import { CoreSchoolBase, CoreSchoolUpdate } from "../api/hyperionSchemas";

export const useSchools = () => {
  const { token, isTokenExpired } = useAuth();
  const { isAdmin } = useUser();
  const NoSchoolId = "dce19aa2-8863-4c93-861e-fb7be8f610ed";

  const {
    data: schools,
    isLoading,
    refetch: refetchSchools,
    error,
  } = useGetSchools(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: isAdmin() && !isTokenExpired(),
      retry: 0,
      queryHash: "getSchools",
    },
  );

  const { mutate: mutateCreateSchool, isPending: isCreateLoading } =
    usePostSchools();

  const createSchool = (body: CoreSchoolBase, callback: () => void) => {
    return mutateCreateSchool(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de l'ajout de l'établissement",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSchools();
            callback();
            toast({
              title: "Établissement ajouté",
              description: "L'établissement a été ajouté avec succès.",
            });
          }
        },
      },
    );
  };

  const { mutate: mutateUpdateSchool, isPending: isUpdateLoading } =
    usePatchSchoolsSchoolId();

  const updateSchool = (
    schoolId: string,
    body: CoreSchoolUpdate,
    callback: () => void,
  ) => {
    return mutateUpdateSchool(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
        pathParams: {
          schoolId,
        },
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la modification de l'établissement",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchSchools();
            callback();
            toast({
              title: "Établissement modifié",
              description: "L'établissement a été modifié avec succès.",
            });
          }
        },
      },
    );
  };

  const filteredSchools = schools?.filter((school) => school.id !== NoSchoolId);

  return {
    schools,
    filteredSchools,
    createSchool,
    updateSchool,
    error,
    isLoading,
    isCreateLoading,
    isUpdateLoading,
    refetchSchools,
  };
};
