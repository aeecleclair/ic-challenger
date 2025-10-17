"use client";

import { TeamComplete } from "@/src/api/hyperionSchemas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Users, Crown, Trophy, Edit, Trash2, Shield } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useSportSchools } from "@/src/hooks/useSportSchools";

interface TeamCardProps {
  team: TeamComplete;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TeamCard = ({ team, onEdit, onDelete }: TeamCardProps) => {
  const { sports } = useSports();
  const { sportSchools } = useSportSchools();

  const sportName =
    sports?.find((sport) => sport.id === team.sport_id)?.name || team.sport_id;
  const schoolName =
    sportSchools?.find((school) => school.school_id === team.school_id)?.school
      .name || "";

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 flex items-center gap-2">
            {team.name}
          </CardTitle>
          <div className="flex gap-1">
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              <Trophy className="h-3 w-3 mr-1" />
              {sportName}
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 border-green-200"
            >
              {schoolName ? formatSchoolName(schoolName) : "Non spécifiée"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 flex-grow">
        {/* Team Info */}
        <div className="space-y-3">
          {/* Captain */}
          {team.captain_id && (
            <div className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">Capitaine:</span>
              <span className="text-muted-foreground">
                {team.participants?.find((p) => p.user_id === team.captain_id)
                  ?.user?.user?.firstname || ""}{" "}
                {team.participants?.find((p) => p.user_id === team.captain_id)
                  ?.user?.user?.name || ""}
              </span>
            </div>
          )}

          {/* Team Statistics */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Membres: {team.participants?.length || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex-1 hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TeamCard;
