"use client";

import { Match, MatchComplete } from "@/src/api/hyperionSchemas";
import { Button } from "@/src/components/ui/button";
import { useSportMatches } from "@/src/hooks/useSportMatches";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/src/components/ui/use-toast";
import Link from "next/link";
import { WarningDialog } from "@/src/components/custom/WarningDialog";
import {
  CalendarIcon,
  MapPinIcon,
  Flag,
  Trophy,
  Edit,
  Trash,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { useSports } from "@/src/hooks/useSports";

interface MatchDetailProps {
  match: MatchComplete;
}

const MatchDetail = ({ match }: MatchDetailProps) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteMatch, isDeleteLoading } = useSportMatches({
    sportId: match.sport_id,
  });
  const { sports } = useSports();

  const sportName =
    sports?.find((s) => s.id === match.sport_id)?.name || "Sport inconnu";

  const handleDelete = () => {
    deleteMatch(match.id, () => {
      router.push("/admin/matches");
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{match.name}</h1>
          <p className="text-muted-foreground">{sportName}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() =>
              router.push(`/admin/matches/edit?match_id=${match.id}`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Détails du match</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Information</h3>
                <div className="text-sm text-muted-foreground flex items-center mb-2">
                  <Flag className="w-4 h-4 mr-2" />
                  Sport: {sportName}
                </div>

                {match.date && (
                  <div className="text-sm text-muted-foreground flex items-center mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(new Date(match.date), "PPP 'à' p", { locale: fr })}
                  </div>
                )}

                {match.location_id && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {match.location_id}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-3">Statut</h3>
                {match.winner_id ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Trophy className="w-4 h-4 mr-1" />
                    Match terminé
                  </Badge>
                ) : (
                  <Badge variant="outline">Match à venir</Badge>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Résultat</h3>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="flex flex-col items-center">
                  <span className="font-medium mb-1">{match.team1.name}</span>
                  {match.score_team1 !== null ? (
                    <span className="text-2xl font-bold">
                      {match.score_team1}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                  {match.winner_id === match.team1_id && (
                    <Badge className="mt-2 bg-amber-100 text-amber-800">
                      <Trophy className="w-3 h-3 mr-1" />
                      Gagnant
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <Badge variant="outline" className="text-lg px-3">
                    VS
                  </Badge>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-medium mb-1">{match.team2.name}</span>
                  {match.score_team2 !== null ? (
                    <span className="text-2xl font-bold">
                      {match.score_team2}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                  {match.winner_id === match.team2_id && (
                    <Badge className="mt-2 bg-amber-100 text-amber-800">
                      <Trophy className="w-3 h-3 mr-1" />
                      Gagnant
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchDetail;
