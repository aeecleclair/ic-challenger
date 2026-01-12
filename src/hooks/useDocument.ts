import { useGetCompetitionParticipantsUsersUserIdCertificate } from "../api/hyperionComponents";
import axios from "axios";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { useUser } from "./useUser";

export const useDocument = (userId: string | null) => {
  const backUrl: string =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr";
  const { token, userId: userMeId } = useAuth();
  const { isAdmin } = useUser();
  if (!isAdmin()) {
    userId = userMeId;
  }
  const uploadDocument = (
    file: Blob,
    sportId: string,
    callback: () => void,
  ) => {
    const formData = new FormData();
    formData.append("certificate", file);
    axios
      .post(
        `${backUrl}/competition/participants/sports/${sportId}/certificate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status > 300) {
          console.error(response.data);
          toast({
            title: "Erreur lors de l'ajout du document",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
          return;
        }
        refetch();
        callback();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du document",
          description:
            error.response?.data?.detail ||
            "Une erreur est survenue, veuillez réessayer plus tard",
          variant: "destructive",
        });
      });
  };

  const { data, refetch, isPending } =
    useGetCompetitionParticipantsUsersUserIdCertificate<File>(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId: userId!,
        },
      },
      {
        enabled: !!userId,
        queryHash: "getDocument",
      },
    );

  return {
    uploadDocument,
    data,
    refetch,
    isLoading: isPending,
  };
};
