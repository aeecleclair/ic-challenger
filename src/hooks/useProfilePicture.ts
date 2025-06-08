import { useGetUsersMeProfilePicture } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

export const useProfilePicture = () => {
  const { token, isTokenExpired } = useAuth();

  const { data, isLoading } = useGetUsersMeProfilePicture<File>(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: token !== null && !isTokenExpired(),
      retry: 0,
    },
  );

  return { profilePicture: data, isLoading };
};
