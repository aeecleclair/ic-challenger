"use client";

import { UserCompetition } from "@/src/components/admin/userDetails/UserCompetition";
import { UserInfo } from "@/src/components/admin/userDetails/UserInfo";
import { UserPayments } from "@/src/components/admin/userDetails/UserPayments";
import { UserPurchases } from "@/src/components/admin/userDetails/UserPurchases";
import { useCompetitionUsers } from "@/src/hooks/useCompetitionUsers";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useProducts } from "@/src/hooks/useProducts";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useSchoolsPayments } from "@/src/hooks/useSchoolsPayments";
import { useSchoolsPurchases } from "@/src/hooks/useSchoolsPurchases";
import { useUser } from "@/src/hooks/useUser";
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

  const onDelete = (userId: string, sportId: string, isAthlete: boolean) => {
    if (isAthlete)
      deleteParticipant(sportId, userId, () => {
        deleteCompetitionUser(userId, () => {});
      });
    else deleteCompetitionUser(userId, () => {});
  };
  if (!canAccessSchool) {
    return <div className="p-6">Vous n&apos;avez pas accès à cette page</div>;
  }
  return (
    <div className="p-6 flex-col">
      <div>Détails de l&apos;utilisateur</div>

      {userCompetition ? (
        <UserInfo user={userCompetition} />
      ) : (
        <div>Utilisateur non trouvé</div>
      )}
      {userCompetition && userParticipant && (
        <UserCompetition
          user={userCompetition}
          userParticipant={userParticipant}
        />
      )}
      {userPurchases && products && (
        <UserPurchases userPurchases={userPurchases} products={products} />
      )}
      {userPayments && <UserPayments userPayments={userPayments} />}
    </div>
  );
};
