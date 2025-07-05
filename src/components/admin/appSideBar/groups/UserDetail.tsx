"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { UserMinus } from "lucide-react";
import { UserGroupMembership } from "@/src/api/hyperionSchemas";
import { AVAILABLE_GROUPS } from "@/src/infra/groups";

interface UserDetailProps {
  user: UserGroupMembership;
  onRemoveFromGroup: () => void;
}

const UserDetail = ({ user, onRemoveFromGroup }: UserDetailProps) => {
  const groupName =
    AVAILABLE_GROUPS.find((g) => g.id === user.group)?.name || user.group;
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            Détails de l&apos;utilisateur
          </CardTitle>
          <Badge variant="secondary">{groupName}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-lg">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {user.first_name} {user.last_name}
            </h2>
            <div className="text-muted-foreground">{user.email}</div>
            <div className="text-sm text-muted-foreground mt-1">
              ID: {user.user_id}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {user.school && (
            <div>
              <p className="text-sm font-medium">École</p>
              <p>{user.school}</p>
            </div>
          )}
          {user.group && (
            <div>
              <p className="text-sm font-medium">Groupe</p>
              <p>{groupName}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            variant="destructive"
            className="flex items-center"
            onClick={onRemoveFromGroup}
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Retirer du groupe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetail;
