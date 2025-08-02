"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { User, UserX } from "lucide-react";
import { UserGroupMembership } from "@/src/api/hyperionSchemas";
import { AVAILABLE_GROUPS } from "@/src/infra/groups";

interface GroupCardProps {
  user: UserGroupMembership;
  onClick: () => void;
  onRemove?: () => void;
}

const GroupCard = ({ user, onClick, onRemove }: GroupCardProps) => {
  const groupName =
    AVAILABLE_GROUPS.find((g) => g.id === user.group)?.name || user.group;
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {user.first_name} {user.last_name}
          </CardTitle>
          <Badge variant="secondary">{groupName}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.email}</div>
            <div className="text-sm text-muted-foreground">
              ID: {user.user_id}
            </div>
          </div>
        </div>
        {user.school && (
          <div className="mt-2 text-sm">
            <span className="font-medium">École:</span> {user.school}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 flex justify-between">
        <Button variant="ghost" onClick={onClick}>
          <User className="mr-2 h-4 w-4" />
          Voir détails
        </Button>
        {onRemove && (
          <Button
            variant="ghost"
            onClick={onRemove}
            className="text-destructive"
          >
            <UserX className="mr-2 h-4 w-4" />
            Retirer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
