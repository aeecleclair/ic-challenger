"use client";

import { UserCompetition } from "@/src/components/admin/userDetails/UserCompetition";
import { UserInfo } from "@/src/components/admin/userDetails/UserInfo";
import { UserPayments } from "@/src/components/admin/userDetails/UserPayments";
import { UserPurchases } from "@/src/components/admin/userDetails/UserPurchases";
import { Button } from "@/src/components/ui/button";
import { useCompetitionUsers } from "@/src/hooks/useCompetitionUsers";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useProducts } from "@/src/hooks/useProducts";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useSchoolsPayments } from "@/src/hooks/useSchoolsPayments";
import { useSchoolsPurchases } from "@/src/hooks/useSchoolsPurchases";
import { useUser } from "@/src/hooks/useUser";
import { ArrowLeft, Users } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

const UserDetailsPage = () => {
  const searchParam = useSearchParams();
  const userId = searchParam.get("user_id");
  const { me: currentUser, isAdmin } = useUser();

  const {
    competitionUsers,
    validateCompetitionUser,
    isValidateLoading,
    invalidateCompetitionUser,
    isInvalidateLoading,
    deleteCompetitionUser,
    isDeleteLoading,
  } = useCompetitionUsers();
  const userCompetition = competitionUsers
    ? competitionUsers.find((cu) => cu.user_id === userId)
    : undefined;
  const schoolId = userCompetition?.user.school_id;

  const { products } = useProducts();

  const userSchoolId = currentUser?.school_id;
  const canAccessSchool = isAdmin() || schoolId === userSchoolId;

  const { schoolParticipants, refetchParticipantSchools } =
    useSchoolParticipants({
      schoolId: schoolId || "",
    });
  const userParticipant = schoolParticipants
    ? schoolParticipants.find((sp) => sp.user_id === userId)
    : undefined;

  const { schoolsPurchases, refetchSchoolsPurchases } = useSchoolsPurchases({
    schoolId: schoolId || "",
  });
  const userPurchases = schoolsPurchases
    ? schoolsPurchases[userId as string]
    : undefined;

  const { schoolsPayments } = useSchoolsPayments({
    schoolId: schoolId || "",
  });
  const userPayments = schoolsPayments
    ? schoolsPayments[userId as string]
    : undefined;

  const { deleteParticipant } = useParticipant();

  const onValidate = (userId: string) => {
    validateCompetitionUser(userId, () => {});
  };

  const onInvalidate = (userId: string) => {
    invalidateCompetitionUser(userId, () => {});
  };

  const onDelete = (userId: string) => {
    if (userParticipant)
      deleteParticipant(userParticipant.sport_id, userId, () => {
        deleteCompetitionUser(userId, () => {});
      });
    else deleteCompetitionUser(userId, () => {});
  };
  if (!canAccessSchool) {
    return <div className="p-6">Vous n&apos;avez pas accès à cette page</div>;
  }
  const userName =
    userCompetition?.user.firstname || userCompetition?.user.name
      ? `${userCompetition.user.firstname || ""} ${userCompetition.user.name || ""}`.trim()
      : "Utilisateur";
  return (
    <div className="flex w-full flex-col space-y-6">
      <div>Détails de l&apos;utilisateur</div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            {userName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {userCompetition && (
            <Button
              variant="outline"
              onClick={() =>
                userCompetition?.validated
                  ? onInvalidate(userCompetition.user_id)
                  : onValidate(userCompetition.user_id)
              }
              className="gap-2"
            >
              {userCompetition?.validated ? "Invalider" : "Valider"}
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => onDelete(userId as string)}
            className="gap-2"
          >
            Supprimer
          </Button>
        </div>
      </div>

      {userCompetition ? (
        <UserInfo user={userCompetition} />
      ) : (
        <div>Utilisateur non trouvé</div>
      )}
      {userCompetition && (
        <UserCompetition
          user={userCompetition}
          userParticipant={userParticipant}
        />
      )}
      {userPurchases && products && (
        <UserPurchases userPurchases={userPurchases} products={products} />
      )}
      {userPayments && userCompetition && (
        <UserPayments user={userCompetition} userPayments={userPayments} />
      )}
    </div>
  );
};

export default UserDetailsPage;
