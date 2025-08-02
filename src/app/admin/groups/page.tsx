"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { useGroups } from "@/src/hooks/useGroups";
import GroupCard from "@/src/components/admin/groups/GroupCard";
import UserDetail from "@/src/components/admin/groups/UserDetail";
import { WarningDialog } from "@/src/components/custom/WarningDialog";
import { AddUserDialog } from "@/src/components/admin/groups/AddUserDialog";
import { UserPlus } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { CompetitionGroupType } from "@/src/api/hyperionSchemas";
import { AVAILABLE_GROUPS } from "@/src/infra/groups";

export default function GroupsPage() {
  const router = useRouter();
  const searchParam = useSearchParams();

  const userId = searchParam.get("user_id");
  const groupParam =
    (searchParam.get("group_id") as CompetitionGroupType) ||
    ("schools_bds" as CompetitionGroupType);

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const {
    groups,
    createGroup,
    deleteGroup,
    isCreateLoading,
    isDeleteLoading,
    refetchGroups,
  } = useGroups({ group: groupParam });

  const selectedUser = userId
    ? groups?.find((group_user) => group_user.user_id === userId)
    : undefined;

  const selectedGroupName =
    AVAILABLE_GROUPS.find((g) => g.id === groupParam)?.name || groupParam;

  useEffect(() => {
    refetchGroups();
  }, [groupParam, refetchGroups]);

  const handleDelete = (userId: string) => {
    setDeleteUserId(userId);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      deleteGroup(deleteUserId, () => {
        if (deleteUserId === userId) {
          router.push(`/admin/groups?group_id=${groupParam}`);
        }
        setDeleteUserId(null);
      });
    }
  };

  const handleAddUser = (userId: string) => {
    createGroup(userId, () => {
      setIsAddUserOpen(false);
    });
  };

  return (
    <div className="flex w-full flex-col p-6">
      {selectedUser ? (
        <>
          <div className="mb-6">
            <Link
              href={`/admin/groups?group_id=${groupParam}`}
              className="text-sm text-primary hover:underline"
            >
              &larr; Retour à la liste des utilisateurs
            </Link>
          </div>
          <UserDetail
            user={selectedUser}
            onRemoveFromGroup={() => handleDelete(selectedUser.user_id)}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Gestion des groupes {selectedGroupName}
            </h1>
            <Button
              className="flex items-center"
              onClick={() => setIsAddUserOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>

          <div className="mt-4">
            {groups && groups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group_user) => (
                  <GroupCard
                    key={group_user.user_id}
                    user={group_user}
                    onClick={() => {
                      router.push(
                        `/admin/groups?user_id=${group_user.user_id}&group_id=${groupParam}`,
                      );
                    }}
                    onRemove={() => handleDelete(group_user.user_id)}
                  />
                ))}
              </div>
            ) : groups ? (
              <div className="flex items-center justify-center h-full mt-10">
                <p className="text-gray-500">
                  Aucun utilisateur trouvé dans ce groupe
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full" />
                  ))}
              </div>
            )}
          </div>
        </>
      )}

      <WarningDialog
        isOpened={!!deleteUserId}
        setIsOpened={(open) => !open && setDeleteUserId(null)}
        isLoading={isDeleteLoading}
        title="Retirer l'utilisateur"
        description="Êtes-vous sûr de vouloir retirer cet utilisateur du groupe ? Cette action est irréversible."
        validateLabel="Supprimer"
        callback={confirmDelete}
      />

      <AddUserDialog
        isOpen={isAddUserOpen}
        setIsOpen={setIsAddUserOpen}
        onAddUser={handleAddUser}
        isLoading={isCreateLoading}
        groupName={selectedGroupName}
      />
    </div>
  );
}
